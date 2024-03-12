<script>
  import SafeImg from "../../../../atoms/SafeImg.svelte";
  import PageMenu from "../../../../components/PageMenu.svelte";
  import PageMenuItem from "../../../../components/PageMenuItem.svelte";
  import MainContentLayout from "../../../../layouts/MainContentLayout.svelte";
  import PageHeaderLayout from "../../../../layouts/PageHeaderLayout.svelte";
  import { championIconUrl, itemIconUrl, perkStyleIconUrl } from "../../../../thunks/GeneralThunk";
  import { MetaCategories, TeamLaneType, TeamPositionKeyType, TeamPositionType } from "../../../../types/General";
  import JsxUtil from "../../../../utils/JsxUtil";
  import { championWinRateGrade, formatRate } from "../../../../utils/Util";
  import "./ChampionDetailContentMeta.scss";

  export let data;

  let selectedLane = TeamPositionKeyType.TOP.toLowerCase();
  let metaTree = {};
  let meta = null; // selected meta
  let majorMetPicks = [];
  let metaPicks = [];
  $: {
    metaTree = data?.metaTree ?? {};
    meta = metaTree[selectedLane];
    majorMetPicks = (meta?.majorMetaPicks ?? []).sort((a, b) => b.count - a.count);
    metaPicks = (meta?.metaPicks ?? []).sort((a, b) => b.count - a.count).slice(0, 15);

    console.log("meta", meta);
  }
</script>

<PageHeaderLayout class="champion-detail-position-menu">
  <PageMenu>
    {#each Object.keys(metaTree) as lane}
      {@const laneUpperCase = lane.toUpperCase()}
      {@const laneLabel = TeamPositionType[laneUpperCase] ?? laneUpperCase}
      <PageMenuItem
        selected={lane === selectedLane}
        onClick={(e) => {
          selectedLane = lane;
        }}>{laneLabel}</PageMenuItem
      >
    {/each}
  </PageMenu>
</PageHeaderLayout>
<div class="champion-meta-content">
  <MainContentLayout>
    <div class="content">
      <div class="meta-list card">
        <div class="header">
          <div class="title">현재 유행 메타 ({metaPicks.length}개)</div>
        </div>
        <div class="body">
          {#each metaPicks as e}
            {@const majorTag = MetaCategories[e?.majorTag] ?? e?.majorTag ?? "일반"}
            {@const minorTag = MetaCategories[e?.minorTag] ?? e?.minorTag ?? null}
            {@const metaName = majorTag + (minorTag != null ? ` / ${minorTag}` : "")}
            {@const items = e?.itemTree ?? []}
            <div class="meta-item">
              <div class="styles">
                <div class="primary-style-icon style img">
                  <SafeImg src={perkStyleIconUrl(e?.majorPerkStyleId)} />
                </div>
                <div class="sub-style-icon style img">
                  <SafeImg src={perkStyleIconUrl(e?.minorPerkStyleId)} />
                </div>
              </div>
              <div class="item-set">
                <div class="item-icon img">
                  <SafeImg src={itemIconUrl(items?.[0])} />
                </div>
                <div class="item-icon img">
                  <SafeImg src={itemIconUrl(items?.[1])} />
                </div>
                <div class="item-icon img">
                  <SafeImg src={itemIconUrl(items?.[2])} />
                </div>
              </div>
              <div class="meta-name">{metaName}</div>
              <div class="meta-plays">{e?.count} 게임</div>
              <div class={"win-rate rate gg-grade" + JsxUtil.class(`grade-${championWinRateGrade(e?.winRate ?? 0)}`)}>
                {formatRate(e?.winRate, 0)}%
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="meta-detail card">
        <div class="header">
          <div class="title">{data?.championName} - 메타 상세</div>
        </div>
        <div class="body">META DETAIL (NOT IMPLEMENTED)</div>
      </div>
    </div>
  </MainContentLayout>
</div>
