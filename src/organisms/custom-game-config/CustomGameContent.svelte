<script>
  import SafeImg from "../../atoms/SafeImg.svelte";
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import IoIosArrowRoundBack from "svelte-icons/io/IoIosArrowRoundBack.svelte";
  import IoIosArrowRoundForward from "svelte-icons/io/IoIosArrowRoundForward.svelte";
  import IoIosSwap from "svelte-icons/io/IoIosSwap.svelte";
  import IoIosShuffle from "svelte-icons/io/IoIosShuffle.svelte";
  import IoMdClose from "svelte-icons/io/IoMdClose.svelte";
  import "./CustomGameContent.scss";
  import NameTagSearchInput from "../../molecules/NameTagSearchInput.svelte";
  import LinePosition from "../../molecules/LinePosition.svelte";
  import {
    addCustomGameCandidateReq,
    arrangeCustomGameParticipantReq,
    championIconUrl,
    getSummonerInfo,
    profileIconUrl,
    setCustomGameCandidateFavorPositionReq,
  } from "../../thunks/GeneralThunk";
  import { toasts } from "svelte-toasts";
  import { TeamPositionKeyType, TeamPositionType } from "../../types/General";
  import { AxiosError } from "axios";
  import { formatMasteryPoints } from "../../utils/Util";

  export let configId;
  export let candidates = [];
  export let team1Participants = [];
  export let team2Participants = [];
  let team1ParitcipantsMap = {};
  let team2ParitcipantsMap = {};

  const positions = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

  let dragging = false;
  let candidateHoverTarget = null;
  let candidateMap = {};
  let visibleCandidates = [];
  let team1 = Object.keys(TeamPositionType).reduce((acc, cur) => {
    acc[cur] = team1ParitcipantsMap[cur] ?? null;
    return acc;
  }, {});
  let team2 = Object.keys(TeamPositionType).reduce((acc, cur) => {
    acc[cur] = team2ParitcipantsMap[cur] ?? null;
    return acc;
  }, {});

  const onCandidateSearch = async (name, tag) => {
    let toast;
    try {
      toast = toasts.add({
        title: "소환사 정보",
        description: "소환사 정보를 가져오는 중입니다...",
        type: "info",
        duration: 0,
      });
      const resp = await addCustomGameCandidateReq(configId, name, tag);
      candidates = [...candidates, resp];
      toast.update({
        title: "소환사 정보",
        description: "소환사 정보를 가져왔습니다.",
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
              description: "소환사 정보를 찾을 수 없습니다.",
              type: "warning",
            });
            return;
          case 409:
            toasts.add({
              title: "소환사 정보",
              description: "이미 추가된 소환사입니다.",
              type: "warning",
            });
            return;
        }
      }
      toasts.add({
        title: "소환사 정보",
        description: "소환사 정보를 가져오던 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      toast.remove();
    }
  };

  const onCandidateDragStart = (e, puuid) => {
    e.dataTransfer.setData("text/plain", puuid);
    // console.log("start");
    dragging = true;
  };

  const onCandidateDragEnd = (e) => {
    // e.preventDefault();
    // console.log("end");
    dragging = false;
  };

  const onCandidateDragEnter = (e, key) => {
    e.preventDefault();
    // console.log("enter");
    candidateHoverTarget = key;
  };

  const onCandidateDragOver = (e) => {
    e.preventDefault();
  };

  const onCandidateDragLeave = (e, key) => {
    e.preventDefault();
    // console.log("leave");
    candidateHoverTarget = null;
  };

  const onCandidateDrop = async (e, team, position) => {
    // e.stopPropagation();
    const puuid = e.dataTransfer.getData("text/plain");
    let toast;
    try {
      toast = toasts.add({
        title: "소환사 배치",
        description: "처리중입니다...",
        type: "info",
        duration: 0,
      });
      await arrangeCustomGameParticipantReq(configId, puuid, team, position);
      if (team === 1) {
        team1[position] = candidateMap[puuid];
      } else {
        team2[position] = candidateMap[puuid];
      }
      toast.update({
        title: "소환사 배치",
        description: "소환사를 배치했습니다.",
        type: "success",
        duration: 3000,
      });
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

  const onParticipantDragStart = (e, puuid) => {
    e.dataTransfer.setData("text/plain", puuid);
    // console.log("start");
    dragging = true;
  };

  const onParticipantDragEnd = (e) => {
    // e.preventDefault();
    // console.log("end");
    dragging = false;
  };

  const onParticipantDragEnter = (e, key) => {
    e.preventDefault();
    // console.log("enter");
    participantHoverTarget = key;
  };

  const onParticipantDragOver = (e) => {
    e.preventDefault();
  };

  const onParticipantDragLeave = (e, key) => {
    e.preventDefault();
    // console.log("leave");
    participantHoverTarget = null;
  };

  const onParticipantDrop = (e) => {};

  const onCandidateChangeFavorPosition = async (puuid, position, enabled) => {
    try {
      await setCustomGameCandidateFavorPositionReq(configId, puuid, position, enabled);
      candidateMap[puuid].positionFavor[position.toLowerCase()] = enabled;
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "포지션 선호도 변경 오류",
        description: "포지션 선호도를 변경하던 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  $: {
    candidateMap = candidates.reduce((acc, cur) => {
      acc[cur?.summary?.puuid] = cur;
      return acc;
    }, {});

    team1ParitcipantsMap = team1Participants.reduce((acc, cur) => {
      acc[cur?.position] = cur;
      return acc;
    }, {});
    team2ParitcipantsMap = team2Participants.reduce((acc, cur) => {
      acc[cur?.position] = cur;
      return acc;
    }, {});

    for (let team1pPos in team1ParitcipantsMap) {
      const team1p = team1ParitcipantsMap[team1pPos];
      team1[team1pPos] = candidateMap[team1p?.puuid];
    }
    for (let team2pPos in team2ParitcipantsMap) {
      const team2p = team2ParitcipantsMap[team2pPos];
      team2[team2pPos] = candidateMap[team2p?.puuid];
    }

    visibleCandidates = candidates.filter((c) => {
      return !Object.values(team1).includes(c) && !Object.values(team2).includes(c);
    });
    console.log(candidateMap);
  }
</script>

<div class="custom-game-content">
  <MainContentLayout>
    <div class="content">
      <div class="teams">
        <div class="team team1 card">
          <div class="header">
            <div class="title">팀 1</div>
            <div class="rating">
              <div class="label">총 레이팅</div>
              <div class="value">1234 LP</div>
            </div>
            <div class="avg-tier">
              <div class="label">평균 티어</div>
              <div class="value">플레티넘 1</div>
            </div>
          </div>
          <div class="body">
            <div class="placeholder">팀에 배정된 후보가 없습니다.</div>
            <div class="summoners">
              {#each Array(5).fill(null) as c}
                <div class="summoner">
                  <div class="profile-icon img">
                    <SafeImg src="https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/588.png" />
                  </div>
                  <div class="name">플레이어 1</div>
                  <div class="tiers">
                    <div class="tier">플레티넘 1</div>
                    <div class="tier">다이아몬드 3</div>
                  </div>
                  <div class="rating">1234 LP</div>
                  <div class="available-lines">
                    <div class="line">
                      <LinePosition position="top" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="jungle" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="mid" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="adc" interactive={true} enabled={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="support" interactive={true} enabled={true} />
                    </div>
                  </div>
                  <div class="most-champions">
                    {#each Array(5).fill(null) as m}
                      <div class="most-champion">
                        <div class="champion-icon img">
                          <SafeImg src="https://ddragon.leagueoflegends.com/cdn/11.16.1/img/champion/Yasuo.png" />
                        </div>
                        <div class="score">139만</div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
        <div class="team team2 card">
          <div class="header">
            <div class="title">팀 2</div>
            <div class="rating">
              <div class="label">총 레이팅</div>
              <div class="value">1234 LP</div>
            </div>
            <div class="avg-tier">
              <div class="label">평균 티어</div>
              <div class="value">플레티넘 1</div>
            </div>
          </div>
          <div class="body">
            <div class="placeholder">팀에 배정된 후보가 없습니다.</div>
            <div class="summoners">
              {#each positions as pos}
                {@const p = team2[pos]}
                {@const puuid = p?.summary?.puuid ?? null}
                {@const dropKey = `team2-${pos}`}
                {@const posFavor = p?.positionFavor}
                {@const participantRanks = [p?.customRank, p?.soloRank, p?.flexRank]}
                {@const masteries = (p?.mastery ?? [])
                  .sort((a, b) => b?.championPoints - a?.championPoints)
                  .slice(0, 5)}
                {@const pRank = participantRanks.reduce((acc, cur) => {
                  if (cur == null) return acc;
                  if (acc != null) return acc;
                  return cur;
                }, null)}
                <div
                  class="summoner"
                  draggable="true"
                  on:dragstart={(e) => onParticipantDragStart(e, puuid)}
                  on:dragend={onParticipantDragEnd}
                >
                  {#if dragging}
                    <div
                      class="droppable-zone"
                      on:drop={(e) => onCandidateDrop(e, 2, pos)}
                      on:dragenter={(e) => onCandidateDragEnter(e, dropKey)}
                      on:dragover={onCandidateDragOver}
                      on:dragleave={onCandidateDragLeave}
                    >
                      {#if candidateHoverTarget === dropKey}
                        <div class="hover-placeholder">{TeamPositionType[pos]}에 후보 배정</div>
                      {/if}
                    </div>
                  {/if}
                  <div class="profile-icon img">
                    <SafeImg src={profileIconUrl(p?.summary?.profileIconId)} />
                  </div>
                  <div class="name">{p?.summary?.name ?? "-"}</div>
                  <div class="tiers">
                    <div class="tier">플레티넘 1</div>
                    <div class="tier">다이아몬드 3</div>
                  </div>
                  <div class="rating">{pRank?.ratingPoint ?? 0} RP</div>
                  <div class="available-lines">
                    {#each Object.keys(TeamPositionKeyType) as key}
                      {@const lowerKey = key?.toLowerCase() ?? "-"}
                      <div class="line">
                        <LinePosition
                          position={lowerKey}
                          interactive={true}
                          enabled={posFavor?.[lowerKey] ?? false}
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
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      <div class="sub-panels">
        <div class="utility card">
          <div class="header">유틸리티</div>
          <div class="body">
            <div class="options">
              <div class="option">
                <div class="icon"><IoIosArrowRoundBack /></div>
                <div class="text">10명 랜덤 차출</div>
              </div>
              <div class="option">
                <div class="icon"><IoIosArrowRoundForward /></div>
                <div class="text">전부 후보 리스트로 이동</div>
              </div>
              <div class="option">
                <div class="icon"><IoIosSwap /></div>
                <div class="text">팀 바꾸기</div>
              </div>
              <div class="option">
                <div class="icon"><IoIosShuffle /></div>
                <div class="text">팀 섞기</div>
              </div>
              <div class="option">
                <div class="icon"><IoMdClose /></div>
                <div class="text">지정 랭크 초기화</div>
              </div>
            </div>
          </div>
        </div>
        <div class="candidate-list card">
          <div class="header">후보</div>
          <div class="body">
            <div class="searcher">
              <div class="searcher-wrapper">
                <NameTagSearchInput onEnter={onCandidateSearch} />
              </div>
            </div>
            <div class="candidates">
              {#if visibleCandidates.length === 0}
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
                <div
                  class="candidate"
                  draggable="true"
                  on:dragstart={(e) => onCandidateDragStart(e, puuid)}
                  on:dragend={onCandidateDragEnd}
                >
                  <div class="profile-icon img">
                    <SafeImg src={profileIconUrl(c?.summary?.profileIconId)} />
                  </div>
                  <div class="name">
                    <div class="game-name">{c?.summary?.gameName}</div>
                    <div class="tag">#{c?.summary?.tagLine}</div>
                  </div>
                  <div class="tier">{cRank != null ? `${cRank?.tier} ${cRank?.rank}` : "-"}</div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainContentLayout>
</div>
