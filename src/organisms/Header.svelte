<script>
  import SafeImg from "../atoms/SafeImg.svelte";
  import MainContentWrapper from "../layouts/MainContentLayout.svelte";
  import { location, push } from "svelte-spa-router";
  import { authStore } from "../stores/AuthStore";
  import { toasts } from "svelte-toasts";
  import { testTokenReq, logout, ServerHostBase } from "../thunks/GeneralThunk";
  import { AxiosError } from "axios";
  import { onDestroy, onMount } from "svelte";
  import SocketIoClient from "socket.io-client";

  let socket = null;
  let isCustomGame = false;
  let isAuthorized = false;

  const goToHome = () => {
    window.location.href = "/";
  };

  const goToCustomGame = () => {
    window.location.href = "#/custom-game";
  };

  const goToLogin = () => {
    window.location.href = "#/login";
  };

  const tryLogout = async () => {
    try {
      await logout();
      authStore.initialize();
      window.location.href = "/";
    } catch (err) {
      toasts.add({ title: "로그아웃 실패", description: "알 수 없는 오류가 발생했습니다.", type: "warning" });
    }
  };

  const checkIsAuthorized = async () => {
    try {
      const resp = await testTokenReq();
    } catch (err) {
      if (err instanceof AxiosError) {
        const code = err?.response?.status;

        switch (code) {
          case 401:
            authStore.initialize();
            toasts.add({ title: "인증 정보", description: "인증 정보가 만료되었습니다.", type: "warning" });
            return;
        }
      }

      toasts.add({ title: "인증 정보", description: "인증 정보를 확인하던 중 오류가 발생했습니다.", type: "error" });
    }
  };

  authStore.subscribe((value) => {
    isAuthorized = value?.authorized;

    if (isAuthorized) {
      checkIsAuthorized();
    }
  });

  onMount(() => {
    // socket = SocketIoClient(`${ServerHostBase}/socket.io/`, {
    //   transports: ["websocket"],
    // });
    // socket.on("connect", () => {
    //   console.log("socket connected!");
    // });
    // socket.on("disconnect", () => {
    //   console.log("socket disconnected");
    // });
    // socket.on("error", (err) => {
    //   console.log("error", err);
    // });
    // socket.on("connect_error", (err) => {
    //   console.log("connect_error", err.message);
    // });
  });

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });

  $: {
    isCustomGame = $location.includes("/custom-game");
  }
</script>

<div class="header">
  <MainContentWrapper>
    <div class="app-icon-wrapper">
      <div class="app-icon img" on:mouseup={goToHome}>
        <SafeImg src="/img/common/app_logo.png" />
      </div>
    </div>
    <div class="app-menu">
      <div class={"app-menu-item" + (!isCustomGame ? " selected" : "")} on:mouseup={goToHome}>전적</div>
      <div class={"app-menu-item" + (isCustomGame ? " selected" : "")} on:mouseup={goToCustomGame}>내전 팀 구성</div>
    </div>
    <div class="user-menu">
      {#if isAuthorized}
        <div class="user-menu-item" on:mouseup={tryLogout}>로그아웃</div>
      {:else if !isAuthorized}
        <div class="user-menu-item" on:mouseup={goToLogin}>로그인</div>
      {/if}
    </div>
  </MainContentWrapper>
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .header {
    display: flex;
    align-items: center;
    // background-color: rgb(118, 25, 180);
    color: white;
    height: 60px;
    padding: 0 12px;
    border-bottom: 1px solid $main-border-color;
  }

  .app-icon-wrapper {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .app-icon {
    display: flex;
    align-items: center;
    width: 120px;
    height: 32px;
    cursor: pointer;
  }

  .app-menu {
    display: flex;
    margin-left: 30px;
    align-items: center;
    height: 100%;
    font-weight: bold;
    flex: 1;

    .app-menu-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: bold;
      height: 100%;
      color: $main-fg-color;
      font-size: 21px;
      padding: 0 18px;
      background: linear-gradient(180deg, transparent 50%, transparent 100%);
      transition: 0.5s linear;

      &:hover {
        background: linear-gradient(180deg, transparent 60%, rgba(222, 206, 160, 0.393) 100%);
      }

      &.selected {
        background: linear-gradient(180deg, transparent 60%, $highlight-color 100%);
      }

      &:not(:last-child) {
        // margin-right: 40px;
      }
    }
  }

  .user-menu {
    display: flex;

    .user-menu-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: bold;
      height: 100%;
      color: $main-fg-color;
      font-size: 21px;
      padding: 0 18px;
      background: linear-gradient(180deg, transparent 50%, transparent 100%);
      transition: 0.5s linear;

      &:hover {
        background: linear-gradient(180deg, transparent 60%, rgba(222, 206, 160, 0.393) 100%);
      }

      &.selected {
        background: linear-gradient(180deg, transparent 60%, $highlight-color 100%);
      }
    }
  }
</style>
