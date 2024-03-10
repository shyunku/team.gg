<script>
  import { onMount } from "svelte";
  import MainContentLayout from "../layouts/MainContentLayout.svelte";
  import IpcSender from "../utils/IpcSender";
  import { toasts } from "svelte-toasts";
  import { push } from "svelte-spa-router";
  import "./InGame.scss";
  import JsxUtil from "../utils/JsxUtil";
  import SafeImg from "../atoms/SafeImg.svelte";
  import { profileIconUrl } from "../thunks/GeneralThunk";
  import { sanitizeString } from "../utils/Util";
  import InGameChampionSelect from "../organisms/in-game/details/InGameChampionSelect.svelte";

  const ClientStatus = {
    0: "CONNECTING",
    1: "ONLINE",
    2: "OFFLINE",
    3: "ERROR",
  };

  const Phases = {
    NONE: "None",
    LOBBY: "Lobby",
    CHAMPION_SELECT: "ChampSelect",
    IN_PROGRESS: "InProgress",
    WAITING_FOR_STATS: "WaitingForStats",
  };

  const InGameStatus = {
    CONNECTING: { key: "connecting", description: "클라이언트와 연결 중입니다..." },
    OFFLINE: { key: "offline", description: "클라이언트가 현재 오프라인입니다. 클라이언트 시작 시 자동 연결됩니다." },
    ONLINE: { key: "online", description: "현재 클라이언트와 연결된 상태입니다." },
    ERROR: { key: "error", description: "클라이언트와 연결 중 오류가 발생했습니다." },
  };

  const Stages = {
    None: "대기 상태",
    Lobby: "게임 로비",
    ChampSelect: "챔피언 선택 단계",
    InProgress: "게임 중",
    WaitingForStats: "통계 처리 중",
    GAME_END: "게임 종료 단계",
  };

  let currentIngameStatus = InGameStatus.CONNECTING;
  let currentSummoner = null;
  let currentGameFlowSession = null;

  let phase = "None";
  let isCustomGame = false;
  let gameModeName = null;
  let gameName = null;
  let sessionGameDescription = null;
  let sessionGameDetailedDescription = null;
  $: {
    phase = sanitizeString(currentGameFlowSession?.phase, Phases.NONE);
    isCustomGame = currentGameFlowSession?.gameData?.isCustomGame;
    gameModeName = sanitizeString(currentGameFlowSession?.map?.gameModeName);
    gameName = sanitizeString(currentGameFlowSession?.map?.name);
    sessionGameDescription = sanitizeString(currentGameFlowSession?.gameData?.queue?.description);
    sessionGameDetailedDescription = sanitizeString(currentGameFlowSession?.gameData?.queue?.detailedDescription);

    console.log({
      gameModeName: currentGameFlowSession?.map?.gameModeName,
      gameModeShortName: currentGameFlowSession?.map?.gameModeShortName,
      name: currentGameFlowSession?.map?.name,
      description: sessionGameDescription,
      detailedDescription: sessionGameDetailedDescription,
      phase,
    });
  }

  onMount(() => {
    if (!IpcSender.isCurrentElectron) {
      toasts.add({
        title: "잘못된 접근입니다.",
        description: "인게임 기능은 데스크톱 앱에서만 사용 가능합니다.",
        type: "error",
        duration: 5000,
      });
      push("/");
      return;
    }

    IpcSender.onAll("platform/riot_client_status", ({ success, data }) => {
      if (success) {
        currentIngameStatus = InGameStatus[ClientStatus[data]];
        if (currentIngameStatus === InGameStatus.ONLINE) {
          IpcSender.req.platform.getCurrentSummonerInfo();
          IpcSender.req.platform.getCurrentGameFlowSession();
        } else if (currentIngameStatus === InGameStatus.OFFLINE) {
          currentSummoner = null;
          currentGameFlowSession = null;
        }
      }
    });
    IpcSender.onAll("platform/riot_client_error", ({ success, data }) => {
      if (success) {
        console.error(data);
      }
    });
    IpcSender.onAll("platform/current_summoner_info", ({ success, data }) => {
      if (success) {
        currentSummoner = data;
      }
    });
    IpcSender.onAll("platform/current_game_flow_session", ({ success, data }) => {
      if (success) {
        currentGameFlowSession = data;
      }
    });

    IpcSender.req.platform.getRiotClientStatus();
  });
</script>

<svelte:head>
  <title>team.gg - 인게임</title>
</svelte:head>

<div class="in-game-header">
  <MainContentLayout>
    <div class="content">
      <div class="title">인게임 (Beta)</div>
      <div class="description">
        현재 실행되는 리그오브레전드 클라이언트와 연동하여 인게임 정보를 확인할 수 있습니다.
      </div>
    </div>
  </MainContentLayout>
</div>
<div class="in-game-status">
  <MainContentLayout>
    <div class={"content"}>
      <div class={"status-section" + JsxUtil.class(currentIngameStatus.key)}>
        <div class="status">{currentIngameStatus.key?.toUpperCase()}</div>
        <div class="status-text">{currentIngameStatus.description}</div>
      </div>
      {#if currentIngameStatus === InGameStatus.ONLINE && currentSummoner != null}
        <div class="profile-section">
          <div class="profile-image img">
            <SafeImg src={profileIconUrl(currentSummoner.profileIconId)} />
          </div>
          <div class="name">
            <div class="game-name">{currentSummoner.gameName}</div>
            <div class="tag-line">#{currentSummoner.tagLine}</div>
          </div>
        </div>
      {/if}
    </div>
  </MainContentLayout>
</div>
{#if currentIngameStatus === InGameStatus.ONLINE}
  <div class="in-game-content">
    <MainContentLayout>
      <div class="content">
        <div class="stages">
          {#each Object.keys(Stages) as stageKey}
            {@const stage = Stages[stageKey]}
            <div class={"stage" + JsxUtil.classByEqual(phase, stageKey, "current")}>{stage}</div>
          {/each}
        </div>
        <div class="game-mode-section">
          <div class="game-mode">{gameName ?? "IDLE"}</div>
          {#if phase !== Phases.NONE}
            <div class="game-description">
              - {sessionGameDetailedDescription ?? sessionGameDescription ?? (isCustomGame ? "사용자 설정" : "???")}
            </div>
          {/if}
          <div class="debug">({phase})</div>
        </div>
        <div class="in-game-details">
          {#if phase === Phases.CHAMPION_SELECT}
            <InGameChampionSelect />
          {/if}
        </div>
      </div>
    </MainContentLayout>
  </div>
{/if}
