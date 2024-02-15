<script>
  import { toasts } from "svelte-toasts";
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import LinePosition from "../../../molecules/LinePosition.svelte";
  import TierRank from "../../../molecules/TierRank.svelte";
  import { championIconUrl, getTierRankByRatingPointReq, profileIconUrl } from "../../../thunks/GeneralThunk";
  import { TeamPositionKeyType, TeamPositionType } from "../../../types/General";
  import { formatMasteryPoints } from "../../../utils/Util";
  import "./CustomGameContentTeam.scss";
  import ContextDiv from "../../../components/ContextDiv.svelte";
  import ContextMenu from "../../../components/ContextMenu.svelte";
  import TierRankGroup from "../../../molecules/TierRankGroup.svelte";

  export let positions;
  export let team;
  export let teamIndex = 0;

  export let onParticipantDragStart;
  export let onParticipantDragEnd;
  export let onCandidateDrop;
  export let onCandidateDragEnter;
  export let onCandidateDragOver;
  export let onCandidateDragLeave;

  export let onCandidateChangeFavorPosition;
  export let setCustomCandidateCustomTierRank;

  export let draggingCandidate;
  export let draggingParticipant;
  export let candidateHoverTarget;

  export let totalRatingPoint = 0;
  let teammateCount = 0;
  let avgTierRank = null;

  const fetchAverageTierRank = async (avgRatingPoint) => {
    try {
      const resp = await getTierRankByRatingPointReq(avgRatingPoint);
      avgTierRank = {
        tier: resp.tier,
        rank: resp.rank,
        lp: resp.lp,
      };
    } catch (err) {
      console.log(err);
      toasts.add({
        title: "평균 티어 조회 실패",
        description: "평균 티어 조회에 실패했습니다.",
        duration: 3000,
        type: "error",
      });
    }
  };

  const goToPlayerPage = (gameName, tagLine) => {
    window.open(`#/player/${gameName}/${tagLine ?? "KR1"}`, "_blank");
  };

  $: if (team) {
    totalRatingPoint = Object.values(team).reduce((acc, cur) => {
      if (cur == null) return acc;
      const pRank = [cur?.customRank, cur?.soloRank, cur?.flexRank].reduce((acc, cur) => {
        if (cur == null) return acc;
        if (acc != null) return acc;
        return cur;
      }, null);
      return acc + (pRank?.ratingPoint ?? 0);
    }, 0);
    teammateCount = Object.values(team).filter((p) => p != null).length;
  }

  $: if (totalRatingPoint != null && teammateCount != null) {
    if (teammateCount === 0) {
      avgTierRank = null;
    } else {
      let avgRatingPoint = totalRatingPoint / teammateCount;
      fetchAverageTierRank(avgRatingPoint);
    }
  }
</script>

