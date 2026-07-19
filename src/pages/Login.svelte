<script>
  import { onDestroy } from "svelte";
  import { toasts } from "svelte-toasts";
  import MainContentLayout from "../layouts/MainContentLayout.svelte";
  import { AxiosError } from "axios";
  import sha256 from "sha256";
  import {
    completeRsoWithExistingAccount,
    completeRsoWithNewAccount,
    getRsoLoginStatus,
    login,
    startRsoLogin,
  } from "../thunks/GeneralThunk";
  import { authStore } from "../stores/AuthStore";
  import { openRsoPopup } from "../utils/RsoPopup";
  import { getApiErrorMessage } from "../utils/ApiError";

  let idInput = "";
  let passwordInput = "";
  let riotLoginInProgress = false;
  let riotLoginMessage = "";
  let riotLoginAttempt = 0;
  let riotSetupToken = "";
  let riotDisplayName = "";
  let showExistingAccountForm = false;
  let existingIdInput = "";
  let existingPasswordInput = "";

  const saveLogin = (resp) => {
    const { uid, userId, accessToken, refreshToken } = resp;
    authStore.set({
      uid,
      userId,
      authorized: true,
      accessToken,
      refreshToken,
    });
    window.location.href = "#/";
  };

  const getElectronShell = () => {
    const electron = window?.require?.("electron");
    return electron?.shell?.openExternal ? electron.shell : null;
  };

  const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

  const tryRiotLogin = async () => {
    if (riotLoginInProgress) return;

    const currentAttempt = ++riotLoginAttempt;
    riotLoginInProgress = true;
    riotLoginMessage = "Riot 로그인 페이지를 여는 중입니다...";
    riotSetupToken = "";
    riotDisplayName = "";
    showExistingAccountForm = false;
    const electronShell = getElectronShell();
    let loginWindow = null;
    let loginWindowNavigated = false;

    try {
      // Web browsers may block window.open after the asynchronous start request.
      // Reserve the tab synchronously while the click gesture is still active.
      if (!electronShell) {
        loginWindow = openRsoPopup();
      }

      const { flowId, authorizeUrl } = await startRsoLogin();
      if (electronShell) {
        await electronShell.openExternal(authorizeUrl);
      } else {
        loginWindow.location.replace(authorizeUrl);
        loginWindowNavigated = true;
      }
      riotLoginMessage = "브라우저에서 Riot 계정 인증을 완료해주세요.";

      for (let count = 0; count < 150 && currentAttempt === riotLoginAttempt; count++) {
        await sleep(2000);
        const result = await getRsoLoginStatus(flowId);
        if (result.status === "pending") continue;
        if (result.status === "error") {
          throw new Error(result.error || "Riot 인증에 실패했습니다.");
        }
        if (result.status === "action_required" && result.setupToken) {
          if (loginWindow && !loginWindow.closed) loginWindow.close();
          riotSetupToken = result.setupToken;
          riotDisplayName = result.riotDisplayName || "Riot 계정";
          riotLoginMessage = "기존 team.gg 계정 연결 또는 신규 생성을 선택해주세요.";
          return;
        }
        if (result.status === "complete" && result.login) {
          riotLoginMessage = "로그인 완료";
          if (loginWindow && !loginWindow.closed) loginWindow.close();
          saveLogin(result.login);
          return;
        }
        throw new Error("올바르지 않은 Riot 로그인 응답입니다.");
      }
      throw new Error("Riot 로그인 시간이 만료되었습니다.");
    } catch (err) {
      console.error(err);
      if (loginWindow && !loginWindow.closed && !loginWindowNavigated) {
        loginWindow.close();
      }
      riotLoginMessage = "";
      toasts.add({
        title: "Riot 로그인 오류",
        description: getApiErrorMessage(err, "Riot 계정으로 로그인하지 못했습니다."),
        type: "error",
      });
    } finally {
      if (currentAttempt === riotLoginAttempt) riotLoginInProgress = false;
    }
  };

  const completeWithExistingAccount = async () => {
    if (!existingIdInput || !existingPasswordInput) {
      toasts.add({ title: "계정 연결", description: "기존 계정 정보를 입력해주세요.", type: "warning" });
      return;
    }
    riotLoginInProgress = true;
    try {
      const encryptedPassword = sha256(existingIdInput + existingPasswordInput);
      const response = await completeRsoWithExistingAccount(riotSetupToken, existingIdInput, encryptedPassword);
      saveLogin(response);
    } catch (err) {
      toasts.add({ title: "계정 연결 실패", description: getApiErrorMessage(err, "계정을 연결하지 못했습니다."), type: "error" });
    } finally {
      riotLoginInProgress = false;
    }
  };

  const completeWithNewAccount = async () => {
    riotLoginInProgress = true;
    try {
      const response = await completeRsoWithNewAccount(riotSetupToken);
      saveLogin(response);
    } catch (err) {
      toasts.add({ title: "계정 생성 실패", description: getApiErrorMessage(err, "계정을 생성하지 못했습니다."), type: "error" });
    } finally {
      riotLoginInProgress = false;
    }
  };

  const goToSignup = () => {
    window.location.href = "#/signup";
  };

  const tryLogin = async () => {
    try {
      if (idInput.length === 0) {
        toasts.add({ title: "로그인 오류", description: "아이디를 입력해주세요.", type: "warning" });
        return;
      }
      if (passwordInput.length === 0) {
        toasts.add({ title: "로그인 오류", description: "비밀번호를 입력해주세요.", type: "warning" });
        return;
      }
      const encryptedPassword = sha256(idInput + passwordInput);
      try {
        const resp = await login(idInput, encryptedPassword);
        saveLogin(resp);
      } catch (err) {
        if (err instanceof AxiosError) {
          const code = err.response?.status;
          switch (code) {
            case 401:
              toasts.add({
                title: "로그인 오류",
                description: "아이디 또는 비밀번호가 일치하지 않습니다.",
                type: "error",
              });
              return;
            default:
              throw err;
          }
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error(err);
      toasts.add({ title: "로그인 오류", description: "알 수 없는 오류가 발생했습니다.", type: "warning" });
    }
  };

  onDestroy(() => {
    riotLoginAttempt++;
  });
</script>

<MainContentLayout>
  <div class="login-content-wrapper">
    <div class="login-form card">
      <div class="title">로그인</div>
      <div class="form">
        <div class="form-item">
          <div class="label">아이디</div>
          <input type="text" spellcheck="false" bind:value={idInput} />
        </div>
        <div class="form-item">
          <div class="label">비밀번호</div>
          <input
            type="password"
            bind:value={passwordInput}
            on:keyup={(e) => {
              if (e.key === "Enter") {
                tryLogin();
              }
            }}
          />
        </div>
        <div class="option">
          <div class="label">아직 회원이 아니신가요?</div>
          <div class="link" on:mouseup={goToSignup}>회원가입</div>
        </div>
        <div class="form-item">
          <button on:click={tryLogin}>로그인</button>
        </div>
        <div class="login-separator"><span>또는</span></div>
        <button
          class="riot-login"
          class:loading={riotLoginInProgress}
          disabled={riotLoginInProgress}
          on:click={tryRiotLogin}
        >
          {riotLoginInProgress ? "Riot 인증 대기 중" : "RIOT 계정으로 로그인"}
        </button>
        {#if riotLoginMessage}
          <div class="riot-login-message">{riotLoginMessage}</div>
        {/if}
        {#if riotSetupToken}
          <div class="riot-account-setup">
            <div class="verified-riot-account">
              <span>인증된 Riot 계정</span>
              <strong>{riotDisplayName}</strong>
            </div>
            {#if showExistingAccountForm}
              <input type="text" placeholder="기존 team.gg 아이디" bind:value={existingIdInput} />
              <input
                type="password"
                placeholder="기존 team.gg 비밀번호"
                bind:value={existingPasswordInput}
                on:keyup={(event) => {
                  if (event.key === "Enter" && !riotLoginInProgress) completeWithExistingAccount();
                }}
              />
              <div class="setup-actions">
                <button class="secondary" on:click={() => (showExistingAccountForm = false)}>뒤로</button>
                <button disabled={riotLoginInProgress} on:click={completeWithExistingAccount}>계정 연결</button>
              </div>
            {:else}
              <button class="existing-account" on:click={() => (showExistingAccountForm = true)}>
                기존 team.gg 계정에 연결
              </button>
              <button class="new-account" disabled={riotLoginInProgress} on:click={completeWithNewAccount}>
                신규 team.gg 계정 생성
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</MainContentLayout>

<style lang="scss">
  @import "../styles/variables.scss";

  @media screen and (max-width: 460px) {
    .login-form {
      width: 100% !important;
      margin: 0 20px;
    }
  }

  .login-content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $main-fg-color;
    padding-top: 100px;
    width: 100%;
    box-sizing: border-box;

    .login-form {
      display: flex;
      flex-direction: column;
      width: 400px;
      padding: 30px;
      box-sizing: border-box;
      border: 1px solid $color-border;
      border-radius: 10px;
      background: linear-gradient(145deg, $color-surface-raised, $color-surface);
      box-shadow: $shadow-card;

      .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .form {
        display: flex;
        flex-direction: column;

        .form-item {
          display: flex;
          flex-direction: column;
          margin-top: 15px;

          .label {
            font-size: 14px;
            margin-bottom: 10px;
          }

          input {
            height: 40px;
            border: 1px solid $main-border-color;
            border-radius: 5px;
            padding: 3px 10px;
            color: $main-fg-color;
          }

          button {
            margin-top: 20px;
            height: 40px;
            border-radius: 5px;
            border: none;
            background: linear-gradient(90deg, $color-accent, $color-accent-hover);
            color: white;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }

      .option {
        display: flex;
        margin-top: 10px;
        font-size: 13px;
        opacity: 0.7;

        .label {
          margin-right: 10px;
        }

        .link {
          cursor: pointer;
          color: $color-accent-hover;
        }
      }

      .login-separator {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 20px 0;
        color: rgba(173, 182, 209, 0.45);
        font-size: 11px;

        &::before,
        &::after {
          content: "";
          flex: 1;
          height: 1px;
          background-color: rgba(173, 182, 209, 0.18);
        }
      }

      .riot-login {
        height: 42px;
        border: 1px solid rgb(209, 54, 57);
        border-radius: 5px;
        background-color: rgb(209, 54, 57);
        color: white;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;

        &:hover:not(:disabled) {
          background-color: rgb(235, 70, 73);
        }

        &:disabled {
          opacity: 0.6;
          cursor: wait;
        }
      }

      .riot-login-message {
        margin-top: 10px;
        color: rgba(173, 182, 209, 0.7);
        font-size: 11px;
        text-align: center;
      }

      .riot-account-setup {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 14px;
        padding: 14px;
        border: 1px solid $sub-border-color;
        border-radius: 5px;
        background: rgba(3, 7, 19, 0.58);

        .verified-riot-account {
          display: flex;
          justify-content: space-between;
          color: rgba(173, 182, 209, 0.7);
          font-size: 12px;

          strong {
            color: $main-fg-color;
          }
        }

        input {
          height: 36px;
          box-sizing: border-box;
          border: 1px solid $main-border-color;
          border-radius: 5px;
          padding: 3px 10px;
          color: $main-fg-color;
        }

        button {
          height: 38px;
          border: 1px solid var(--color-accent);
          border-radius: 5px;
          background: var(--color-accent);
          color: white;
          cursor: pointer;

          &.new-account,
          &.secondary {
            border-color: $main-border-color;
            background: transparent;
            color: $main-fg-color;
          }
        }

        .setup-actions {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 8px;
        }
      }
    }
  }
</style>
