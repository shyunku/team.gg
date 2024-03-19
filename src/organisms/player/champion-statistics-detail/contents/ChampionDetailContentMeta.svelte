<script>
  import SafeImg from "../../../../atoms/SafeImg.svelte";
  import PageMenu from "../../../../components/PageMenu.svelte";
  import PageMenuItem from "../../../../components/PageMenuItem.svelte";
  import MainContentLayout from "../../../../layouts/MainContentLayout.svelte";
  import PageHeaderLayout from "../../../../layouts/PageHeaderLayout.svelte";

  import { MetaCategories, TeamLaneType, TeamPositionKeyType, TeamPositionType } from "../../../../types/General";
  import JsxUtil from "../../../../utils/JsxUtil";
  import { championWinRateGrade, formatRate } from "../../../../utils/Util";
  import LinePosition from "../../../../molecules/LinePosition.svelte";
  import "./ChampionDetailContentMeta.scss";
  import StandardMetaContent from "./StandardMetaContent.svelte";
  import CounterMetaContent from "./CounterMetaContent.svelte";

  export let data;

  let isCounterMode = false;
  let selectedLane = null;
  let metaTree = {};
  let linePickCountTotal = 0;
  let selectedMeta = null;

  $: {
    metaTree = data?.metaTree ?? {};

    // select most picked lane
    if (selectedLane == null) {
      let maxPickCount = 0;
      let maxPickLane = null;
      for (const lane in metaTree) {
        const pickCount = metaTree[lane]?.pickCount ?? 0;
        linePickCountTotal += pickCount;
        if (pickCount > maxPickCount) {
          maxPickCount = pickCount;
          maxPickLane = lane;
        }
      }
      selectedLane = maxPickLane ?? null;
    }
  }
</script>

<PageHeaderLayout class="champion-detail-position-menu">
  <PageMenu>
    {#each Object.keys(metaTree) as lane}
      {@const laneUpperCase = lane.toUpperCase()}
      {@const laneLabel = TeamPositionType[laneUpperCase] ?? laneUpperCase}
      {@const pickRate = (metaTree[lane]?.pickCount ?? 0) / (linePickCountTotal ?? 1)}
      <PageMenuItem
        selected={lane === selectedLane}
        onClick={(e) => {
          selectedLane = lane;
          selectedMeta = null;
        }}
      >
        <LinePosition position={lane} />
        <div class="label">{laneLabel} ({formatRate(pickRate, 0)}%)</div>
      </PageMenuItem>
    {/each}
  </PageMenu>
</PageHeaderLayout>
<PageHeaderLayout class="champion-detail-position-menu">
  <PageMenu>
    <PageMenuItem
      selected={!isCounterMode}
      onClick={(e) => {
        isCounterMode = false;
      }}>표준 메타</PageMenuItem
    >
    <PageMenuItem
      selected={isCounterMode}
      onClick={(e) => {
        isCounterMode = true;
      }}>상대 챔피언별</PageMenuItem
    >
  </PageMenu>
</PageHeaderLayout>
<div class="champion-meta-content">
  <MainContentLayout>
    <div class="content">
      {#if isCounterMode}
        <CounterMetaContent {metaTree} {selectedLane} />
      {:else}
        <StandardMetaContent {metaTree} {selectedLane} bind:selectedMeta />
      {/if}
    </div></MainContentLayout
  >
</div>
