<script>
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import { championIconUrl, itemIconUrl, perkStyleIconUrl, summonerSpellIconUrl } from "../../../thunks/GeneralThunk";
  import { MultiKill, QueueType, QueueTypeKey, TeamLaneType, TeamPositionType } from "../../../types/General";
  import { formatDecimalBy3 } from "../../../utils/Common";
  import { toDuration, toRelativeTime } from "../../../utils/Datetime";
  import IoIosArrowDown from "svelte-icons/io/IoIosArrowDown.svelte";
  import IoIosArrowUp from "svelte-icons/io/IoIosArrowUp.svelte";
  import JsxUtil from "../../../utils/JsxUtil";
  import { getGGscoreGrade, moveToPlayerPage } from "../../../utils/Util";
  import LinePosition from "../../../molecules/LinePosition.svelte";
  import { toasts } from "svelte-toasts";
  import "./PlayerMatchItem.scss";
  import PlayerMatchDetailSummary from "./match-detail/PlayerMatchDetailSummary.svelte";

  export let match;

  export let puuid;
  export let getDamageDealtPercentageInTeam;
  export let getKillAssistRate;

  let summaryComponent = null;

  const MatchResultType = {
    WIN: "win",
    LOSE: "lose",
    EARLY_SURRENDER: "early-surrender",
    UNKNOWN: "unknown",
  };

  let kills = 0;
  let deaths = 0;
  let assists = 0;
  let kda = "0.00";
  let multiKillCode = 0;
  let multiKillLabel = null;
  let csPerMinute = 0;
  let teamPosition = null;
  let dealtPercentageInTeam = 0;
  let dealtRanking = 0;
  let earlySurrender = false;
  let isTeam1 = false;
  let matchResult = MatchResultType.UNKNOWN;
  $: if (match) {
    kills = match?.myStat?.kills;
    deaths = match?.myStat?.deaths;
    assists = match?.myStat?.assists;
    kda = deaths === 0 ? "Perfect" : `${((kills + assists) / deaths).toFixed(2)}`;
    multiKillCode = getMultiKillCode(match);
    multiKillLabel = MultiKill[multiKillCode];
    csPerMinute = (match?.myStat?.totalMinionsKilled ?? 0) / (match?.gameDuration / 60);
    teamPosition =
      match?.myStat?.teamPosition && match?.myStat?.teamPosition !== "" ? match?.myStat?.teamPosition : null;
    dealtPercentageInTeam = getDamageDealtPercentageInTeam(match);
    dealtRanking = getDamageDealtRanking(match);
    earlySurrender = match?.myStat?.gameEndedInEarlySurrender ?? false;
    isTeam1 = match?.team1?.some((teammate) => teammate?.puuid === match?.myStat?.puuid);
    matchResult = earlySurrender
      ? MatchResultType.EARLY_SURRENDER
      : match?.myStat?.win
        ? MatchResultType.WIN
        : MatchResultType.LOSE;
  }

  let expanded = false;

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

  const getDamageDealtRanking = (match) => {
    const participants = (match?.team1 ?? []).concat(match?.team2 ?? []);
    participants.sort((a, b) => (b?.totalDamageDealtToChampions ?? 0) - (a?.totalDamageDealtToChampions ?? 0));
    const myIndex = participants.findIndex((participant) => participant?.puuid === match?.myStat?.puuid);
    return myIndex + 1;
  };

  const expandMatchDetail = () => {
    expanded = !expanded;
    if (expanded) summaryComponent?.onActivate();
  };
</script>

