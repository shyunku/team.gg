<script>
  import { toasts } from "svelte-toasts";
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import LinePosition from "../../../molecules/LinePosition.svelte";
  import TierRank from "../../../molecules/TierRank.svelte";
  import {
    championIconUrl,
    getTierRankByRatingPointReq,
    profileIconUrl,
    setCustomGameParticipantColorCodeReq,
  } from "../../../thunks/GeneralThunk";
  import {
    CustomGameTeammateColorLabelKeys,
    CustomGameTeammateColorLabels,
    TeamPositionKeyType,
    TeamPositionType,
  } from "../../../types/General";
  import { formatMasteryPoints, formatRankKr, formatTierKr } from "../../../utils/Util";
  import "./CustomGameContentTeam.scss";
  import ContextDiv from "../../../components/ContextDiv.svelte";
  import ContextMenu from "../../../components/ContextMenu.svelte";
  import TierRankGroup from "../../../molecules/TierRankGroup.svelte";
  import JsxUtil from "../../../utils/JsxUtil";
  import ContextMenuItem from "../../../components/ContextMenuItem.svelte";
  import ContextMenuInner from "../../../components/ContextMenuInner.svelte";

  export let configId;
  export let positions;
  export let team;
  export let teamIndex = 0;

  export let onParticipantDragStart;
  export let onParticipantDragEnd;
  export let onCandidateDrop;
  export let onCandidateDragEnter;
  export let onCandidateDragOver;
  export let onCandidateDragLeave;
  export let onCandidateDelete;

  export let onCandidateChangeFavorPosition;
  export let setCustomCandidateCustomTierRank;

  export let draggingCandidate;
  export let draggingParticipant;
  export let candidateHoverTarget;

  export let totalRatingPoint = 0;
  let teammateCount = 0;
  let avgTierRank = null;

  const setParticipantColorLabel = async (puuid, color) => {
    console.log(puuid, color);
    try {
      await setCustomGameParticipantColorCodeReq(configId, puuid, color);
    } catch (err) {
      console.log(err);
      const code = err?.response?.status;
      switch (code) {
        case 406:
          toasts.add({
            title: "컬러 지정 실패",
            description: "해당 컬러 지정 시 팀을 분리할 수 없는 경우가 발생합니다.",
            duration: 3000,
            type: "error",
          });
          break;
        case 409:
          toasts.add({
            title: "컬러 지정 실패",
            description: "6명 이상의 소환사에게 동일한 컬러를 지정할 수 없습니다.",
            duration: 3000,
            type: "error",
          });
          break;
        default:
          toasts.add({
            title: "컬러 지정 실패",
            description: "컬러 지정에 실패했습니다.",
            duration: 3000,
            type: "error",
          });
          break;
      }
    }
  };

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

  const goToPlayerPage = (e, gameName, tagLine) => {
    e.stopPropagation();
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
        {@const gameName = p?.summary?.gameName ?? null}
        {@const dropKey = `team${teamIndex}-${pos}`}
        {@const posFavor = p?.positionFavor}
        {@const participantRanks = [
          { key: "지정", tierRank: p?.customRank },
          { key: "솔랭", tierRank: p?.soloRank },
          { key: "자랭", tierRank: p?.flexRank },
        ]}
        {@const masteries = (p?.mastery ?? []).sort((a, b) => b?.championPoints - a?.championPoints).slice(0, 8)}
        {@const pRank = participantRanks.reduce((acc, cur) => {
          if (cur?.tierRank == null) return acc;
          if (acc != null) return acc;
          return cur;
        }, null)}
        {@const customRank = p?.customRank}
        {@const soloRank = p?.soloRank}
        {@const flexRank = p?.flexRank}
        <ContextDiv
          class={"summoner" + JsxUtil.class(CustomGameTeammateColorLabelKeys[p?.colorCode]?.toLowerCase() ?? "")}
          draggable="true"
          onDragStart={(e) => onParticipantDragStart(e, puuid, pos, teamIndex)}
          onDragEnd={onParticipantDragEnd}
        >
          <ContextMenu className="summoner-menus">
            <ContextMenuItem class="menu">
              <div class="label">
                {gameName} 랭크 지정
              </div>
              <ContextMenuInner class="tier-rank-group">
                <TierRankGroup
                  onSelect={(tier, rank) => {
                    setCustomCandidateCustomTierRank(puuid, tier, rank);
                  }}
                />
              </ContextMenuInner>
            </ContextMenuItem>
            <ContextMenuItem class="menu">
              <div class="label">
                {gameName} 컬러 지정
              </div>
              <ContextMenuInner class="color-label-group">
                <div class="color-label" on:click={(e) => setParticipantColorLabel(puuid, 0)}>
                  <div class="color-ball"></div>
                  <div class="label">컬러 제거</div>
                </div>
                {#each Object.keys(CustomGameTeammateColorLabels) as color}
                  <div
                    class="color-label"
                    on:click={(e) => setParticipantColorLabel(puuid, CustomGameTeammateColorLabels[color])}
                  >
                    <div class="color-ball {color.toLowerCase()}"></div>
                    <div class="label">{color}</div>
                  </div>
                {/each}
              </ContextMenuInner>
            </ContextMenuItem>
            <ContextMenuItem class="menu" on:click={(e) => onCandidateDelete(puuid)}>{gameName} 제거</ContextMenuItem>
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
            <LinePosition position={pos?.toLowerCase()} interactive={false} strength={1} size={20} />
          </div>
          {#if p != null}
            <div class="profile-icon img">
              <SafeImg src={profileIconUrl(p?.summary?.profileIconId)} />
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="name">
              <div class="name-bundle" on:click={(e) => goToPlayerPage(e, p?.summary?.gameName, p?.summary?.tagLine)}>
                {#if p?.summary?.gameName != null && p?.summary?.tagLine != null}
                  <div class="game-name">{gameName}</div>
                  <div class="tag">#{p?.summary?.tagLine}</div>
                {:else}
                  <div class="game-name">-</div>
                {/if}
              </div>
            </div>
            <!-- <div class="tier-ranks">
              {#if pRank != null}
                <div class="tier-rank-item">
                  <TierRank label={pRank.key} tier={pRank.tierRank?.tier} rank={pRank.tierRank?.rank} />
                </div>
              {/if}
            </div> -->
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
            <div class="available-lines">
              {#each Object.keys(TeamPositionKeyType) as key}
                {@const lowerKey = key?.toLowerCase() ?? "-"}
                {@const strength = posFavor?.[lowerKey] ?? 0}
                <div class="line">
                  <LinePosition
                    position={lowerKey}
                    interactive={true}
                    strength={strength ?? 0}
                    showStrength={true}
                    size={20}
                    onClick={(en) => {
                      onCandidateChangeFavorPosition(p?.summary?.puuid, key, en);
                    }}
                  />
                </div>
              {/each}
            </div>
            <!-- <div class="rating">{pRank?.tierRank?.ratingPoint ?? 0} RP</div> -->
            <div class={"representative-tier-rank" + JsxUtil.class(pRank?.tierRank?.tier?.toLowerCase())}>
              {#if pRank != null}
                <div class="rank-type">{pRank.key}</div>
                <div class="tier">{formatTierKr(pRank.tierRank?.tier)} {formatRankKr(pRank.tierRank?.rank)}</div>
              {:else}
                <div class="tier unranked">Unranked</div>
              {/if}
            </div>
          {:else}
            <div class="empty-placeholder">배정된 소환사가 없습니다.</div>
            <div class={"representative-tier-rank null"}></div>
          {/if}
        </ContextDiv>
      {/each}
    </div>
  </div>
</div>
