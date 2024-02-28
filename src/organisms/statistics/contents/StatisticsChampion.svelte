<script>
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import SortVisualizer from "../../../molecules/SortVisualizer.svelte";
  import { championIconUrl, getChampionStatisticsReq } from "../../../thunks/GeneralThunk";
  import "./StatisticsChampion.scss";
  import moment from "moment";
  import "moment/locale/ko";
  moment.locale("ko");

  let rawData = null;
  let refinedData = [];
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
    { key: "championName", label: "챔피언 이름", class: "champion-name" },
    { key: "total", label: "플레이 수", class: "champion-played" },
    { key: "winRate", label: "평균 승률", class: "champion-winrate" },
    { key: "avgPickRate", label: "평균 픽률", class: "champion-pickrate" },
    { key: "avgBanRate", label: "평균 밴률", class: "champion-banrate" },
    { key: "kda", label: "평균 KDA", class: "champion-kda" },
    { key: "avgMinionsKilled", label: "평균 CS", class: "champion-minions" },
    { key: "avgGoldEarned", label: "평균 골드", class: "champion-gold-earned" },
  ];

  const getChampionStatistics = async () => {
    try {
      const resp = await getChampionStatisticsReq();
      const { updatedAt, data } = resp;
      lastUpdateTime = updatedAt;
      rawData = data;
      console.log(data);
    } catch (e) {
      console.error(e);
      toasts.add({
        title: "챔피언 통계",
        description: "통계를 불러오는 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  $: if (rawData) {
    refinedData = rawData
      .map((c) => {
        return {
          ...c,
          winRate: (c?.win ?? 0) / (c?.total ?? 1),
          kda: ((c?.avgKills ?? 0) + (c?.avgAssists ?? 0)) / (c?.avgDeaths ?? 1),
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
    <div class="title">챔피언 통계</div>
    <div class="description">해당 지표들은 team.gg에서 검색 또는 추적되는 데이터들로 구성되었습니다.</div>
    <div class="updated-at">{moment(lastUpdateTime).format("YYYY년 M월 D일 a h시 mm분에 업데이트됨")}</div>
    <div class="champion-list">
      <div class="champion-item header">
        {#each sortOptions as option}
          <div class={option.class} on:mouseup={(e) => applySortOption(option.key)}>
            <div class="label">{option.label}</div>
            <div class="sort">
              <SortVisualizer direction={sortBy == option.key ? (reverseSort ? 1 : -1) : 0} />
            </div>
          </div>
        {/each}
      </div>
      {#each refinedData as c}
        <div class="champion-item">
          <div class="champion-img img">
            <SafeImg src={championIconUrl(c?.championId)} />
          </div>
          <div class="champion-name">{c?.championName ?? "-"}</div>
          <div class="champion-played">{c?.total ?? 0}판</div>
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
          <div class="champion-kda">
            {c.kda.toFixed(2)}
          </div>
          <div class="champion-minions">
            {(c?.avgMinionsKilled ?? 0).toFixed(0)} CS
          </div>
          <div class="champion-gold-earned">{(c?.avgGoldEarned ?? 0).toFixed(0)} 골드</div>
        </div>
      {/each}
    </div>
  </div>
</div>
