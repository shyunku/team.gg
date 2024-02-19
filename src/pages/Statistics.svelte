<script>
  import { toasts } from "svelte-toasts";
  import MainContentLayout from "../layouts/MainContentLayout.svelte";
  import { championIconUrl, getChampionStatisticsReq } from "../thunks/GeneralThunk";
  import SafeImg from "../atoms/SafeImg.svelte";
  import StatisticsContent from "../organisms/statistics/StatisticsContent.svelte";

  let championStatistics = [];

  const getChampionStatistics = async () => {
    try {
      const data = await getChampionStatisticsReq();
      const { updatedAt, stats } = data;
      championStatistics = stats;
      console.log(stats);
    } catch (e) {
      console.error(e);
      toasts.add({
        title: "챔피언 통계",
        description: "챔피언 통계를 불러오는 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  getChampionStatistics();
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
      <div class="menu-item selected">챔피언</div>
      <div class="menu-item">티어</div>
      <div class="menu-item">숙련도</div>
    </div>
  </MainContentLayout>
</div>
<StatisticsContent {championStatistics} />

<style lang="scss">
  @import "../styles/variables.scss";

  .statistics-header {
    width: 100%;
    background-color: $sub-bg-color;
    border-bottom: 1px solid $sub-border-color;
    color: rgb(195, 190, 169);
    padding: 20px 0;

    .content {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 24px;
        font-weight: 700;
      }

      .description {
        margin-top: 10px;
        font-size: 13px;
        color: rgb(129, 126, 113);
      }
    }
  }

  .statistics-menu {
    width: 100%;
    background-color: $sub-bg-color;
    border-bottom: 1px solid $sub-border-color;
    color: rgb(195, 190, 169);
    padding: 5px 0;

    .menu {
      display: flex;
      justify-content: center;

      .menu-item {
        display: flex;
        justify-content: center;
        width: 80px;
        font-size: 14px;
        font-weight: bold;
        padding: 6px 0;
        border-radius: 3px;
        cursor: pointer;

        &:not(:last-child) {
          margin-right: 5px;
        }

        &:hover {
          background-color: rgb(53, 49, 41);
        }

        &.selected {
          background-color: rgb(84, 78, 65);
        }
      }
    }
  }
</style>