<div class="match-wrapper">
  <div class={"color-flag" + JsxUtil.class(matchResult)}></div>
  <div class={"match" + JsxUtil.class(matchResult)}>
    <div class="header">
      <div class="main">
        <div class="match-type">
          {QueueType[match?.queueId] ?? "게임 모드"}
        </div>
        <div class="match-win">
          {earlySurrender ? "다시하기" : match?.myStat?.win ? "승리" : "패배"}
        </div>
      </div>
      <div class="sub">
        <div class="match-date">
          {toRelativeTime(match?.gameEndTimestamp)}
        </div>
        <div class="match-duration">
          {toDuration(match?.gameDuration * 1000)}
        </div>
      </div>
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
              <div class="kda-segment death">
                {match?.myStat?.deaths}
              </div>
              <div class="kda-split">/</div>
              <div class="kda-segment assist">
                {match?.myStat?.assists}
              </div>
            </div>
            <div class="kda-rate">평점 {kda}</div>
          </div>
        </div>
        <div class="item-section">
          {#each Array(7) as item, i}
            {@const itemId = match?.myStat?.[`item${i}`]}
            <div class="item img">
              <SafeImg src={itemId ? itemIconUrl(match?.myStat?.[`item${i}`]) : null} />
            </div>
          {/each}
        </div>
      </div>
      <div class="ingame-stat-section">
        <div class="ingame-stat-detail">
          <div class="subsection">
            <div class="kill-assists-rate">
              킬 관여 {(getKillAssistRate(match) * 100).toFixed(0)}%
            </div>
            <div class="minion-kills">
              CS {match?.myStat?.totalMinionsKilled ?? 0} ({csPerMinute.toFixed(1)})
            </div>
            <div class="gold">
              {formatDecimalBy3(match?.myStat?.goldEarned)} 골드
            </div>
          </div>
          <div class="split"></div>
          <div class="subsection">
            <div class="dealt-rate">
              딜량 {(dealtPercentageInTeam * 100).toFixed(0)}%
            </div>
            <div class="cc-time">
              CC {toDuration((match?.myStat?.totalTimeCCDealt ?? 0) * 1000)}
            </div>
            <!-- <div class="vision">시야점수 25</div> -->
            <div class="lane">
              {#if TeamLaneType?.[teamPosition] != null}
                <LinePosition position={teamPosition} opacity={1} />
                <div class="position">
                  {TeamLaneType[teamPosition]}
                </div>
              {/if}
            </div>
            <!-- <div class="wards">와드 3</div> -->
          </div>
        </div>
        <div class="representative-decorations">
          <div class={"deco gg-grade" + JsxUtil.class(`grade-${getGGscoreGrade(match?.myStat?.ggScore ?? 0)}`)}>
            {match?.myStat?.ggScore?.toFixed(0) ?? 0}
          </div>
          <div class="deco">딜량 {dealtRanking}등</div>
          {#if multiKillLabel != null}
            <div class={"deco" + JsxUtil.class(multiKillCode)}>
              {multiKillLabel}
            </div>
          {/if}
        </div>
      </div>
      <div class="ingame-summoners-section">
        <div class={"team team-1" + JsxUtil.classByCondition(isTeam1, "my-team")}>
          {#each match?.team1 ?? [] as teammate}
            {@const name =
              teammate?.riotIdName != null && teammate?.riotIdName.length > 0
                ? teammate?.riotIdName
                : teammate?.summonerName ?? "-"}
            <div class={"teammate" + JsxUtil.classByEqual(teammate?.puuid, puuid, "me")}>
              <div class="teammate-icon img">
                <SafeImg src={championIconUrl(teammate?.championId)} />
              </div>
              <div
                class="teammate-nametag"
                on:mousedown={(e) => {
                  moveToPlayerPage(teammate?.riotIdName, teammate?.riotIdTagLine);
                }}
              >
                <div class="teammate-name">
                  {name}
                </div>
                {#if teammate?.riotIdTagLine}
                  <div class="teammate-tag">
                    #{teammate?.riotIdTagLine}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <div class={"team team-2" + JsxUtil.classByCondition(!isTeam1, "my-team")}>
          {#each match?.team2 ?? [] as teammate}
            {@const name =
              teammate?.riotIdName != null && teammate?.riotIdName.length > 0
                ? teammate?.riotIdName
                : teammate?.summonerName ?? "-"}
            <div class={"teammate" + JsxUtil.classByEqual(teammate?.puuid, puuid, "me")}>
              <div class="teammate-icon img">
                <SafeImg src={championIconUrl(teammate?.championId)} />
              </div>
              <div
                class="teammate-nametag"
                on:mousedown={(e) => {
                  moveToPlayerPage(teammate?.riotIdName, teammate?.riotIdTagLine);
                }}
              >
                <div class="teammate-name">
                  {name}
                </div>
                {#if teammate?.riotIdTagLine}
                  <div class="teammate-tag">
                    #{teammate?.riotIdTagLine}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="expand-btn" on:click={expandMatchDetail}>
      <div class="expand-icon">
        {#if expanded}
          <IoIosArrowUp />
        {:else}
          <IoIosArrowDown />
        {/if}
      </div>
    </div>
  </div>
  <div class={"match-detail" + JsxUtil.class(matchResult) + JsxUtil.classByCondition(expanded, "expanded")}>
    <div class="detail-menus">
      <div class="menu-item selected">요약</div>
      <!-- <div class="menu-item">GG Score</div> -->
      <div class="menu-item not-ready">통계</div>
      <div class="menu-item not-ready">빌드</div>
    </div>
    <div class="detail-content">
      <PlayerMatchDetailSummary bind:this={summaryComponent} {match} {puuid} />
    </div>
  </div>
</div>
