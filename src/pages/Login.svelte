<script>
  import { toasts } from "svelte-toasts";
  import MainContentLayout from "../layouts/MainContentLayout.svelte";
  import { AxiosError } from "axios";
  import sha256 from "sha256";
  import { login } from "../thunks/GeneralThunk";
  import { authStore } from "../stores/AuthStore";

  let idInput = "";
  let passwordInput = "";

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
        const { uid, userId } = resp;
        authStore.set({
          uid,
          userId,
          authorized: true,
        });
        console.log(localStorage.getItem("auth"));
        window.location.href = "/";
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
            background-color: rgb(154, 114, 35);
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
          color: rgb(154, 114, 35);
        }
      }
    }
  }
</style>
