<script>
  import { onDestroy, onMount } from "svelte";
  import { toasts } from "svelte-toasts";
  import MainContentLayout from "../layouts/MainContentLayout.svelte";
  import SafeImg from "../atoms/SafeImg.svelte";
  import FaUserCircle from "svelte-icons/fa/FaUserCircle.svelte";
  import { getAuth } from "../stores/AuthStore";
  import { openRsoPopup } from "../utils/RsoPopup";
  import { getApiErrorMessage } from "../utils/ApiError";
  import {
    getMyAccount,
    getRsoLoginStatus,
    profileIconUrl,
    setPrimaryRiotAccount,
    startRsoLink,
    unlinkRiotAccount,
  } from "../thunks/GeneralThunk";

  let account = null;
  let loading = true;
  let linking = false;
  let workingPuuid = null;
  let linkAttempt = 0;
  let riotAccounts = [];

  $: riotAccounts = account?.riot?.accounts ?? (account?.riot?.connected ? [account.riot] : []);

  const notifyAccountUpdated = () => window.dispatchEvent(new CustomEvent("teamgg:account-updated"));

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
          notifyAccountUpdated();
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

  const disconnectRiot = async (riotAccount) => {
    if (!window.confirm(`${riotAccount.displayName} 계정 연결을 해제하시겠습니까?`)) return;
    workingPuuid = riotAccount.puuid;
    try {
      await unlinkRiotAccount(riotAccount.puuid);
      await loadAccount();
      notifyAccountUpdated();
      toasts.add({ title: "Riot 계정 연결", description: "연결을 해제했습니다.", type: "success" });
    } catch (err) {
      toasts.add({ title: "연결 해제 실패", description: getApiErrorMessage(err, "연결을 해제하지 못했습니다."), type: "error" });
    } finally {
      workingPuuid = null;
    }
  };

  const makePrimary = async (riotAccount) => {
    if (riotAccount.isPrimary || workingPuuid) return;
    workingPuuid = riotAccount.puuid;
    try {
      await setPrimaryRiotAccount(riotAccount.puuid);
      await loadAccount();
      notifyAccountUpdated();
      toasts.add({ title: "대표 Riot 계정", description: `${riotAccount.displayName} 계정을 대표 계정으로 설정했습니다.`, type: "success" });
    } catch (err) {
      toasts.add({ title: "대표 계정 변경 실패", description: getApiErrorMessage(err, "대표 계정을 변경하지 못했습니다."), type: "error" });
    } finally {
      workingPuuid = null;
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
          <div class="riot-account-list">
            {#each riotAccounts as riotAccount (riotAccount.puuid)}
              <div class:primary={riotAccount.isPrimary} class="riot-account-row">
                <div class="riot-account-icon">
                  {#if riotAccount.profileIconId != null}
                    <SafeImg src={profileIconUrl(riotAccount.profileIconId)} />
                  {:else}
                    <FaUserCircle />
                  {/if}
                </div>
                <div class="riot-account-name">
                  <strong>{riotAccount.displayName}</strong>
                  {#if riotAccount.isPrimary}<span class="primary-badge">대표</span>{/if}
                </div>
                <div class="riot-account-actions">
                  {#if !riotAccount.isPrimary}
                    <button disabled={workingPuuid != null} on:click={() => makePrimary(riotAccount)}>대표 지정</button>
                  {/if}
                  <button
                    class="disconnect"
                    disabled={!riotAccount.canUnlink || workingPuuid != null}
                    title={riotAccount.canUnlink ? "연결 해제" : "Riot 로그인 전용 계정의 마지막 연결은 해제할 수 없습니다."}
                    on:click={() => disconnectRiot(riotAccount)}
                  >연결 해제</button>
                </div>
              </div>
            {/each}
          </div>
          {#if riotAccounts.length === 1 && !riotAccounts[0].canUnlink}
            <div class="hint">Riot 로그인 전용 계정의 마지막 Riot 연결은 해제할 수 없습니다.</div>
          {/if}
        {:else}
          <div class="empty">연결된 Riot 계정이 없습니다.</div>
        {/if}
        <button class="connect" disabled={linking || workingPuuid != null} on:click={connectRiot}>
          {linking ? "Riot 인증 대기 중..." : account.riot?.connected ? "Riot 계정 추가 연결" : "Riot 계정 연결"}
        </button>
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
    border-radius: 9px;
    background: linear-gradient(145deg, $color-surface-raised, $color-surface);
    box-shadow: $shadow-card;

    &.loading,
    .empty,
    .hint {
      color: rgba(173, 182, 209, 0.6);
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

      span { color: rgba(173, 182, 209, 0.6); }
      strong { color: var(--color-text-primary); }
    }

    .riot-account-list {
      border-top: 1px solid $sub-border-color;
    }

    .riot-account-row {
      display: flex;
      min-height: 54px;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid $sub-border-color;

      &.primary { background: rgba(84, 195, 154, 0.06); }
    }

    .riot-account-icon {
      width: 32px;
      height: 32px;
      flex: 0 0 32px;
      overflow: hidden;
      border-radius: 50%;
      background: rgba(173, 182, 209, 0.12);

      :global(img) { width: 100%; height: 100%; object-fit: cover; }
      :global(svg) { width: 100%; height: 100%; color: rgba(173, 182, 209, 0.7); }
    }

    .riot-account-name {
      display: flex;
      min-width: 0;
      flex: 1;
      align-items: center;
      gap: 8px;

      strong { overflow: hidden; color: var(--color-text-primary); font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
    }

    .primary-badge {
      padding: 2px 6px;
      border-radius: 10px;
      background: rgba(84, 195, 154, 0.18);
      color: var(--color-success);
      font-size: 11px;
    }

    .riot-account-actions {
      display: flex;
      gap: 6px;

      button {
        width: auto;
        height: 28px;
        margin: 0;
        padding: 0 9px;
        border: 1px solid $main-border-color;
        background: transparent;
        color: rgba(173, 182, 209, 0.8);
        font-size: 11px;
      }
    }

    button {
      width: 100%;
      height: 40px;
      margin-top: 18px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;

      &:disabled {
        cursor: default;
        opacity: 0.45;
      }
    }

    .connect {
      border: 1px solid rgb(209, 54, 57);
      background: rgb(209, 54, 57);
      color: white;
    }

    .disconnect {
      border: 1px solid $main-border-color;
      background: transparent;
      color: rgba(173, 182, 209, 0.75);
    }
  }
</style>
