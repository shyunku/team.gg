<script>
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import SortVisualizer from "../../../molecules/SortVisualizer.svelte";
  import {
    championIconUrl,
    getChampionStatisticsReq,
    getMetaStatisticsReq,
    itemIconUrl,
  } from "../../../thunks/GeneralThunk";
  import "./StatisticsChampion.scss";
  import { push } from "svelte-spa-router";
  import moment from "moment";
  import "moment/locale/ko";
  import { toasts } from "svelte-toasts";
  import LinePosition from "../../../molecules/LinePosition.svelte";
  import { MetaCategories } from "../../../types/General";
  import { compareVersions } from "compare-versions";
  moment.locale("ko");

  let rawData = null;
  let refinedData = [];
  let dataPatches = [];
  let lastUpdateTime = null;

  let reverseSort = false;
  let sortBy = null;

  const applySortOption = (key) => {
    if (sortBy === key) {
      if (reverseSort) {
        reverseSort = false;
        sortBy = null;
        return;
      } else {
        reverseSort = true;
      }
    } else {
      reverseSort = false;
      sortBy = key;
    }
  };

  const sortOptions = [
    { key: "lane", label: "라인", class: "champion-position" },
    { key: "championName", label: "챔피언 이름", class: "champion-name" },
    { key: "metaItems", label: "메타", class: "champion-items", except: true },
    { key: "metaName", label: "분류", class: "champion-meta" },
    { key: "count", label: "플레이 수", class: "champion-played" },
    { key: "winRate", label: "평균 승률", class: "champion-winrate" },
    { key: "avgPickRate", label: "평균 픽률", class: "champion-pickrate" },
    { key: "avgBanRate", label: "평균 밴률", class: "champion-banrate" },
  ];

  const getChampionStatistics = async () => {
    try {
      const resp = await getMetaStatisticsReq();
      const { updatedAt, data, patches } = resp;
      lastUpdateTime = updatedAt;
      dataPatches = patches.sort((a, b) => compareVersions(b, a, ">="));
      rawData = [];
      const totalPickCount = Object.values(data).reduce(
        (acc, cur) => acc + Object.values(cur.metaTree).reduce((acc, cur) => acc + cur.pickCount, 0),
        0
      );
      for (let key in data) {
        const championData = data[key];
        const lanePickCount = Object.values(championData.metaTree).reduce((acc, cur) => acc + cur.pickCount, 0);
        for (let lane in championData.metaTree) {
          const laneData = championData.metaTree[lane] ?? null;
          const metaList = laneData?.metaPicks ?? [];
          const lanePickRate = laneData?.pickCount / lanePickCount;
          if (lanePickRate < 0.15) continue; // 15% 미만의 픽률 라인은 제외

          let maxWinRateMeta = null;
          let maxWinRate = 0;
          let maxPickRateMeta = null;
          let maxPickCount = 0;
          for (let meta of metaList) {
            let metaPickRate = meta.pickCount / laneData.pickCount;
            if (metaPickRate < 0.2) continue; // 라인 내 25% 미만의 픽률 메타는 제외
            if (meta.count < 100) continue;
            if (meta.winRate > maxWinRate) {
              maxWinRate = meta.winRate;
              maxWinRateMeta = meta;
            }
            if (meta.count > maxPickCount) {
              maxPickCount = meta.count;
              maxPickRateMeta = meta;
            }
          }
          const collected = [maxWinRateMeta, maxPickRateMeta].filter((c) => c != null);
          if (collected.length == 0) continue;
          if (collected.length == 2) {
            if (maxWinRateMeta.metaKey == maxPickRateMeta.metaKey) {
              collected.pop();
            }
          }
          for (let meta of collected) {
            let metaName = MetaCategories[meta.majorTag] ?? meta.majorTag;
            if (meta.minorTag != null) {
              metaName += ` / ${MetaCategories[meta.minorTag] ?? meta.minorTag}`;
            }
            rawData.push({
              ...meta,
              lane: lane,
              metaName,
              championId: championData.championId,
              championName: championData.championName,
              avgPickRate: meta.count / totalPickCount,
              avgBanRate: championData.avgBanRate,
            });
          }
        }
      }
      rawData = rawData.sort((a, b) => a.championName.localeCompare(b.championName));
      console.log(data);
      console.log(rawData);
    } catch (e) {
      console.error(e);
      toasts.add({
        title: "챔피언 메타",
        description: "메타를 불러오는 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const moveToChampionDetail = (championId) => {
    push(`/statistics/champion/${championId}`);
  };

  $: if (rawData) {
    refinedData = rawData
      .map((c) => {
        let extra = c?.extraStats ?? {};
        return {
          ...c,
          avgMinionsKilled: extra?.avgMinionsKilled ?? 0,
          avgGoldEarned: extra?.avgGoldEarned ?? 0,
        };
      })
      .sort((a, b) => {
        if (sortBy == null) return 0;
        if (typeof a[sortBy] === "string") {
          if (reverseSort) {
            return a[sortBy].localeCompare(b[sortBy]);
          } else {
            return b[sortBy].localeCompare(a[sortBy]);
          }
        }

        if (reverseSort) {
          return a[sortBy] - b[sortBy];
        } else {
          return b[sortBy] - a[sortBy];
        }
      });
  }

  getChampionStatistics();
</script>

<div class="statistics-champion">
  <div class="content card">
    <div class="title">챔피언 메타 통계 ({dataPatches.join(", ")} 패치)</div>
    <div class="description">해당 지표들은 team.gg에서 검색 또는 추적되는 데이터들로 구성되었습니다.</div>
    <div class="updated-at">{moment(lastUpdateTime).format("YYYY년 M월 D일 a h시 mm분에 업데이트됨")}</div>
    <div class="champion-list">
      <div class="champion-item header">
        {#each sortOptions as option}
          <div class={option.class} on:mouseup={(e) => option?.except !== true && applySortOption(option.key)}>
            <div class="label">{option.label}</div>
            {#if option.except !== true}
              <div class="sort">
                <SortVisualizer direction={sortBy == option.key ? (reverseSort ? 1 : -1) : 0} />
              </div>
            {/if}
          </div>
        {/each}
      </div>
      {#each refinedData as c}
        {@const extra = c?.extraStats ?? {}}
        <div class="champion-item">
          <div class="champion-position">
            <LinePosition position={c?.lane} opacity={1} />
          </div>
          <div class="champion-img img">
            <SafeImg src={championIconUrl(c?.championId)} />
          </div>
          <div class="champion-name" on:click={(e) => moveToChampionDetail(c?.championId)}>
            {c?.championName ?? "-"}
          </div>
          <div class="champion-items">
            {#each (c?.itemTree ?? []).slice(0, 3) as item}
              <div class="item img">
                <SafeImg src={itemIconUrl(item)} />
              </div>
            {/each}
          </div>
          <div class="champion-meta">{c?.metaName ?? "-"}</div>
          <div class="champion-played">{c?.count ?? 0}판</div>
          <div class="champion-winrate">
            <div class="label">{(c.winRate * 100).toFixed(2)}%</div>
            <div class="bar-wrapper">
              <div class="bar" style={`width: ${c.winRate * 100}%`}></div>
            </div>
          </div>
          <div class="champion-pickrate">
            <div class="label">{(c.avgPickRate * 100).toFixed(2)}%</div>
            <div class="bar-wrapper">
              <div class="bar" style={`width: ${c.avgPickRate * 100}%`}></div>
            </div>
          </div>
          <div class="champion-banrate">
            <div class="label">{(c.avgBanRate * 100).toFixed(2)}%</div>
            <div class="bar-wrapper">
              <div class="bar" style={`width: ${c.avgBanRate * 100}%`}></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
