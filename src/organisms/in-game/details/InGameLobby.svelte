<script>
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import {
    centeredChampionSplashUrl,
    championIconUrl,
    getChampionStatisticsReq,
    getMetaStatisticsReq,
  } from "../../../thunks/GeneralThunk";
  import { MapKeyType, MapType, TeamLanePositionType, TeamPositionKeyType } from "../../../types/General";
  import LinePosition from "../../../molecules/LinePosition.svelte";
  import "./InGameLobby.scss";
  import Dropdown from "../../../components/Dropdown.svelte";
  import IoIosArrowDown from "svelte-icons/io/IoIosArrowDown.svelte";
  import { formatRate } from "../../../utils/Util";

  export let mapId = null;

  let mapName = null;
  let rawData = null;
  let flattenedMetas = [];
  let selectedPosition = TeamPositionKeyType.TOP;
  // summoners rift
  let metaData = null;
  let loadingMetaData = false;
  let selectedLineChampions = [];
  // etc
  let championRecommendations = [];

  // extra
  $: {
    if (rawData == null && !loadingMetaData) {
      loadChampionMetas();
    }

    mapName = MapType[mapId] ?? null;

    if (rawData != null) {
      if (mapId === MapKeyType.SUMMONERS_RIFT) {
        processSummonersRiftData(selectedPosition);
      } else {
        // TODO :: add ARAM separation
        selectedPosition = TeamPositionKeyType.TOP; // initialize position

        processEtcData();
      }
    }
  }

  const processSummonersRiftData = (position) => {
    flattenedMetas = Object.values(rawData).reduce((acc, cur) => {
      const metas = [];
      for (const lane in cur?.metaTree ?? {}) {
        const metaPicks = cur.metaTree[lane]?.metaPicks ?? [];
        for (const pick of metaPicks) {
          metas.push({
            ...pick,
            lane,
            championId: cur.championId,
            championName: cur.championName,
          });
        }
      }
      return [...acc, ...metas];
    }, []);
    const metaLineMap = {};
    for (let fm of flattenedMetas) {
      if (metaLineMap[fm.lane] == null) {
        metaLineMap[fm.lane] = [];
      }
      metaLineMap[fm.lane].push(fm);
    }
    // sort each lines and slice
    metaData = {};
    for (let lane in metaLineMap) {
      // map by champion
      const metas = metaLineMap[lane];
      const championMap = {};
      for (let meta of metas) {
        if (championMap[meta.championId] == null) {
          championMap[meta.championId] = [];
        }
        championMap[meta.championId].push(meta);
      }
      let championWinRates = [];
      const laneTotalPickCount = metas.reduce((acc, cur) => acc + cur.count, 0);
      for (let championId in championMap) {
        const metas = championMap[championId];
        if (metas.length === 0) continue;
        const championName = metas[0].championName;
        const wins = metas.reduce((acc, cur) => acc + cur.win, 0);
        const total = metas.reduce((acc, cur) => acc + cur.count, 0);
        // console.log(championName, wins, total, wins / total);
        if (total === 0) continue;
        const pickRateOnLane = total / laneTotalPickCount;
        if (pickRateOnLane < 0.01) continue; // 1% 이하 픽률의 챔피언은 제외
        const pickCount = rawData?.[championId]?.metaTree?.[lane]?.pickCount ?? 0;
        championWinRates.push({
          championId,
          championName,
          positionPickCount: pickCount,
          total,
          winRate: wins / total,
        });
      }
      // sort by win rate
      championWinRates.sort((a, b) => b.winRate - a.winRate);
      // slice
      championWinRates = championWinRates.slice(0, 21);
      metaData[lane] = championWinRates;
    }
    selectedLineChampions = metaData?.[position?.toLowerCase()] ?? [];
    console.log(selectedLineChampions);
  };

  const processEtcData = () => {
    const championDetailFlatten = Object.values(rawData);
    // sort by win rate
    championDetailFlatten.sort((a, b) => b.win / b.total - a.win / a.total);
    championRecommendations = championDetailFlatten.slice(0, 21);
    console.log(championRecommendations);
  };

  const loadChampionMetas = async () => {
    try {
      loadingMetaData = true;
      const resp = await getMetaStatisticsReq();
      const { data, patches, updatedAt } = resp;
      rawData = data;
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      loadingMetaData = false;
    }
  };
</script>

<div class="in-game-lobby">
  <div class="meta-recommendation-section">
    <div class="header">
      <div class="title">메타 추천{mapName != null ? ` (${mapName})` : ""}</div>
      {#if mapId === MapKeyType.SUMMONERS_RIFT}
        <div id="meta_recommendation_position_selector" class="position-selector">
          <LinePosition position={selectedPosition} opacity={1} />
          <div class="position-name">{selectedPosition}</div>
          <div class="dropdown-icon">
            <IoIosArrowDown />
          </div>
          <Dropdown trackId="meta_recommendation_position_selector">
            {#each Object.keys(TeamPositionKeyType) as positionKey}
              <div
                class="position"
                on:click={() => {
                  selectedPosition = positionKey;
                }}
              >
                <LinePosition position={positionKey} opacity={1} />
                <div class="position-name">{positionKey}</div>
              </div>
            {/each}
          </Dropdown>
        </div>
      {/if}
    </div>
    <div class="recommendations">
      {#if mapId === MapKeyType.SUMMONERS_RIFT}
        {#each selectedLineChampions as e (e.championId)}
          <div class="meta card">
            <div class="champion-image img">
              <SafeImg src={centeredChampionSplashUrl(e?.championId)} />
            </div>
            <div class="detail">
              <div class="name">{e?.championName}</div>
              <div class="play-count">{e?.positionPickCount} 게임</div>
              <div class="win-rate">승률 {(e?.winRate * 100).toFixed(0)}%</div>
            </div>
          </div>
        {/each}
      {:else}
        {#each championRecommendations as e (e.championId)}
          <div class="meta card">
            <div class="champion-image img">
              <SafeImg src={centeredChampionSplashUrl(e?.championId)} />
            </div>
            <div class="detail">
              <div class="name">{e?.championName}</div>
              <div class="play-count">{e?.total} 게임</div>
              <div class="win-rate">승률 {formatRate((e?.win ?? 0) / (e?.total ?? 1), 0)}%</div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
