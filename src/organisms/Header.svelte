<script>
  import SafeImg from "../atoms/SafeImg.svelte";
  import MainContentWrapper from "../layouts/MainContentLayout.svelte";
  import { location, push } from "svelte-spa-router";
  import { authStore } from "../stores/AuthStore";
  import { toasts } from "svelte-toasts";
  import { testTokenReq, logout, ServerHostBase } from "../thunks/GeneralThunk";
  import { AxiosError } from "axios";
  import { onDestroy, onMount } from "svelte";
  import "./Header.scss";
  import IpcSender from "../utils/IpcSender";
  import JsxUtil from "../utils/JsxUtil";

  const HeaderMenus = {
    main: { key: "", label: "전적" },
    statistics: { key: "statistics", label: "통계" },
    community: { key: "community", label: "커뮤니티" },
    customGame: { key: "custom-game", label: "내전 팀 구성" },
    ingame: { key: "ingame", label: "인게임", hide: !IpcSender.isCurrentElectron, subclass: "ingame" },
  };

  let currentPage = HeaderMenus.main;
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

  const goToIngame = () => {
    window.location.href = "#/ingame";
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
        if (err?.response != null) {
          const code = err?.response?.status;

          switch (code) {
            case 401:
              toasts.add({ title: "인증 정보", description: "인증 정보가 만료되었습니다.", type: "warning" });
              authStore.initialize();
              return;
          }
        } else {
          toasts.add({ title: "인증 오류", description: "서버가 점검 중입니다.", type: "error", duration: 5000 });
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
    let pageKey =
      Object.keys(HeaderMenus).find((key) => HeaderMenus[key].key !== "" && $location.includes(HeaderMenus[key].key)) ??
      "main";
    currentPage = HeaderMenus[pageKey];

    // console.log(currentPage);
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
      {#each Object.keys(HeaderMenus) as key}
        {@const menu = HeaderMenus[key]}
        {#if menu.hide !== true}
          <div
            class={"menu-item app-menu-item" +
              JsxUtil.classByEqual(currentPage.key, menu.key, "selected") +
              (menu.subclass != null ? JsxUtil.class(menu.subclass) : "")}
            on:click={() => {
              push(`/${menu.key}`);
            }}
          >
            {menu.label}
          </div>
        {/if}
      {/each}
    </div>
    <div class="fat" />
    <div class="user-menu">
      {#if isAuthorized}
        <div class="menu-item user-menu-item" on:click={tryLogout}>로그아웃</div>
      {:else if !isAuthorized}
        <div class="menu-item user-menu-item" on:click={goToLogin}>로그인</div>
      {/if}
    </div>
  </MainContentWrapper>
</div>
