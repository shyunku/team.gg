<script>
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import MainContentLayout from "../../../layouts/MainContentLayout.svelte";
  import {
    championIconUrl,
    getMatchesReq,
    itemIconUrl,
    perkStyleIconUrl,
    profileIconUrl,
    summonerSpellIconUrl,
  } from "../../../thunks/GeneralThunk";
  import { MultiKill, QueueType, QueueTypeKey, TeamLaneType, TeamPositionType } from "../../../types/General";
  import JsxUtil from "../../../utils/JsxUtil";
  import "./PlayerContentTotal.scss";
  import { push } from "svelte-spa-router";
  import { formatRankKr, formatTierKr, getGGscoreGrade, moveToPlayerPage } from "../../../utils/Util";
  import { toasts } from "svelte-toasts";
  import DoughnutChart from "../../../molecules/DoughnutChart.svelte";
  import LinePosition from "../../../molecules/LinePosition.svelte";
  import PlayerMatchItem from "./PlayerMatchItem.svelte";

  const MatchMenu = [
    { key: "ALL", label: "전체" },
    { key: "SOLO_RANK", label: "솔로랭크" },
    { key: "FLEX_RANK", label: "자유랭크" },
  ];

  export let sr = {};
  export let fr = {};
  export let matches = [];
  export let puuid = null;

  export let summonerName = "";

  export let loadMoreBefore = () => {};
  export let loadingMoreMatches = false;

  let selectedQueueId = 0;

  let srTierRank = "언랭";
  let srWinRate = 0;
  let srTierImgUrl = null;
  let frTierRank = "언랭";
  let frWinRate = 0;
  let frTierImgUrl = null;
  let oldestMatchStartTimestamp = null;
  $: {
    if (sortedMatches?.length > 0) {
      oldestMatchStartTimestamp = sortedMatches[sortedMatches.length - 1].gameStartTimestamp;
    }
  }

  let sortedMatches = [];
  let duoList = [];
  let matchWins = 0;
  let matchLosses = 0;
  let matchAvgKills = 0;
  let matchAvgDeaths = 0;
  let matchAvgAssists = 0;
  let matchKda = 0;
  let matchKillAssistRate = 0;
  let matchAvgDealt = 0;
  let matchAvgGGScore = 0;
  let recentChampions = [];
  let positionMap = {};
  $: {
    sortedMatches = (matches ?? []).sort((a, b) => b.gameCreation - a.gameCreation);
    matchWins = sortedMatches.filter((match) => match.myStat.win).length;
    matchLosses = sortedMatches.filter((match) => !match.myStat.win).length;
    matchAvgKills =
      sortedMatches.length === 0
        ? null
        : sortedMatches.reduce((acc, match) => acc + match.myStat.kills, 0) / sortedMatches.length;
    matchAvgDeaths =
      sortedMatches.length === 0
        ? null
        : sortedMatches.reduce((acc, match) => acc + match.myStat.deaths, 0) / sortedMatches.length;
    matchAvgAssists =
      sortedMatches.length === 0
        ? null
        : sortedMatches.reduce((acc, match) => acc + match.myStat.assists, 0) / sortedMatches.length;
    matchKda =
      matchAvgDeaths === 0
        ? "Perfect"
        : (((matchAvgKills ?? 0) + (matchAvgAssists ?? 0)) / (matchAvgDeaths ?? 1)).toFixed(3);
    matchKillAssistRate =
      sortedMatches.reduce((acc, match) => acc + getKillAssistRate(match), 0) / sortedMatches.length;
    matchAvgDealt =
      sortedMatches.reduce((acc, match) => acc + getDamageDealtPercentageInTeam(match), 0) / sortedMatches.length;
    matchAvgGGScore = sortedMatches.reduce((acc, match) => acc + match.myStat.ggScore, 0) / sortedMatches.length;

    let recentChampionMap = {};
    sortedMatches.forEach((match) => {
      const championId = match.myStat.championId;
      if (recentChampionMap[championId] == null) {
        recentChampionMap[championId] = {
          championId: championId,
          gameCount: 1,
          winCount: match.myStat.win ? 1 : 0,
          kills: match.myStat.kills,
          deaths: match.myStat.deaths,
          assists: match.myStat.assists,
          gameEndTimestamp: match.gameEndTimestamp,
        };
      } else {
        recentChampionMap[championId].gameCount += 1;
        recentChampionMap[championId].winCount += match.myStat.win ? 1 : 0;
        recentChampionMap[championId].kills += match.myStat.kills;
        recentChampionMap[championId].deaths += match.myStat.deaths;
        recentChampionMap[championId].assists += match.myStat.assists;
      }
    });
    recentChampions = Object.values(recentChampionMap).sort((a, b) => {
      if (b.gameCount === a.gameCount) {
        return b.gameEndTimestamp - a.gameEndTimestamp;
      }
      return b.gameCount - a.gameCount;
    });
    positionMap = {};
    sortedMatches.forEach((match) => {
      const position = match.myStat.teamPosition;
      if (TeamLaneType[position] == null) return;
      if (positionMap[position] == null) {
        positionMap[position] = 1;
      } else {
        positionMap[position] += 1;
      }
    });
  }

  $: {
    if (sr?.tier != null && sr?.rank != null) {
      srTierRank = formatTierKr(sr.tier) + " " + formatRankKr(sr.rank);
    } else {
      srTierRank = "언랭";
    }
    if (sr?.wins != null && sr?.losses != null) {
      srWinRate = sr.wins / (sr.wins + sr.losses);
    } else {
      srWinRate = 0;
    }
    if (sr?.tier != null) {
      let tier = sr.tier.toLowerCase();
      tier = tier.charAt(0).toUpperCase() + tier.slice(1);
      srTierImgUrl = `/img/tier/Rank=${tier}.png`;
    } else {
      srTierImgUrl = null;
    }
  }

  $: {
    if (fr?.tier != null && fr?.rank != null) {
      frTierRank = formatTierKr(fr.tier) + " " + formatRankKr(fr.rank);
    } else {
      frTierRank = "언랭";
    }
    if (fr?.wins != null && fr?.losses != null) {
      frWinRate = fr.wins / (fr.wins + fr.losses);
    } else {
      frWinRate = 0;
    }
    if (fr?.tier != null) {
      let tier = fr.tier.toLowerCase();
      tier = tier.charAt(0).toUpperCase() + tier.slice(1);
      frTierImgUrl = `/img/tier/Rank=${tier}.png`;
    } else {
      frTierImgUrl = null;
    }
  }

  $: {
    duoList = [];
    const duoMap = {};
    sortedMatches.forEach((match) => {
      const participants = (match?.team1 ?? []).concat(match?.team2 ?? []);
      for (let p of participants) {
        if (p?.puuid === puuid) continue;
        if (duoMap[p?.puuid] == null) {
          duoMap[p?.puuid] = {
            puuid: p?.puuid,
            name: p?.summonerName,
            gameName: p?.riotIdName,
            gameTag: p?.riotIdTagLine,
            gameCount: 1,
            winCount: p?.win ? 1 : 0,
            profileIcon: p?.profileIcon,
          };
        } else {
          duoMap[p?.puuid].gameCount += 1;
          duoMap[p?.puuid].winCount += match?.myStat?.win ? 1 : 0;
        }
      }
    });

    for (let key in duoMap) {
      let duo = duoMap[key];
      if (duo.gameCount <= 1) continue;
      duoList.push(duo);
    }
    duoList.sort((a, b) => b.gameCount - a.gameCount);
    duoList = duoList.slice(0, 10);
  }

  $: if (sortedMatches?.length > 0) {
    console.log(sortedMatches?.[0]);
  }

  const getKillAssistRate = (match) => {
    const isTeam1 = match?.team1?.some((teammate) => teammate?.puuid === match?.myStat?.puuid);
    let killSum = 0;
    if (isTeam1) {
      match?.team1?.forEach((teammate) => {
        killSum += teammate?.kills ?? 0;
      });
    } else {
      match?.team2?.forEach((teammate) => {
        killSum += teammate?.kills ?? 0;
      });
    }
    if (killSum === 0) return 0;
    return (match?.myStat?.kills + match?.myStat?.assists) / killSum;
  };

  const getDamageDealtPercentageInTeam = (match) => {
    const isTeam1 = match?.team1?.some((teammate) => teammate?.puuid === match?.myStat?.puuid);
    let dealtSum = 0;
    if (isTeam1) {
      match?.team1?.forEach((teammate) => {
        dealtSum += teammate?.totalDamageDealtToChampions ?? 0;
      });
    } else {
      match?.team2?.forEach((teammate) => {
        dealtSum += teammate?.totalDamageDealtToChampions ?? 0;
      });
    }
    if (dealtSum === 0) return 1;
    return (match?.myStat?.totalDamageDealtToChampions ?? 0) / dealtSum;
  };

  const getMatches = async (queueId) => {
    let toast;
    try {
      toast = toasts.add({
        title: "불러오는 중...",
        description: "전적을 불러오는 중입니다...",
        type: "info",
        duration: 0,
      });
      const result = await getMatchesReq(puuid, queueId);
      console.log("matches", result);

      matches = result;
    } catch (err) {
      console.log(err);
      toasts.add({
        title: "전적 불러오기 실패",
        description: "전적을 불러오는 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      toast?.remove();
    }
  };
</script>

<MainContentLayout>
  <div class="content-wrapper">
    <div class="left-section">
      <div class="rank-summary">
        <div class="solo-rank rank card">
          <div class="rank-header header">솔로랭크</div>
          <div class="rank-body">
            <div class={"rank-icon img" + JsxUtil.classByEqual(srTierImgUrl, null, "null")}>
              <SafeImg src={srTierImgUrl} />
            </div>
            <div class="rank-info">
              <div class="rank-row">
                <div class="rank-tier">{srTierRank}</div>
                <div class="rank-lp">{sr?.lp ?? "0"} LP</div>
              </div>
              <div class="rank-row">
                <div class="rank-win-lose">
                  {sr?.wins ?? "0"}승 {sr?.losses ?? "0"}패
                </div>
                <div class="rank-win-rate">
                  승률 {(100 * srWinRate).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-rank rank card">
          <div class="rank-header header">자유랭크</div>
          <div class="rank-body">
            <div class={"rank-icon img" + JsxUtil.classByEqual(frTierImgUrl, null, "null")}>
              <SafeImg src={frTierImgUrl} />
            </div>
            <div class="rank-info">
              <div class="rank-row">
                <div class="rank-tier">{frTierRank}</div>
                <div class="rank-lp">{fr?.lp ?? "0"} LP</div>
              </div>
              <div class="rank-row">
                <div class="rank-win-lose">
                  {fr?.wins ?? "0"}승 {fr?.losses ?? "0"}패
                </div>
                <div class="rank-win-rate">
                  승률 {(100 * frWinRate).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="recent-players card">
        <div class="header">최근 함께한 소환사 (상위 {duoList?.length ?? 0}명)</div>
        <div class="body">
          <div class="list-header row">
            <div class="player-name">소환사</div>
            <div class="player-game-count">게임 수</div>
            <div class="player-win-lose">승패</div>
            <div class="player-win-rate">승률</div>
          </div>
          {#each duoList as duo, i}
            {@const lossCount = (duo?.gameCount ?? 0) - (duo?.winCount ?? 0)}
            {@const winRate = (duo?.winCount ?? 0) / (duo?.gameCount ?? 1)}
            <div class="player row">
              <div class="player-icon img">
                <SafeImg src={profileIconUrl(duo?.profileIcon)} />
              </div>
              <div class="player-name" on:click={(e) => moveToPlayerPage(duo?.gameName, duo?.gameTag ?? "KR1")}>
                <div class="game-name">{duo?.gameName}</div>
                <div class="game-tag">#{duo?.gameTag ?? "KR1"}</div>
              </div>
              <div class="player-game-count">{duo?.gameCount ?? "-"}</div>
              <div class="player-win-lose">
                {duo?.winCount ?? "-"}승 {lossCount}패
              </div>
              <div class="player-win-rate">{(winRate * 100).toFixed(0)}%</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="match-info">
      <div class="match-summary card">
        <div class="header">
          <div class="menu">
            {#each MatchMenu as menu}
              {@const queueId = QueueTypeKey[menu.key] ?? null}
              <div
                class={"menu-item" + JsxUtil.classByEqual(selectedQueueId, queueId, "selected")}
                on:click={(e) => {
                  const needUpdate = selectedQueueId !== queueId;
                  selectedQueueId = queueId;
                  if (needUpdate) {
                    getMatches(queueId);
                  }
                }}
              >
                {menu.label}
              </div>
            {/each}
          </div>
        </div>
        <div class="body">
          <!-- TODO :: implement summary of recent histories -->
          <div class="win-rate-section">
            <DoughnutChart
              rates={matchWins + matchLosses === 0 ? [1, 0] : [matchWins, matchLosses]}
              colors={["#3CCA70", "#FF5252"]}
            >
              <div class="label">
                <div class="win-count">{matchWins}W {matchLosses}L</div>
                <div class="win-rate">
                  {((100 * matchWins) / (matchWins + matchLosses || 1)).toFixed(0)}%
                </div>
              </div>
            </DoughnutChart>
          </div>
          <div class="kda-section">
            <div class="kda">
              <div class="kda-segment kill">{(matchAvgKills ?? 0).toFixed(1)}</div>
              <div class="kda-split">/</div>
              <div class="kda-segment death">{(matchAvgDeaths ?? 0).toFixed(1)}</div>
              <div class="kda-split">/</div>
              <div class="kda-segment assist">{(matchAvgAssists ?? 0).toFixed(1)}</div>
            </div>
            <div class="performance">
              <div class="kda-rate">평점 {matchKda}</div>
              <div class={"gg-grade" + JsxUtil.class(`grade-${getGGscoreGrade(matchAvgGGScore)}`)}>
                Score {matchAvgGGScore?.toFixed(0) ?? 0}
              </div>
            </div>
            <div class="kill-assist-dealt-rate">
              <div class="kill-assist">평균 킬 관여 {(100 * matchKillAssistRate).toFixed(0)}%</div>
              <div class="split">/</div>
              <div class="dealt-rate">평균 딜량 {(100 * matchAvgDealt).toFixed(0)}%</div>
            </div>
          </div>
          <div class="recent-champions-section">
            <div class="header">최근 플레이한 챔피언 ({sortedMatches.length} 게임)</div>
            <div class="body">
              {#each recentChampions.slice(0, 3) as champion, i}
                <div class="champion row">
                  <div class="champion-icon img">
                    <SafeImg src={championIconUrl(champion?.championId)} />
                  </div>
                  <div class="champion-game-count">{champion?.gameCount}게임</div>
                  <div class="win-rate">
                    승률 {((100 * champion?.winCount) / champion?.gameCount).toFixed(0)}%
                  </div>
                  <div class="kda-rate">
                    평점 {((champion?.kills + champion?.assists) / champion?.deaths).toFixed(2)}
                  </div>
                </div>
              {/each}
            </div>
          </div>
          <div class="favorite-positions">
            <!-- <div class="header">최근 선호 포지션</div> -->
            <div class="body">
              {#each Object.keys(TeamLaneType) as position}
                {@const wholePositions = Object.values(positionMap).reduce((acc, cur) => acc + cur, 0)}
                <div class={"position row" + JsxUtil.classByEqual(positionMap[position] ?? 0, 0, "none")}>
                  <LinePosition {position} opacity={1} brightness={0.7} />
                  <div class="position-name">{TeamLaneType[position]}</div>
                  <div class="rate">
                    <div
                      class="filler"
                      style={`width: ${((positionMap[position] ?? 0) * 100) / wholePositions}%`}
                    ></div>
                  </div>
                  <div class={"position-count"}>
                    {positionMap[position] ?? 0}게임
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      <div class="match-history">
        {#each sortedMatches as match (match?.matchId)}
          <PlayerMatchItem {match} {puuid} {getDamageDealtPercentageInTeam} {getKillAssistRate} />
        {/each}
        <div
          class="more-matches card"
          on:mousedown={(e) => {
            loadMoreBefore(selectedQueueId, oldestMatchStartTimestamp);
          }}
        >
          {loadingMoreMatches ? "불러오는 중..." : "10개 더보기"}
        </div>
      </div>
    </div>
  </div>
</MainContentLayout>