<div class={`team team${teamIndex} card`}>
  <div class="header">
    <div class="title">팀 {teamIndex}</div>
    <div class="rating">
      <div class="label">총 레이팅</div>
      <div class="value">{totalRatingPoint} RP</div>
    </div>
    <div class="avg-tier">
      <div class="label">평균 티어</div>
      <div class="value">
        {#if avgTierRank != null}
          <TierRank tier={avgTierRank?.tier} rank={avgTierRank?.rank} lp={avgTierRank?.lp} />
        {:else}
          -
        {/if}
      </div>
    </div>
  </div>
  <div class="body">
    <div class="placeholder">팀에 배정된 후보가 없습니다.</div>
    <div class="summoners">
      {#each positions as pos}
        {@const p = team[pos]}
        {@const puuid = p?.summary?.puuid ?? null}
        {@const dropKey = `team${teamIndex}-${pos}`}
        {@const posFavor = p?.positionFavor}
        {@const participantRanks = [
          { key: "지정", tierRank: p?.customRank },
          { key: "솔랭", tierRank: p?.soloRank },
          { key: "자랭", tierRank: p?.flexRank },
        ]}
        {@const masteries = (p?.mastery ?? []).sort((a, b) => b?.championPoints - a?.championPoints).slice(0, 4)}
        {@const pRank = participantRanks.reduce((acc, cur) => {
          if (cur?.tierRank == null) return acc;
          if (acc != null) return acc;
          return cur;
        }, null)}
        {@const customRank = p?.customRank}
        {@const soloRank = p?.soloRank}
        {@const flexRank = p?.flexRank}
        <ContextDiv
          class="summoner"
          draggable="true"
          onDragStart={(e) => onParticipantDragStart(e, puuid, pos, teamIndex)}
          onDragEnd={onParticipantDragEnd}
        >
          <ContextMenu className="summoner-custom-tier-ranks">
            <TierRankGroup
              onSelect={(tier, rank) => {
                setCustomCandidateCustomTierRank(puuid, tier, rank);
              }}
            />
          </ContextMenu>
          {#if draggingCandidate || draggingParticipant}
            <div
              class="droppable-zone"
              on:drop={(e) => onCandidateDrop(e, teamIndex, pos)}
              on:dragenter={(e) => onCandidateDragEnter(e, dropKey)}
              on:dragover={onCandidateDragOver}
              on:dragleave={(e) => onCandidateDragLeave(e, dropKey)}
            >
              {#if candidateHoverTarget === dropKey}
                <div class="hover-placeholder">{TeamPositionType[pos]}에 후보 배정</div>
              {/if}
            </div>
          {/if}
          <div class="position">
            <LinePosition position={pos?.toLowerCase()} interactive={false} strength={1} />
          </div>
          {#if p != null}
            <div class="profile-icon img">
              <SafeImg src={profileIconUrl(p?.summary?.profileIconId)} />
            </div>
            <div class="name" on:mouseup={(e) => goToPlayerPage(p?.summary?.gameName, p?.summary?.tagLine)}>
              {#if p?.summary?.gameName != null && p?.summary?.tagLine != null}
                <div class="game-name">{p?.summary?.gameName}</div>
                <div class="tag">#{p?.summary?.tagLine}</div>
              {:else}
                <div class="game-name">-</div>
              {/if}
            </div>
            <div class="tier-ranks">
              {#if pRank != null}
                <div class="tier-rank-item">
                  <TierRank label={pRank.key} tier={pRank.tierRank?.tier} rank={pRank.tierRank?.rank} />
                </div>
              {/if}
              <!-- {#if customRank != null}
                <div class="tier-rank-item">
                  <TierRank label={"지정"} tier={customRank.tier} rank={customRank.rank} />
                </div>
              {/if}
              {#if soloRank != null}
                <div class="tier-rank-item">
                  <TierRank label={"솔랭"} tier={soloRank.tier} rank={soloRank.rank} />
                </div>
              {/if}
              {#if (customRank == null || soloRank == null) && flexRank != null}
                <div class="tier-rank-item">
                  <TierRank label={"자랭"} tier={flexRank.tier} rank={flexRank.rank} />
                </div>
              {/if} -->
            </div>
            <div class="rating">{pRank?.tierRank?.ratingPoint ?? 0} RP</div>
            <div class="available-lines">
              {#each Object.keys(TeamPositionKeyType) as key}
                {@const lowerKey = key?.toLowerCase() ?? "-"}
                <div class="line">
                  <LinePosition
                    position={lowerKey}
                    interactive={true}
                    strength={posFavor?.[lowerKey] ?? 0}
                    showStrength={true}
                    onClick={(en) => {
                      onCandidateChangeFavorPosition(p?.summary?.puuid, key, en);
                    }}
                  />
                </div>
              {/each}
            </div>
            <div class="most-champions">
              {#each masteries as m}
                <div class="most-champion">
                  <div class="champion-icon img">
                    <SafeImg src={championIconUrl(m?.championId)} />
                  </div>
                  <div class="score">{formatMasteryPoints(m?.championPoints)}</div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty-placeholder">배정된 소환사가 없습니다.</div>
          {/if}
        </ContextDiv>
      {/each}
    </div>
  </div>
</div>
