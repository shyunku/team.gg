<script>
  import { onDestroy, onMount } from "svelte";
  import { toasts } from "svelte-toasts";
  import MainContentLayout from "../layouts/MainContentLayout.svelte";
  import { getAuth } from "../stores/AuthStore";
  import { openRsoPopup } from "../utils/RsoPopup";
  import { getApiErrorMessage } from "../utils/ApiError";
  import {
    getMyAccount,
    getRsoLoginStatus,
    startRsoLink,
    unlinkRiotAccount,
  } from "../thunks/GeneralThunk";

  let account = null;
  let loading = true;
  let linking = false;
  let linkAttempt = 0;

  const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  const loadAccount = async () => {
    if (!getAuth()?.authorized) {
      window.location.href = "#/login";
      return;
    }
    loading = true;
    try {
      account = await getMyAccount();
    } catch (err) {
      toasts.add({ title: "계정 정보 오류", description: getApiErrorMessage(err, "계정 정보를 불러오지 못했습니다."), type: "error" });
    } finally {
      loading = false;
    }
  };

  const connectRiot = async () => {
    if (linking) return;
    const currentAttempt = ++linkAttempt;
    linking = true;
    const electron = window?.require?.("electron");
    const electronShell = electron?.shell?.openExternal ? electron.shell : null;
    let loginWindow = null;
    let navigated = false;
    try {
      if (!electronShell) {
        loginWindow = openRsoPopup();
      }
      const { flowId, authorizeUrl } = await startRsoLink();
      if (electronShell) await electronShell.openExternal(authorizeUrl);
      else {
        loginWindow.location.replace(authorizeUrl);
        navigated = true;
      }

      for (let count = 0; count < 150 && currentAttempt === linkAttempt; count++) {
        await sleep(2000);
        const result = await getRsoLoginStatus(flowId);
        if (result.status === "pending") continue;
        if (result.status === "error") throw new Error(result.error || "Riot 계정을 연결하지 못했습니다.");
        if (result.status === "complete") {
          if (loginWindow && !loginWindow.closed) loginWindow.close();
          await loadAccount();
          toasts.add({ title: "Riot 계정 연결", description: `${result.riotDisplayName || "Riot 계정"} 연결이 완료되었습니다.`, type: "success" });
          return;
        }
        throw new Error("올바르지 않은 Riot 연결 응답입니다.");
      }
      throw new Error("Riot 계정 연결 시간이 만료되었습니다.");
    } catch (err) {
      if (loginWindow && !loginWindow.closed && !navigated) loginWindow.close();
      toasts.add({ title: "Riot 연결 실패", description: getApiErrorMessage(err, "Riot 계정을 연결하지 못했습니다."), type: "error" });
    } finally {
      if (currentAttempt === linkAttempt) linking = false;
    }
  };

  const disconnectRiot = async () => {
    if (!window.confirm("Riot 계정 연결을 해제하시겠습니까?")) return;
    try {
      await unlinkRiotAccount();
      await loadAccount();
      toasts.add({ title: "Riot 계정 연결", description: "연결을 해제했습니다.", type: "success" });
    } catch (err) {
      toasts.add({ title: "연결 해제 실패", description: getApiErrorMessage(err, "연결을 해제하지 못했습니다."), type: "error" });
    }
  };

  onMount(loadAccount);
  onDestroy(() => linkAttempt++);
</script>

<MainContentLayout>
  <div class="account-page">
    <h1>내 정보</h1>
    {#if loading}
      <div class="account-card loading">계정 정보를 불러오는 중...</div>
    {:else if account}
      <section class="account-card">
        <div class="section-title">team.gg 계정</div>
        <div class="info-row"><span>아이디</span><strong>{account.userId}</strong></div>
      </section>
      <section class="account-card">
        <div class="section-title">Riot 계정</div>
        {#if account.riot?.connected}
          <div class="info-row"><span>연결된 계정</span><strong>{account.riot.displayName}</strong></div>
          {#if account.riot.canUnlink}
            <button class="disconnect" on:click={disconnectRiot}>연결 해제</button>
          {:else}
            <div class="hint">Riot 로그인 전용 계정은 연결을 해제할 수 없습니다.</div>
          {/if}
        {:else}
          <div class="empty">연결된 Riot 계정이 없습니다.</div>
          <button class="connect" disabled={linking} on:click={connectRiot}>
            {linking ? "Riot 인증 대기 중..." : "Riot 계정 연결"}
          </button>
        {/if}
      </section>
    {/if}
  </div>
</MainContentLayout>

<style lang="scss">
  @import "../styles/variables.scss";

  .account-page {
    width: 620px;
    max-width: calc(100vw - 40px);
    padding: 55px 0;
    color: $main-fg-color;

    h1 {
      margin: 0 0 20px;
      font-size: 25px;
    }
  }

  .account-card {
    margin-bottom: 14px;
    padding: 22px;
    border: 1px solid $main-border-color;
    border-radius: 4px;
    background: $sub-bg-color;

    &.loading,
    .empty,
    .hint {
      color: rgba(205, 190, 145, 0.6);
      font-size: 13px;
    }

    .section-title {
      margin-bottom: 18px;
      font-size: 15px;
      font-weight: bold;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-top: 1px solid $sub-border-color;
      font-size: 13px;

      span { color: rgba(205, 190, 145, 0.6); }
      strong { color: #f0e6d2; }
    }

    button {
      width: 100%;
      height: 40px;
      margin-top: 18px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    }

    .connect {
      border: 1px solid rgb(209, 54, 57);
      background: rgb(209, 54, 57);
      color: white;
    }

    .disconnect {
      border: 1px solid $main-border-color;
      background: transparent;
      color: rgba(205, 190, 145, 0.75);
    }
  }
</style>
