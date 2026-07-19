<script>
  import SafeImg from "../../atoms/SafeImg.svelte";
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import IoIosArrowRoundBack from "svelte-icons/io/IoIosArrowRoundBack.svelte";
  import IoIosArrowRoundForward from "svelte-icons/io/IoIosArrowRoundForward.svelte";
  import IoIosSwap from "svelte-icons/io/IoIosSwap.svelte";
  import IoIosShuffle from "svelte-icons/io/IoIosShuffle.svelte";
  import IoIosRepeat from "svelte-icons/io/IoIosRepeat.svelte";
  import IoIosCode from "svelte-icons/io/IoIosCode.svelte";
  import IoMdClose from "svelte-icons/io/IoMdClose.svelte";
  import IoIosCopy from "svelte-icons/io/IoIosCopy.svelte";
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
    deleteCustomGameParticipantColorCodeReq,
    profileIconUrl,
    renewCustomGameTeamRankReq,
    saveCustomGameDefaultFavorPositionReq,
    resetCustomGameFavorPositionReq,
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
  import { removeUnicode } from "../../utils/Common";
  import { getCustomGameErrorMessage } from "../../utils/ApiError";

  export let configId;
  export let candidates = [];

  export let team1TotalRatingPoint;
  export let team2TotalRatingPoint;

  export let updateBalance;
  export let fetchAllData;

  export let team1ParticipantsMap = {};
  export let team2ParticipantsMap = {};
  export let canManage = false;
  export let ownedPuuids = [];
  export let isOptimizing = false;

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

  const isOwnedRiotAccount = (puuid) => puuid != null && ownedPuuids.includes(puuid);
  const canEditPreference = (puuid) => !isOptimizing && (canManage || isOwnedRiotAccount(puuid));
  const mutationErrorMessage = (err, fallback) => getCustomGameErrorMessage(err, fallback);

  const requireManagePermission = () => {
    if (isOptimizing) {
      toasts.add({ title: "내전 구성 잠김", description: "최적의 조합을 계산 중이라 내전 구성을 변경할 수 없습니다.", type: "warning" });
      return false;
    }
    if (!canManage) {
      toasts.add({ title: "권한 없음", description: "이 내전 구성을 변경할 권한이 없습니다.", type: "warning" });
      return false;
    }
    return true;
  };

  const saveDefaultFavorPosition = async (puuid) => {
    if (isOptimizing || !isOwnedRiotAccount(puuid)) return;
    try {
      await saveCustomGameDefaultFavorPositionReq(configId, puuid);
      toasts.add({ title: "기본 선호도", description: "현재 라인 선호도를 기본값으로 저장했습니다.", type: "success" });
    } catch (err) {
      toasts.add({ title: "기본 선호도 저장 실패", description: mutationErrorMessage(err, "기본 선호도를 저장하지 못했습니다."), type: "error" });
    }
  };

  const resetFavorPositionToDefault = async (puuid) => {
    if (isOptimizing || !isOwnedRiotAccount(puuid)) return;
    try {
      const result = await resetCustomGameFavorPositionReq(configId, puuid);
      await fetchAllData();
      toasts.add({
        title: "기본 선호도",
        description: result?.usedSavedDefault
          ? "저장된 기본 라인 선호도로 초기화했습니다."
          : "저장된 기본값이 없어 0/0/0/0/0으로 초기화했습니다.",
        type: "success",
      });
    } catch (err) {
      toasts.add({ title: "선호도 초기화 실패", description: mutationErrorMessage(err, "기본 선호도로 초기화하지 못했습니다."), type: "error" });
    }
  };

  const onCandidateSearch = async (name, tag, withWarn = true) => {
    if (!requireManagePermission()) return;
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
      return resp;
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
            if (withWarn) {
              toasts.add({
                title: "소환사 정보",
                description: `${name}#${tag}는 이미 추가된 소환사입니다.`,
                type: "warning",
                duration: 3000,
              });
            }
            return candidates.find((c) => c.summary.gameName === name && c.summary.tagLine === tag);
        }
      }
      toasts.add({
        title: "소환사 정보",
        description: mutationErrorMessage(err, `${name}#${tag}의 정보를 가져오던 중 오류가 발생했습니다.`),
        type: "error",
        duration: 5000,
      });
    } finally {
      toast.remove();
    }
  };

  const selectMaxCandidates = async () => {
    if (!requireManagePermission()) return;
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
        description: mutationErrorMessage(err, "후보를 선택하던 중 오류가 발생했습니다."),
        type: "error",
      });
    }
  };

  const unselectParticipants = async () => {
    if (!requireManagePermission()) return;
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
        description: mutationErrorMessage(err, "후보를 선택하던 중 오류가 발생했습니다."),
        type: "error",
      });
    }
  };

  const swapTeam = async () => {
    if (!requireManagePermission()) return;
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
        description: mutationErrorMessage(err, "팀을 교체하던 중 오류가 발생했습니다."),
        type: "error",
      });
    }
  };

  const shuffleTeam = async () => {
    if (!requireManagePermission()) return;
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
        description: mutationErrorMessage(err, "팀을 섞던 중 오류가 발생했습니다."),
        type: "error",
      });
    }
  };

  const renewRanks = async () => {
    if (!requireManagePermission()) return;
    let toast;
    try {
      toast = toasts.add({
        title: "랭크 갱신",
        description: "소환사들의 프로필을 갱신중입니다.",
        type: "info",
        duration: 0,
      });
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
        description: mutationErrorMessage(err, "랭크 갱신 도중 오류가 발생했습니다."),
        type: "error",
      });
    } finally {
      toast.remove();
    }
  };

  const clearColors = async () => {
    if (!requireManagePermission()) return;
    try {
      await deleteCustomGameParticipantColorCodeReq(configId);
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "컬러 라벨 초기화 오류",
        description: mutationErrorMessage(err, "컬러 라벨을 초기화하던 중 오류가 발생했습니다."),
        type: "error",
      });
    }
  };

  const copyTeamsAsText = async () => {
    const positionLabels = {
      TOP: "탑",
      JUNGLE: "정글",
      MID: "미드",
      ADC: "원딜",
      SUPPORT: "서폿",
    };
    const formatTeam = (teamIndex, team) => {
      const members = positions.map((position) => {
        const summary = team[position]?.summary;
        const riotId = summary?.gameName == null ? "-" : `${summary.gameName} #${summary.tagLine ?? "??"}`;
        return `${positionLabels[position]}: ${riotId}`;
      });
      return [`[${teamIndex}팀]`, ...members].join("\n");
    };
    const text = [formatTeam(1, team1), formatTeam(2, team2)].join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      toasts.add({
        title: "텍스트로 복사",
        description: "팀 구성을 클립보드에 복사했습니다.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "텍스트 복사 오류",
        description: "팀 구성을 복사하던 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const setCustomCandidateCustomTierRank = async (puuid, tier, rank) => {
    if (!requireManagePermission()) return;
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
        description: mutationErrorMessage(err, "랭크 지정에 실패했습니다."),
        duration: 3000,
        type: "error",
      });
    }
  };

  const onMultiSearchTextChange = (e) => {
    const payload = e.target.value;
    const lines = payload.split("\n");
    detectedMultiSearchSummoners = {};
    for (let raw of lines) {
      const joinedLobby = raw.includes("님이 로비에 참가하셨습니다.");
      const leftLobby = raw.includes("님이 로비를 떠났습니다.");
      if (!joinedLobby && !leftLobby) continue;

      // remove unicode
      let line = removeUnicode(raw);
      const match = line.match(
        /([a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9#\s]+)님이 로비(?:에 참가하셨습니다|를 떠났습니다)\./i,
      );
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

      if (joinedLobby) {
        detectedMultiSearchSummoners[encryptedKey] = { gameName, tag };
      } else {
        delete detectedMultiSearchSummoners[encryptedKey];
      }
    }
    console.log(detectedMultiSearchSummoners);
  };

  const applyMultiSearch = async () => {
    if (!requireManagePermission()) return;
    try {
      const candidatesByRiotId = candidates.reduce((map, candidate) => {
        const gameName = candidate?.summary?.gameName ?? "";
        const tagLine = candidate?.summary?.tagLine ?? "";
        map[`${gameName}#${tagLine}`.toLocaleLowerCase()] = candidate;
        return map;
      }, {});

      let addedSummoners = [];
      for (let key in detectedMultiSearchSummoners) {
        const { gameName, tag } = detectedMultiSearchSummoners[key];
        const existingCandidate = candidatesByRiotId[`${gameName}#${tag}`.toLocaleLowerCase()];
        const resp = existingCandidate ?? (await onCandidateSearch(gameName, tag, false));
        if (resp != null) {
          addedSummoners.push(resp);
        }
      }

      const teamPositions = [...positions].reduce((acc, cur) => {
        acc.push({ team: 1, position: cur });
        acc.push({ team: 2, position: cur });
        return acc;
      }, []);

      // push to participants
      await unselectParticipants();

      if (addedSummoners.length > 10) {
        addedSummoners = addedSummoners.slice(0, 10);
      }
      let index = 0;
      for (let summoner of addedSummoners) {
        const puuid = summoner?.summary?.puuid;
        const team = teamPositions[index].team;
        const position = teamPositions[index].position;
        await arrangeCustomGameParticipantReq(configId, puuid, team, position);
        index++;
      }
      try {
        fetchAllData();
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "후보 선택 오류",
        description: mutationErrorMessage(err, "후보를 선택하던 중 오류가 발생했습니다."),
        type: "error",
      });
    }
  };

  const onCandidateDragStart = (e, puuid) => {
    if (!requireManagePermission()) {
      e.preventDefault();
      return;
    }
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
    if (!requireManagePermission()) return;
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
        description: mutationErrorMessage(err, "소환사를 배치하던 중 오류가 발생했습니다."),
        type: "error",
      });
    } finally {
      toast.remove();
    }
  };

  const onParticipantDragStart = (e, puuid, position, team) => {
    if (!requireManagePermission()) {
      e.preventDefault();
      return;
    }
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
    if (!requireManagePermission()) return;
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
      toasts.add({
        title: "소환사 배치 해제 오류",
        description: mutationErrorMessage(err, "소환사를 후보 목록으로 이동하지 못했습니다."),
        type: "error",
      });
    }
  };

  const onCandidateChangeFavorPosition = async (puuid, position, strength) => {
    if (!canEditPreference(puuid)) {
      toasts.add({
        title: isOptimizing ? "내전 구성 잠김" : "권한 없음",
        description: isOptimizing
          ? "최적의 조합을 계산 중이라 포지션 선호도를 변경할 수 없습니다."
          : "본인 Riot 계정의 포지션 선호도만 변경할 수 있습니다.",
        type: "warning",
      });
      return;
    }
    try {
      await setCustomGameCandidateFavorPositionReq(configId, puuid, position, strength);
      candidateMap[puuid].positionFavor[position.toLowerCase()] = strength;
      await updateBalance();
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "포지션 선호도 변경 오류",
        description: mutationErrorMessage(err, "포지션 선호도를 변경하던 중 오류가 발생했습니다."),
        type: "error",
      });
    }
  };

  const onCandidateDelete = async (puuid) => {
    if (!requireManagePermission()) return;
    try {
      console.log(configId, puuid);
      await deleteCustomGameCandidateReq(configId, puuid);
      await fetchAllData();
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "후보 삭제 오류",
        description: mutationErrorMessage(err, "후보를 삭제하던 중 오류가 발생했습니다."),
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

    visibleCandidates = candidates
      .filter((c) => {
        return !Object.values(team1).includes(c) && !Object.values(team2).includes(c);
      })
      .sort((a, b) => {
        let aName = (a?.summary?.gameName ?? "") + "#" + (a?.summary?.tagLine ?? "");
        let bName = (b?.summary?.gameName ?? "") + "#" + (b?.summary?.tagLine ?? "");
        return aName.localeCompare(bName);
      });
    // console.log(candidateMap);
  }
</script>

<div class="custom-game-content">
  <MainContentLayout>
    <div class="content">
      <div id="teams" class="teams">
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
          {onCandidateDelete}
          {draggingCandidate}
          {draggingParticipant}
          {candidateHoverTarget}
          {configId}
          {canManage}
          {ownedPuuids}
          {isOptimizing}
          {saveDefaultFavorPosition}
          {resetFavorPositionToDefault}
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
          {onCandidateDelete}
          {draggingCandidate}
          {draggingParticipant}
          {candidateHoverTarget}
          {configId}
          {canManage}
          {ownedPuuids}
          {isOptimizing}
          {saveDefaultFavorPosition}
          {resetFavorPositionToDefault}
        />
      </div>
      <div class="sub-panels">
        <div class="utility card">
          <div class="header">유틸리티</div>
          <div class="body">
            <div class="options">
              <div class:disabled={!canManage || isOptimizing} class="option" on:mouseup={selectMaxCandidates}>
                <div class="icon"><IoIosArrowRoundBack /></div>
                <div class="text">최대 10명 뽑기</div>
              </div>
              <div class:disabled={!canManage || isOptimizing} class="option" on:mouseup={unselectParticipants}>
                <div class="icon"><IoIosArrowRoundForward /></div>
                <div class="text">전부 후보 리스트로 이동</div>
              </div>
              <div class:disabled={!canManage || isOptimizing} class="option" on:mouseup={swapTeam}>
                <div class="icon"><IoIosSwap /></div>
                <div class="text">팀 바꾸기</div>
              </div>
              <div class:disabled={!canManage || isOptimizing} class="option" on:mouseup={shuffleTeam}>
                <div class="icon"><IoIosShuffle /></div>
                <div class="text">팀 섞기</div>
              </div>
              <div class:disabled={!canManage || isOptimizing} class="option" on:mouseup={renewRanks}>
                <div class="icon"><IoIosRepeat /></div>
                <div class="text">팀원 랭크 갱신</div>
              </div>
              <div class:disabled={!canManage || isOptimizing} class="option" on:mouseup={clearColors}>
                <div class="icon"><IoIosCode /></div>
                <div class="text">컬러 라벨 전체 삭제</div>
              </div>
              <div class="option" on:mouseup={copyTeamsAsText}>
                <div class="icon"><span class="copy-icon"><IoIosCopy /></span></div>
                <div class="text">텍스트로 복사</div>
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
                  JsxUtil.classByEqual(Object.keys(detectedMultiSearchSummoners).length, 0, "disabled") +
                  JsxUtil.classByCondition(!canManage || isOptimizing, "disabled")}
                on:click={applyMultiSearch}
              >
                적용
              </div>
            </div>
          </div>
          <div class="body">
            <textarea
              disabled={!canManage || isOptimizing}
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
              <div class:disabled={!canManage || isOptimizing} class="searcher-wrapper">
                <NameTagSearchInput
                  onEnter={onCandidateSearch}
                  onResultClick={(name, tag) => onCandidateSearch(name, tag)}
                  compact
                />
              </div>
            </div>
            <div class="candidates-wrapper">
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
              <div class="candidates">
                {#if visibleCandidates.length === 0 && !draggingParticipant}
                  {#if candidates.length === 0}
                    <div class="placeholder">후보를 검색하여 추가할 수 있습니다.</div>
                  {:else}
                    <div class="placeholder">후보를 여기에 다시 끌어다 놓을 수 있습니다.</div>
                  {/if}
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
                    class={"candidate" + JsxUtil.classByCondition(isOwnedRiotAccount(puuid), "own-account") + JsxUtil.classByCondition(!canManage || isOptimizing, "not-permitted")}
                    draggable={canManage && !isOptimizing}
                    onDragStart={(e) => onCandidateDragStart(e, puuid)}
                    onDragEnd={onCandidateDragEnd}
                  >
                    <ContextMenu className="candidate-menu">
                      {#if isOwnedRiotAccount(puuid)}
                        <div
                          class:disabled={isOptimizing}
                          class="menu"
                          on:click={() => saveDefaultFavorPosition(puuid)}
                        >현재 선호도를 기본값으로 저장</div>
                        <div
                          class:disabled={isOptimizing}
                          class="menu"
                          on:click={() => resetFavorPositionToDefault(puuid)}
                        >기본값으로 초기화</div>
                      {/if}
                      <div class:disabled={!canManage || isOptimizing} class="menu" on:click={(e) => onCandidateDelete(puuid)}>후보에서 제거</div>
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
    </div>
  </MainContentLayout>
</div>
