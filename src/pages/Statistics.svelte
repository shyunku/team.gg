<script>
  import { toasts } from "svelte-toasts";
  import MainContentLayout from "../layouts/MainContentLayout.svelte";
  import { championIconUrl, getChampionStatisticsReq } from "../thunks/GeneralThunk";
  import SafeImg from "../atoms/SafeImg.svelte";
  import StatisticsContent from "../organisms/statistics/StatisticsContent.svelte";
  import JsxUtil from "../utils/JsxUtil";
  import "./Statistics.scss";

  export const StatisticsMenu = {
    CHAMPION: { key: "champion", label: "챔피언" },
    TIER: { key: "tier", label: "티어" },
    MASTERY: { key: "mastery", label: "숙련도" },
  };

  export let params = {};
  let menu = StatisticsMenu.CHAMPION.key;

  let currentPath = window.location.pathname + window.location.hash;
  window.onhashchange = () => {
    currentPath = window.location.pathname + window.location.hash;
  };

  $: if (params) {
    menu = params.menu ?? StatisticsMenu.CHAMPION.key;
  }
</script>

<svelte:head>
  <title>team.gg - 통계</title>
</svelte:head>

<div class="statistics-header">
  <MainContentLayout>
    <div class="content">
      <div class="title">데이터 통계 (Beta)</div>
      <div class="description">
        team.gg에서 제공되는 모든 데이터는 주기적으로 업데이트되며, 라이엇의 모든 정보를 반영하지는 않습니다.
      </div>
    </div>
  </MainContentLayout>
</div>
<div class="statistics-menu">
  <MainContentLayout>
    <div class="menu">
      {#each Object.values(StatisticsMenu) as m}
        <div
          class={"menu-item" + JsxUtil.classByEqual(m.key, menu, "selected")}
          on:click={() => (window.location.href = `#/statistics/${m.key}`)}
        >
          {m.label}
        </div>
      {/each}
    </div>
  </MainContentLayout>
</div>
<div class="statistics-content">
  <MainContentLayout>
    <StatisticsContent {menu} />
  </MainContentLayout>
</div>
