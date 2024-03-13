<script>
  import SafeImg from "../../../../atoms/SafeImg.svelte";
  import PageMenu from "../../../../components/PageMenu.svelte";
  import PageMenuItem from "../../../../components/PageMenuItem.svelte";
  import MainContentLayout from "../../../../layouts/MainContentLayout.svelte";
  import PageHeaderLayout from "../../../../layouts/PageHeaderLayout.svelte";
  import {
    championIconUrl,
    itemIconUrl,
    perkStyleIconUrl,
    summonerSpellIconUrl,
  } from "../../../../thunks/GeneralThunk";
  import { MetaCategories, TeamLaneType, TeamPositionKeyType, TeamPositionType } from "../../../../types/General";
  import JsxUtil from "../../../../utils/JsxUtil";
  import { championWinRateGrade, formatRate } from "../../../../utils/Util";
  import LinePosition from "../../../../molecules/LinePosition.svelte";
  import "./ChampionDetailContentMeta.scss";

  export let data;

  let selectedLane = null;
  let metaTree = {};
  let meta = null; // selected meta
  let majorMetPicks = [];
  let metaPicks = [];
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

    meta = metaTree[selectedLane];
    majorMetPicks = (meta?.majorMetaPicks ?? []).sort((a, b) => b.count - a.count);
    let metaPickTotalCount = (meta?.metaPicks ?? []).reduce((acc, e) => acc + e.count, 0);
    metaPicks = (meta?.metaPicks ?? [])
      .filter((e) => e.count / metaPickTotalCount > 0.03 && e.itemTree != null && e.itemTree.length >= 4)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 15)
      .map((e) => {
        let metaName = MetaCategories[e.majorTag] ?? e.majorTag;
        if (e.minorTag != null) {
          metaName += ` / ${MetaCategories[e.minorTag] ?? e.minorTag}`;
        }
        return { ...e, metaName };
      });

    if (selectedMeta == null && metaPicks.length > 0) {
      selectedMeta = metaPicks[0];
    }

    console.log("meta", selectedMeta);
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
<div class="champion-meta-content">
  <MainContentLayout>
    <div class="content">
      <div class="meta-list card">
        <div class="header">
          <div class="title">현재 유행 메타 ({metaPicks.length}개)</div>
        </div>
        <div class="body">
          {#each metaPicks as e}
            {@const items = e?.itemTree ?? []}
            <div
              class={"meta-item" + JsxUtil.classByEqual(selectedMeta.metaKey, e?.metaKey, "selected")}
              on:click={(e2) => {
                selectedMeta = e;
              }}
            >
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
              <div class="meta-name">{e?.metaName}</div>
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
          <div class="title">{data?.championName} - {selectedMeta?.metaName ?? ""} 메타 상세</div>
        </div>
        <div class="body">
          <div class="spells spell-set">
            <div class="label">소환사 주문</div>
            <div class="item-list">
              <div class="spell-icon img">
                <SafeImg src={summonerSpellIconUrl(selectedMeta?.summoner1Id)} />
              </div>
              <div class="spell-icon img">
                <SafeImg src={summonerSpellIconUrl(selectedMeta?.summoner2Id)} />
              </div>
            </div>
          </div>
          <div class="sub-items item-set">
            <div class="label">시작 아이템</div>
            <div class="item-list">
              {#each selectedMeta?.startItemTree ?? [] as itemId}
                <div class="item-icon img">
                  <SafeImg src={itemIconUrl(itemId)} />
                </div>
              {/each}
            </div>
          </div>
          <div class="sub-items item-set">
            <div class="label">기본 아이템</div>
            <div class="item-list">
              {#each selectedMeta?.basicItemTree ?? [] as itemId}
                <div class="item-icon img">
                  <SafeImg src={itemIconUrl(itemId)} />
                </div>
              {/each}
            </div>
          </div>
          <div class="main-items item-set">
            <div class="label">핵심 아이템</div>
            <div class="item-list">
              {#each selectedMeta?.itemTree ?? [] as itemId}
                <div class="item-icon img">
                  <SafeImg src={itemIconUrl(itemId)} />
                </div>
              {/each}
            </div>
          </div>
          <div class="sub-items item-set">
            <div class="label">상황별 아이템</div>
            <div class="item-list">
              {#each (selectedMeta?.subItemTree ?? []).slice(0, 8) as itemId}
                <div class="item-icon img">
                  <SafeImg src={itemIconUrl(itemId)} />
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div></MainContentLayout
  >
</div>
