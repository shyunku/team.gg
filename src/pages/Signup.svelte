<script>
  import { toasts } from "svelte-toasts";
  import MainContentLayout from "../layouts/MainContentLayout.svelte";
  import { AxiosError } from "axios";
  import { signup } from "../thunks/GeneralThunk";
  import sha256 from "sha256";

  let idInput = "";
  let passwordInput = "";
  let passwordConfirmInput = "";

  const goToLogin = () => {
    window.location.href = "#/login";
  };

  const trySignup = async () => {
    try {
      if (idInput.length < 4) {
        toasts.add({ title: "회원가입 오류", description: "아이디는 4자 이상이어야 합니다.", type: "warning" });
        return;
      }
      if (passwordInput.length < 6) {
        toasts.add({ title: "회원가입 오류", description: "비밀번호는 6자 이상이어야 합니다.", type: "warning" });
        return;
      }
      if (passwordInput !== passwordConfirmInput) {
        toasts.add({ title: "회원가입 오류", description: "비밀번호가 일치하지 않습니다.", type: "warning" });
        return;
      }

      try {
        const encryptedPassword = sha256(idInput + passwordInput);
        await signup(idInput, encryptedPassword);
      } catch (err) {
        if (err instanceof AxiosError) {
          const code = err.response?.status;
          switch (code) {
            case 409:
              toasts.add({ title: "회원가입 오류", description: "이미 존재하는 아이디입니다.", type: "error" });
              return;
            default:
              throw err;
          }
        } else {
          throw err;
        }
      }

      toasts.add({ title: "회원가입 완료", description: "회원가입에 성공했습니다.", type: "success" });
      window.location.href = "#/login";
    } catch (err) {
      console.error(err);
      toasts.add({ title: "회원가입 오류", description: "알 수 없는 오류가 발생했습니다.", type: "warning" });
    }
  };
</script>

<MainContentLayout>
  <div class="signup-content-wrapper">
    <div class="signup-form card">
      <div class="title">회원가입</div>
      <div class="form">
        <div class="form-item">
          <div class="label">아이디</div>
          <input type="text" spellcheck="false" placeholder="최소 4자 이상" bind:value={idInput} />
        </div>
        <div class="form-item">
          <div class="label">비밀번호</div>
          <input type="password" placeholder="최소 6자 이상" bind:value={passwordInput} />
        </div>
        <div class="form-item">
          <div class="label">비밀번호 확인</div>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            bind:value={passwordConfirmInput}
            on:keyup={(e) => {
              if (e.key === "Enter") trySignup();
            }}
          />
        </div>
        <div class="option">
          <div class="label">이미 회원이신가요?</div>
          <div class="link" on:mouseup={goToLogin}>로그인</div>
        </div>
        <div class="form-item">
          <button on:click={trySignup}>회원가입</button>
        </div>
      </div>
    </div>
  </div>
</MainContentLayout>

<style lang="scss">
  @import "../styles/variables.scss";

  @media screen and (max-width: 460px) {
    .signup-form {
      width: 100% !important;
      margin: 0 20px;
    }
  }

  .signup-content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $main-fg-color;
    padding-top: 100px;
    width: 100%;

    .signup-form {
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
