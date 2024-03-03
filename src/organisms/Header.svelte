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
  import "./Header.scss";

  let socket = null;
  let isMainPage = false;
  let isCustomGamePage = false;
  let isStatisticsPage = false;
  let isCommunityPage = false;
  let isAuthorized = false;

  // console.log(authStore.);

  const goToHome = () => {
    window.location.href = "/";
  };

  const goToCustomGame = () => {
    window.location.href = "#/custom-game";
  };

  const goToStatistics = () => {
    window.location.href = "#/statistics";
  };

  const goToCommunity = () => {
    window.location.href = "#/community";
  };

  const goToLogin = () => {
    window.location.href = "#/login";
  };

  const tryLogout = async () => {
    try {
      authStore.initialize();
      window.location.href = "/";
      await logout();
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
            toasts.add({ title: "인증 정보", description: "인증 정보가 만료되었습니다.", type: "warning" });
            authStore.initialize();
            return;
        }
      }

      toasts.add({ title: "인증 정보", description: "인증 정보를 확인하던 중 오류가 발생했습니다.", type: "error" });
    }
  };

  onMount(() => {
    authStore.subscribe((value) => {
      isAuthorized = value?.authorized;
      if (isAuthorized) {
        checkIsAuthorized();
      }
    });
  });

  $: {
    isCustomGamePage = $location.includes("/custom-game");
    isStatisticsPage = $location.includes("/statistics");
    isCommunityPage = $location.includes("/community");
    isMainPage = !isCustomGamePage && !isStatisticsPage && !isCommunityPage;
  }
</script>

<div class="app-header">
  <MainContentWrapper>
    <div class="app-icon-wrapper">
      <div class="app-icon img" on:click={goToHome}>
        <SafeImg src="/img/common/app_logo.png" />
      </div>
    </div>
    <div class="app-menu">
      <div class={"menu-item app-menu-item" + (isMainPage ? " selected" : "")} on:click={goToHome}>전적</div>
      <div class={"menu-item app-menu-item" + (isStatisticsPage ? " selected" : "")} on:click={goToStatistics}>
        통계
      </div>
      <div class={"menu-item app-menu-item" + (isCommunityPage ? " selected" : "")} on:click={goToCommunity}>
        커뮤니티
      </div>
      <div class={"menu-item app-menu-item" + (isCustomGamePage ? " selected" : "")} on:click={goToCustomGame}>
        내전 팀 구성
      </div>
    </div>
    <div class="user-menu">
      {#if isAuthorized}
        <div class="menu-item user-menu-item" on:click={tryLogout}>로그아웃</div>
      {:else if !isAuthorized}
        <div class="menu-item user-menu-item" on:click={goToLogin}>로그인</div>
      {/if}
    </div>
  </MainContentWrapper>
</div>
