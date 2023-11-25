<script>
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import MainContentLayout from "../../../layouts/MainContentLayout.svelte";
  import {
    championIconUrl,
    itemIconUrl,
    perkStyleIconUrl,
    profileIconUrl,
    summonerSpellIconUrl,
  } from "../../../thunks/GeneralThunk";
  import { MultiKill, QueueType, TeamPositionType } from "../../../types/General";
  import { formatDecimalBy3 } from "../../../utils/Common";
  import { toDuration, toRelativeTime } from "../../../utils/Datetime";
  import IoIosArrowDown from "svelte-icons/io/IoIosArrowDown.svelte";
  import JsxUtil from "../../../utils/JsxUtil";
  import "./PlayerContentTotal.scss";

  export let sr = {};
  export let fr = {};
  export let matches = [];
  export let puuid = null;

  let srTierRank = "언랭";
  let srWinRate = 0;
  let srTierImgUrl = null;
  let frTierRank = "언랭";
  let frWinRate = 0;
  let frTierImgUrl = null;

  let sortedMatches = [];
  let duoList = [];
  $: sortedMatches = (matches ?? []).sort((a, b) => b.gameCreation - a.gameCreation);

  $: {
    if (sr?.tier != null && sr?.rank != null) {
      srTierRank = sr.tier + " " + sr.rank;
    }
    if (sr?.wins != null && sr?.losses != null) {
      srWinRate = sr.wins / (sr.wins + sr.losses);
    }
    if (sr?.tier != null) {
      let tier = sr.tier.toLowerCase();
      tier = tier.charAt(0).toUpperCase() + tier.slice(1);
      srTierImgUrl = `/img/tier/Rank=${tier}.png`;
    }
  }

  $: {
    if (fr?.tier != null && fr?.rank != null) {
      frTierRank = fr.tier + " " + fr.rank;
    }
    if (fr?.wins != null && fr?.losses != null) {
      frWinRate = fr.wins / (fr.wins + fr.losses);
    }
    if (fr?.tier != null) {
      let tier = fr.tier.toLowerCase();
      tier = tier.charAt(0).toUpperCase() + tier.slice(1);
      frTierImgUrl = `/img/tier/Rank=${tier}.png`;
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
  }

  $: {
    console.log(sortedMatches[0]);
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
    if (killSum === 0 && assistSum === 0) return 0;
    return (match?.myStat?.kills + match?.myStat?.assists) / killSum;
  };

  const getMultiKillCode = (match) => {
    if (match?.myStat?.pentaKills > 0) {
      return "penta";
    } else if (match?.myStat?.quadraKills > 0) {
      return "quadra";
    } else if (match?.myStat?.tripleKills > 0) {
      return "triple";
    } else if (match?.myStat?.doubleKills > 0) {
      return "double";
    } else {
      return null;
    }
  };

  const getDamageDealtPercentageInTeam = (match) => {
    const isTeam1 = match?.team1?.some((teammate) => teammate?.puuid === match?.myStat?.puuid);
    let dealtSum = 0;
    if (isTeam1) {
      match?.team1?.forEach((teammate) => {
        dealtSum += teammate?.totalDealtToChampions ?? 0;
      });
    } else {
      match?.team2?.forEach((teammate) => {
        dealtSum += teammate?.totalDealtToChampions ?? 0;
      });
    }
    if (dealtSum === 0) return 1;
    return (match?.myStat?.totalDamageDealtToChampions ?? 0) / dealtSum;
  };

  const getDamageDealtRanking = (match) => {
    const participants = (match?.team1 ?? []).concat(match?.team2 ?? []);
    participants.sort((a, b) => (b?.totalDealtToChampions ?? 0) - (a?.totalDealtToChampions ?? 0));
    const myIndex = participants.findIndex((participant) => participant?.puuid === match?.myStat?.puuid);
    return myIndex + 1;
  };
</script>

<MainContentLayout>
  <div class="content-wrapper">
    <div class="rank-summary">
      <div class="solo-rank rank card">
        <div class="rank-header header">솔로랭크</div>
        <div class="rank-body">
          <div class="rank-icon img">
            <img src={srTierImgUrl} />
          </div>
          <div class="rank-info">
            <div class="rank-row">
              <div class="rank-tier">{srTierRank}</div>
              <div class="rank-lp">{sr?.lp ?? "0"} LP</div>
            </div>
            <div class="rank-row">
              <div class="rank-win-lose">{sr?.wins ?? "0"}승 {sr?.losses ?? "0"}패</div>
              <div class="rank-win-rate">승률 {(100 * srWinRate).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-rank rank card">
        <div class="rank-header header">자유랭크</div>
        <div class="rank-body">
          <div class="rank-icon img">
            <img src={frTierImgUrl} />
          </div>
          <div class="rank-info">
            <div class="rank-row">
              <div class="rank-tier">{frTierRank}</div>
              <div class="rank-lp">{fr?.lp ?? "0"} LP</div>
            </div>
            <div class="rank-row">
              <div class="rank-win-lose">{fr?.wins ?? "0"}승 {fr?.losses ?? "0"}패</div>
              <div class="rank-win-rate">승률 {(100 * frWinRate).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="recent-players card">
        <div class="header">최근 함께한 소환사</div>
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
              <div class="player-name">{duo?.name ?? "-"}</div>
              <div class="player-game-count">{duo?.gameCount ?? "-"}</div>
              <div class="player-win-lose">{duo?.winCount ?? "-"}승 {lossCount}패</div>
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
            <div class="menu-item selected">전체</div>
            <div class="menu-item">솔로랭크</div>
            <div class="menu-item">자유랭크</div>
          </div>
        </div>
        <div class="body">
          <!-- TODO :: implement summary of recent histories -->
        </div>
      </div>
      <div class="match-history">
        {#each sortedMatches as match}
          {@const kills = match?.myStat?.kills}
          {@const deaths = match?.myStat?.deaths}
          {@const assists = match?.myStat?.assists}
          {@const kda = deaths === 0 ? "Perfect" : `${((kills + assists) / deaths).toFixed(2)}`}
          {@const multiKillCode = getMultiKillCode(match)}
          {@const multiKillLabel = MultiKill[multiKillCode]}
          {@const csPerMinute = (match?.myStat?.totalMinionsKilled ?? 0) / (match?.gameDuration / 60)}
          {@const teamPosition =
            match?.myStat?.teamPosition && match?.myStat?.teamPosition !== "" ? match?.myStat?.teamPosition : null}
          {@const dealtPercentageInTeam = getDamageDealtPercentageInTeam(match)}
          {@const dealtRanking = getDamageDealtRanking(match)}
          <div class={"match " + (match?.myStat?.win ? "win" : "lose")}>
            <div class="color-flag"></div>
            <div class="header">
              <div class="match-type">{QueueType[match?.queueId] ?? "게임 모드"}</div>
              <div class="match-win">
                {match?.myStat?.win ? "승리" : "패배"}
              </div>
              <div class="match-date">{toRelativeTime(match?.gameEndTimestamp)}</div>
              <div class="match-duration">{toDuration(match?.gameDuration * 1000)}</div>
            </div>
            <div class="body">
              <div class="champion-item-section">
                <div class="champion-section">
                  <div class="champion-icon img">
                    <SafeImg src={championIconUrl(match?.myStat?.championId)} />
                  </div>
                  <div class="spell-section">
                    <div class="spell-icon img">
                      <SafeImg src={summonerSpellIconUrl(match?.myStat?.summoner1Id)} />
                    </div>
                    <div class="spell-icon sub img">
                      <SafeImg src={summonerSpellIconUrl(match?.myStat?.summoner2Id)} />
                    </div>
                  </div>
                  <div class="rune-section">
                    <div class="rune-icon img">
                      <SafeImg src={perkStyleIconUrl(match?.myStat?.primaryPerkStyle)} />
                    </div>
                    <div class="rune-icon sub img">
                      <SafeImg src={perkStyleIconUrl(match?.myStat?.subPerkStyle)} />
                    </div>
                  </div>
                  <div class="kda-section">
                    <div class="kda">
                      <div class="kda-segment kill">{match?.myStat?.kills}</div>
                      <div class="kda-split">/</div>
                      <div class="kda-segment death">{match?.myStat?.deaths}</div>
                      <div class="kda-split">/</div>
                      <div class="kda-segment assist">{match?.myStat?.assists}</div>
                    </div>
                    <div class="kda-rate">평점 {kda}</div>
                  </div>
                </div>
                <div class="item-section">
                  {#each Array(7) as item, i}
                    <div class="item img">
                      <SafeImg src={itemIconUrl(match?.myStat?.[`item${i}`])} />
                    </div>
                  {/each}
                </div>
              </div>
              <div class="ingame-stat-section">
                <div class="ingame-stat-detail">
                  <div class="subsection">
                    <div class="kill-assists-rate">킬 관여 {(getKillAssistRate(match) * 100).toFixed(0)}%</div>
                    <div class="minion-kills">
                      CS {match?.myStat?.totalMinionsKilled ?? 0} ({csPerMinute.toFixed(1)})
                    </div>
                    <div class="gold">{formatDecimalBy3(match?.myStat?.goldEarned)} 골드</div>
                  </div>
                  <div class="split"></div>
                  <div class="subsection">
                    <div class="dealt-rate">딜량 {(dealtPercentageInTeam * 100).toFixed(0)}%</div>
                    <div class="cc-time">CC {toDuration((match?.myStat?.totalCCDealt ?? 0) * 1000)}</div>
                    <!-- <div class="vision">시야점수 25</div> -->
                    <div class="lane">{TeamPositionType[teamPosition] ?? ""}</div>
                    <!-- <div class="wards">와드 3</div> -->
                  </div>
                </div>
                <div class="representative-decorations">
                  {#if multiKillLabel != null}
                    <div class={"deco" + JsxUtil.class(multiKillCode)}>{multiKillLabel}</div>
                  {/if}
                  <div class="deco">딜량 {dealtRanking}등</div>
                </div>
              </div>
              <div class="ingame-summoners-section">
                <div class="team team-1">
                  {#each match?.team1 ?? [] as teammate}
                    <div class={"teammate" + JsxUtil.classByEqual(teammate?.puuid, puuid, "me")}>
                      <div class="teammate-icon img">
                        <SafeImg src={championIconUrl(teammate?.championId)} />
                      </div>
                      <div class="teammate-name">{teammate?.summonerName ?? "-"}</div>
                    </div>
                  {/each}
                </div>
                <div class="team team-2">
                  {#each match?.team2 ?? [] as teammate}
                    <div class={"teammate" + JsxUtil.classByEqual(teammate?.puuid, puuid, "me")}>
                      <div class="teammate-icon img">
                        <SafeImg src={championIconUrl(teammate?.championId)} />
                      </div>
                      <div class="teammate-name">{teammate?.summonerName ?? "-"}</div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
            <div class="expand-btn">
              <div class="expand-icon">
                <IoIosArrowDown />
              </div>
            </div>
          </div>
        {/each}
        <div class="more-matches card">20개 더보기</div>
      </div>
    </div>
  </div>
</MainContentLayout>
