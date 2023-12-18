<script>
  import { push } from "svelte-spa-router";
  import MainContentWrapper from "../layouts/MainContentLayout.svelte";
  import SafeImg from "../atoms/SafeImg.svelte";
  import { toRelativeTime } from "../utils/Datetime";
  import "./CustomGame.scss";
  import { createCustomGameConfiguration, getCustomGameConfigurations, profileIconUrl } from "../thunks/GeneralThunk";
  import { toasts } from "svelte-toasts";
  import { authStore } from "../stores/AuthStore";

  let recentCustoms = [];

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
      const resp = await getCustomGameConfigurations();
      recentCustoms = resp
        .sort((a, b) => new Date(b.lastUpdatedAt ?? 0).getTime() - new Date(a.lastUpdatedAt ?? 0).getTime())
        .slice(0, 5);
      console.log(resp);
    } catch (err) {
      console.error(err);
    }
  };

  authStore.subscribe((value) => {
    let isAuthorized = value?.authorized;
    if (isAuthorized === false) {
      toasts.add({ title: "로그인 필요", description: "해당 메뉴는 로그인 후 이용해주세요.", type: "warning" });
      push("/login");
    }
  });

  fetchConfigurations();
</script>

<MainContentWrapper>
  <div class="custom-content-wrapper">
    <div class="app-logo img">
      <SafeImg src="/img/common/app_logo.png" />
      <div class="version">v{APP_VERSION}</div>
    </div>
    <div class="menus">
      <div class="menu" on:mouseup={tryCreateCustomGameConfiguration}>새로운 내전 팀 구성</div>
    </div>
    <div class="recent-customs card">
      <div class="header">최근 내전 팀 구성</div>
      <div class="custom-configures">
        {#each recentCustoms as r}
          {@const lastUpdatedDt = new Date(r?.lastUpdatedAt ?? 0)}
          <div class="recent-custom-game-configure" on:mouseup={(e) => goToCustomGameConfigPage(r?.id)}>
            <div class="name">{r?.name}</div>
            <div class="created-at">{toRelativeTime(lastUpdatedDt.getTime())} 수정됨</div>
            <div class="fairness">밸런스: {r?.fairness}%</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</MainContentWrapper>
