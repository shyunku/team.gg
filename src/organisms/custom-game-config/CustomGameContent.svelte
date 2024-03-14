<script>
  import SafeImg from "../../atoms/SafeImg.svelte";
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import IoIosArrowRoundBack from "svelte-icons/io/IoIosArrowRoundBack.svelte";
  import IoIosArrowRoundForward from "svelte-icons/io/IoIosArrowRoundForward.svelte";
  import IoIosSwap from "svelte-icons/io/IoIosSwap.svelte";
  import IoIosShuffle from "svelte-icons/io/IoIosShuffle.svelte";
  import IoIosRepeat from "svelte-icons/io/IoIosRepeat.svelte";
  import IoMdClose from "svelte-icons/io/IoMdClose.svelte";
  import "./CustomGameContent.scss";
  import NameTagSearchInput from "../../molecules/NameTagSearchInput.svelte";
  import LinePosition from "../../molecules/LinePosition.svelte";
  import sha256 from "sha256";
  import {
    addCustomGameCandidateReq,
    arrangeAllCandidatesReq,
    arrangeCustomGameParticipantReq,
    championIconUrl,
    deleteCustomGameCandidateReq,
    findMostBalancedCustomGameReq,
    profileIconUrl,
    renewCustomGameTeamRankReq,
    setCustomGameCandidateCustomTierRankReq,
    setCustomGameCandidateFavorPositionReq,
    shuffleCustomGameTeamReq,
    swapCustomGameTeamReq,
    unArrangeAllCandidatesReq,
    unArrangeCustomGameParticipantReq,
  } from "../../thunks/GeneralThunk";
  import { toasts } from "svelte-toasts";
  import { TeamPositionKeyType, TeamPositionType, TierType } from "../../types/General";
  import { AxiosError } from "axios";
  import { formatMasteryPoints } from "../../utils/Util";
  import TierRank from "../../molecules/TierRank.svelte";
  import CustomGameContentTeam from "./custom-game-content/CustomGameContentTeam.svelte";
  import ContextDiv from "../../components/ContextDiv.svelte";
  import ContextMenu from "../../components/ContextMenu.svelte";
  import JsxUtil from "../../utils/JsxUtil";

  export let configId;
  export let candidates = [];

  export let team1TotalRatingPoint;
  export let team2TotalRatingPoint;

  export let updateBalance;
  export let fetchAllData;

  export let team1ParticipantsMap = {};
  export let team2ParticipantsMap = {};

  const positions = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

  let detectedMultiSearchSummoners = {};
  let draggingCandidate = false;
  let draggingParticipant = false;
  let candidateHoverTarget = null;
  let candidateMap = {};
  let visibleCandidates = [];
  let team1 = Object.keys(TeamPositionType).reduce((acc, cur) => {
    acc[cur] = null;
    return acc;
  }, {});
  let team2 = Object.keys(TeamPositionType).reduce((acc, cur) => {
    acc[cur] = null;
    return acc;
  }, {});

  const onCandidateSearch = async (name, tag) => {
    let toast;
    try {
      toast = toasts.add({
        key: `onCandidateSearch-${name}-${tag}`,
        title: "소환사 정보",
        description: `${name}#${tag}의 정보를 가져오는 중입니다...`,
        type: "info",
        duration: 0,
      });
      const resp = await addCustomGameCandidateReq(configId, name, tag);
      candidates = [...candidates, resp];
      toast.update({
        title: "소환사 정보",
        description: `${name}#${tag}의 정보를 가져왔습니다.`,
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        const code = err?.response?.status;
        switch (code) {
          case 404:
            toasts.add({
              title: "소환사 정보",
              description: `${name}#${tag}의 정보를 찾을 수 없습니다.`,
              type: "warning",
              duration: 3000,
            });
            return;
          case 409:
            toasts.add({
              title: "소환사 정보",
              description: `${name}#${tag}는 이미 추가된 소환사입니다.`,
              type: "warning",
              duration: 3000,
            });
            return;
        }
      }
      toasts.add({
        title: "소환사 정보",
        description: `${name}#${tag}의 정보를 가져오던 중 오류가 발생했습니다.`,
        type: "error",
        duration: 5000,
      });
    } finally {
      toast.remove();
    }
  };

  const selectMaxCandidates = async () => {
    try {
      await arrangeAllCandidatesReq(configId);
      try {
        fetchAllData();
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "후보 선택 오류",
        description: "후보를 선택하던 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const unselectParticipants = async () => {
    try {
      await unArrangeAllCandidatesReq(configId);
      try {
        fetchAllData();
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "후보 선택 오류",
        description: "후보를 선택하던 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const swapTeam = async () => {
    try {
      await swapCustomGameTeamReq(configId);
      try {
        fetchAllData();
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "팀 교체 오류",
        description: "팀을 교체하던 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const shuffleTeam = async () => {
    try {
      await shuffleCustomGameTeamReq(configId);
      try {
        fetchAllData();
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "팀 섞기 오류",
        description: "팀을 섞던 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const renewRanks = async () => {
    try {
      await renewCustomGameTeamRankReq(configId);
      try {
        fetchAllData();
      } catch (err) {
        console.error(err);
      }
      toasts.add({
        title: "랭크 갱신",
        description: "랭크를 갱신했습니다.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "랭크 갱신 오류",
        description: "랭크 갱신 도중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const setCustomCandidateCustomTierRank = async (puuid, tier, rank) => {
    try {
      const isUnranked = tier === "UNRANKED";
      console.log(tier, rank, isUnranked);
      await setCustomGameCandidateCustomTierRankReq(
        configId,
        puuid,
        isUnranked ? null : tier,
        isUnranked ? null : rank
      );
    } catch (err) {
      console.log(err);
      toasts.add({
        title: "지정 랭크 변경 오류",
        description: "랭크 지정에 실패했습니다.",
        duration: 3000,
        type: "error",
      });
    }
  };

  const onMultiSearchTextChange = (e) => {
    const payload = e.target.value;
    const lines = payload.split("\n");
    const filtered = lines.filter((l) => l.includes("님이 로비에 참가하셨습니다."));
    detectedMultiSearchSummoners = {};
    for (let line of filtered) {
      const match = line.match(/([a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9#\s]+)님이 로비에 참가하셨습니다./i);
      const matched = match?.[1] ?? null;
      if (matched == null) continue;
      const trimmed = matched.trim();
      if (trimmed.length === 0) continue;
      const splited = trimmed.split("#");
      if (splited.length !== 2) continue;
      const gameName = splited[0]?.trim() ?? "";
      const tag = splited[1]?.trim() ?? "";
      if (gameName.length === 0 || tag.length === 0) continue;
      const key = `${gameName}#${tag}`;
      const encryptedKey = sha256(key);

      detectedMultiSearchSummoners[encryptedKey] = { gameName, tag };
    }
  };

  const applyMultiSearch = () => {
    for (let key in detectedMultiSearchSummoners) {
      const { gameName, tag } = detectedMultiSearchSummoners[key];
      onCandidateSearch(gameName, tag);
    }
  };

  const onCandidateDragStart = (e, puuid) => {
    e.dataTransfer.setData("puuid", puuid);
    e.dataTransfer.setData("type", "candidate");
    draggingCandidate = true;
  };

  const onCandidateDragEnd = (e) => {
    // e.preventDefault();
    // console.log("end");
    draggingCandidate = false;
    candidateHoverTarget = null;
  };

  const onCandidateDragEnter = (e, key) => {
    e.preventDefault();
    // console.log("enter", key);
    candidateHoverTarget = key;
  };

  const onCandidateDragOver = (e) => {
    e.preventDefault();
  };

  const onCandidateDragLeave = (e, key) => {
    e.preventDefault();
    // console.log("leave", key);
    if (candidateHoverTarget === key) candidateHoverTarget = null;
  };

  const onCandidateDrop = async (e, team, position) => {
    console.log("dropped on", team, position);

    draggingParticipant = false;

    const puuid = e.dataTransfer.getData("puuid");
    const type = e.dataTransfer.getData("type");
    const srcPos = e.dataTransfer.getData("position");
    const srcTeam = e.dataTransfer.getData("team", team);
    const destPos = position;
    const destTeam = team;

    let toast;
    try {
      const isParticipant = type === "participant";
      toast = toasts.add({
        title: "소환사 배치",
        description: "처리중입니다...",
        type: "info",
        duration: 0,
      });
      await arrangeCustomGameParticipantReq(configId, puuid, destTeam, destPos);
      if (isParticipant) {
        // source is participant

        let destPuuid;
        if (destTeam == 1) {
          destPuuid = team1ParticipantsMap[destPos] ?? null;
        } else {
          destPuuid = team2ParticipantsMap[destPos] ?? null;
        }

        console.log(
          `team ${srcTeam} ${srcPos} (${candidateMap?.[puuid]?.summary?.name})`,
          "->",
          `team ${destTeam} ${destPos} (${candidateMap?.[destPuuid]?.summary?.name})`,
          "destPuuid",
          destPuuid
        );

        if (srcTeam == 1) {
          team1ParticipantsMap[srcPos] = destPuuid != null ? destPuuid : null;
        } else {
          team2ParticipantsMap[srcPos] = destPuuid != null ? destPuuid : null;
        }
      }

      if (destTeam == 1) {
        team1ParticipantsMap[destPos] = puuid;
      } else {
        team2ParticipantsMap[destPos] = puuid;
      }

      toast.update({
        title: "소환사 배치",
        description: "소환사를 배치했습니다.",
        type: "success",
        duration: 3000,
      });

      await updateBalance();
    } catch (err) {
      toasts.add({
        title: "소환사 배치 오류",
        description: "소환사를 배치하던 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      toast.remove();
    }
  };

  const onParticipantDragStart = (e, puuid, position, team) => {
    e.dataTransfer.setData("puuid", puuid);
    e.dataTransfer.setData("type", "participant");
    e.dataTransfer.setData("position", position);
    e.dataTransfer.setData("team", team);
    console.log("source", position, team);
    // console.log("start");
    draggingParticipant = true;
  };

  const onParticipantDragEnd = (e) => {
    // e.preventDefault();
    console.log("drag end");
    draggingParticipant = false;
  };

  const onParticipantDragEnter = (e, key) => {
    e.preventDefault();
  };

  const onParticipantDragOver = (e) => {
    e.preventDefault();
  };

  const onParticipantDragLeave = (e, key) => {
    e.preventDefault();
  };

  const onParticipantDrop = async (e) => {
    const puuid = e.dataTransfer.getData("puuid");
    console.log("unarrange", puuid);

    draggingParticipant = false;

    try {
      await unArrangeCustomGameParticipantReq(configId, puuid);
      for (let team1pPos in team1ParticipantsMap) {
        if (team1ParticipantsMap[team1pPos] === puuid) {
          team1ParticipantsMap[team1pPos] = null;
        }
      }
      for (let team2pPos in team2ParticipantsMap) {
        if (team2ParticipantsMap[team2pPos] === puuid) {
          team2ParticipantsMap[team2pPos] = null;
        }
      }
      await updateBalance();
    } catch (err) {
      console.error(err);
    }
  };

  const onCandidateChangeFavorPosition = async (puuid, position, strength) => {
    try {
      await setCustomGameCandidateFavorPositionReq(configId, puuid, position, strength);
      candidateMap[puuid].positionFavor[position.toLowerCase()] = strength;
      await updateBalance();
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "포지션 선호도 변경 오류",
        description: "포지션 선호도를 변경하던 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const onCandidateDelete = async (puuid) => {
    try {
      console.log(configId, puuid);
      await deleteCustomGameCandidateReq(configId, puuid);
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "후보 삭제 오류",
        description: "후보를 삭제하던 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  $: {
    candidateMap = candidates.reduce((acc, cur) => {
      acc[cur?.summary?.puuid] = cur;
      return acc;
    }, {});

    for (let pos in TeamPositionType) {
      const team1puuid = team1ParticipantsMap[pos] ?? null;
      team1[pos] = candidateMap[team1puuid];
    }
    for (let pos in TeamPositionType) {
      const team2puuid = team2ParticipantsMap[pos] ?? null;
      team2[pos] = candidateMap[team2puuid];
    }

    visibleCandidates = candidates.filter((c) => {
      return !Object.values(team1).includes(c) && !Object.values(team2).includes(c);
    });
    // console.log(candidateMap);
  }
</script>

<div class="custom-game-content">
  <MainContentLayout>
    <div class="content">
      <div class="teams">
        <CustomGameContentTeam
          {positions}
          bind:totalRatingPoint={team1TotalRatingPoint}
          team={team1}
          teamIndex={1}
          {onParticipantDragStart}
          {onParticipantDragEnd}
          {onCandidateDrop}
          {onCandidateDragEnter}
          {onCandidateDragOver}
          {onCandidateDragLeave}
          {onCandidateChangeFavorPosition}
          {setCustomCandidateCustomTierRank}
          {draggingCandidate}
          {draggingParticipant}
          {candidateHoverTarget}
        />
        <CustomGameContentTeam
          {positions}
          bind:totalRatingPoint={team2TotalRatingPoint}
          team={team2}
          teamIndex={2}
          {onParticipantDragStart}
          {onParticipantDragEnd}
          {onCandidateDrop}
          {onCandidateDragEnter}
          {onCandidateDragOver}
          {onCandidateDragLeave}
          {onCandidateChangeFavorPosition}
          {setCustomCandidateCustomTierRank}
          {draggingCandidate}
          {draggingParticipant}
          {candidateHoverTarget}
        />
      </div>
      <div class="sub-panels">
        <div class="utility card">
          <div class="header">유틸리티</div>
          <div class="body">
            <div class="options">
              <div class="option" on:mouseup={selectMaxCandidates}>
                <div class="icon"><IoIosArrowRoundBack /></div>
                <div class="text">최대 10명 뽑기</div>
              </div>
              <div class="option" on:mouseup={unselectParticipants}>
                <div class="icon"><IoIosArrowRoundForward /></div>
                <div class="text">전부 후보 리스트로 이동</div>
              </div>
              <div class="option" on:mouseup={swapTeam}>
                <div class="icon"><IoIosSwap /></div>
                <div class="text">팀 바꾸기</div>
              </div>
              <div class="option" on:mouseup={shuffleTeam}>
                <div class="icon"><IoIosShuffle /></div>
                <div class="text">팀 섞기</div>
              </div>
              <div class="option" on:mouseup={renewRanks}>
                <div class="icon"><IoIosRepeat /></div>
                <div class="text">팀원 랭크 갱신</div>
              </div>
              <!-- <div class="option">
                <div class="icon"><IoMdClose /></div>
                <div class="text">지정 랭크 초기화</div>
              </div> -->
            </div>
          </div>
        </div>
        <div class="multi-search card">
          <div class="header">
            <div class="label">멀티서치</div>
            <div class="applier-wrapper">
              <div class="detected">{Object.keys(detectedMultiSearchSummoners).length}명 감지됨</div>
              <div
                class={"applier" +
                  JsxUtil.classByEqual(Object.keys(detectedMultiSearchSummoners).length, 0, "disabled")}
                on:click={applyMultiSearch}
              >
                적용
              </div>
            </div>
          </div>
          <div class="body">
            <textarea
              placeholder="채팅창 복사 후#KR1 님이 로비에 참가하셨습니다.&#13;이곳에 #KR1 님이 로비에 참가하셨습니다.&#13;붙여넣기 #KR1 님이 로비에 참가하셨습니다.&#13;하면 됩니다 #KR1 님이 로비에 참가하셨습니다.&#13;참 쉽죠 #션 쿠 님이 로비에 참가하셨습니다."
              spellcheck="false"
              on:input={onMultiSearchTextChange}
            ></textarea>
          </div>
        </div>
        <div class="candidate-list card">
          <div class="header">후보</div>
          <div class="body">
            <div class="searcher">
              <div class="searcher-wrapper">
                <NameTagSearchInput
                  onEnter={onCandidateSearch}
                  onResultClick={(name, tag) => onCandidateSearch(name, tag)}
                  compact
                />
              </div>
            </div>
            <div class="candidates">
              {#if visibleCandidates.length === 0 && !draggingParticipant}
                {#if candidates.length === 0}
                  <div class="placeholder">후보를 검색하여 추가할 수 있습니다.</div>
                {:else}
                  <div class="placeholder">후보를 여기에 다시 끌어다 놓을 수 있습니다.</div>
                {/if}
              {/if}
              {#if draggingParticipant}
                <div
                  class="droppable-zone"
                  on:drop={onParticipantDrop}
                  on:dragenter={onParticipantDragEnter}
                  on:dragleave={onParticipantDragLeave}
                  on:dragover={onParticipantDragOver}
                >
                  <div class="placeholder">여기에 놓기</div>
                </div>
              {/if}
              {#each visibleCandidates as c}
                {@const candidateRanks = [c?.customRank, c?.soloRank, c?.flexRank]}
                {@const cRank = candidateRanks.reduce((acc, cur) => {
                  if (cur == null) return acc;
                  if (acc != null) return acc;
                  return cur;
                }, null)}
                {@const puuid = c?.summary?.puuid ?? null}
                <ContextDiv
                  class="candidate"
                  draggable="true"
                  onDragStart={(e) => onCandidateDragStart(e, puuid)}
                  onDragEnd={onCandidateDragEnd}
                >
                  <ContextMenu className="candidate-menu">
                    <div class="menu" on:click={(e) => onCandidateDelete(puuid)}>후보에서 제거</div>
                  </ContextMenu>
                  <div class="profile-icon img">
                    <SafeImg src={profileIconUrl(c?.summary?.profileIconId)} />
                  </div>
                  <div class="name">
                    <div class="game-name">{c?.summary?.gameName}</div>
                    <div class="tag">#{c?.summary?.tagLine}</div>
                  </div>
                  {#if cRank != null}
                    <TierRank tier={cRank.tier} rank={cRank.rank} compact={true} />
                  {:else}
                    <div class="tier">-</div>
                  {/if}
                </ContextDiv>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainContentLayout>
</div>
