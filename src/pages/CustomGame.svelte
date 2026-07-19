<script>
  import { push } from "svelte-spa-router";
  import MainContentWrapper from "../layouts/MainContentLayout.svelte";
  import SafeImg from "../atoms/SafeImg.svelte";
  import { toRelativeTime } from "../utils/Datetime";
  import "./CustomGame.scss";
  import {
    createCustomGameConfiguration,
    getCustomGameConfigurations,
    getJoinedCustomGameConfigurations,
    profileIconUrl,
  } from "../thunks/GeneralThunk";
  import { toasts } from "svelte-toasts";
  import { authStore } from "../stores/AuthStore";
  import { onDestroy, onMount } from "svelte";

  let recentCustoms = [];
  let joinedCustoms = [];
  let unsubscribeAuth = () => {};
  let authStateReceived = false;
  let configurationsLoaded = false;

  const tryCreateCustomGameConfiguration = async () => {
    try {
      const resp = await createCustomGameConfiguration();
      goToCustomGameConfigPage(resp);
    } catch (err) {
      console.error(err);
    }
  };

  const goToCustomGameConfigPage = (id) => {
    push(`/custom-game/${id}`);
  };

  const fetchConfigurations = async () => {
    try {
      const [ownedConfigurations, joinedConfigurations] = await Promise.all([
        getCustomGameConfigurations(),
        getJoinedCustomGameConfigurations().catch((err) => {
          console.error(err);
          return [];
        }),
      ]);
      recentCustoms = ownedConfigurations
        .sort((a, b) => new Date(b.lastUpdatedAt ?? 0).getTime() - new Date(a.lastUpdatedAt ?? 0).getTime())
        .slice(0, 10);
      joinedCustoms = joinedConfigurations.sort(
        (a, b) => new Date(b.lastUpdatedAt ?? 0).getTime() - new Date(a.lastUpdatedAt ?? 0).getTime(),
      );
    } catch (err) {
      console.error(err);
    }
  };

  onMount(() => {
    unsubscribeAuth = authStore.subscribe((value) => {
      const isAuthorized = value?.authorized === true;
      if (isAuthorized) {
        if (!configurationsLoaded) {
          configurationsLoaded = true;
          fetchConfigurations();
        }
      } else {
        if (!authStateReceived) {
          toasts.add({ title: "로그인 필요", description: "해당 메뉴는 로그인 후 이용해주세요.", type: "warning" });
        }
        push("/login");
      }
      authStateReceived = true;
    });
  });

  onDestroy(() => unsubscribeAuth());
</script>

<MainContentWrapper>
  <div class="custom-content-wrapper">
    <div class="app-logo">
      <SafeImg src="/img/common/app_logo.png" />
      <div class="version">v{APP_VERSION}</div>
    </div>
    <div class="menus">
      <div class="menu" on:mouseup={tryCreateCustomGameConfiguration}>새로운 내전 팀 구성</div>
    </div>
    <div class="custom-list recent-customs card">
      <div class="header">최근 내전 팀 구성</div>
      <div class="custom-configures">
        {#each recentCustoms as r}
          {@const lastUpdatedDt = new Date(r?.lastUpdatedAt ?? 0)}
          <div class="recent-custom-game-configure" on:mouseup={(e) => goToCustomGameConfigPage(r?.id)}>
            <div class="name">{r?.name}</div>
            <div class="created-at">{toRelativeTime(lastUpdatedDt.getTime())} 수정됨</div>
            <div class="fairness">밸런스: {((r?.balance?.fairness ?? 0) * 100).toFixed(0)}%</div>
          </div>
        {/each}
      </div>
    </div>
    <div class="custom-list joined-customs card">
      <div class="header">내가 속한 팀 구성</div>
      <div class="custom-configures">
        {#each joinedCustoms as configuration}
          {@const lastUpdatedDt = new Date(configuration?.lastUpdatedAt ?? 0)}
          <div
            class="recent-custom-game-configure"
            on:mouseup={() => goToCustomGameConfigPage(configuration?.id)}
          >
            <div class="name">{configuration?.name}</div>
            <div class="created-at">{toRelativeTime(lastUpdatedDt.getTime())} 수정됨</div>
            <div class="fairness">
              밸런스: {((configuration?.balance?.fairness ?? 0) * 100).toFixed(0)}%
            </div>
          </div>
        {:else}
          <div class="empty-list">참가 중인 내전 팀 구성이 없습니다.</div>
        {/each}
      </div>
    </div>
  </div>
</MainContentWrapper>
