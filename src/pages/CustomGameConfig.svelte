<script>
  import { toasts } from "svelte-toasts";
  import CustomGameContent from "../organisms/custom-game-config/CustomGameContent.svelte";
  import CustomGameHeader from "../organisms/custom-game-config/CustomGameHeader.svelte";
  import CustomGameSummary from "../organisms/custom-game-config/CustomGameSummary.svelte";
  import { getCustomGameBalanceReq, getCustomGameConfigurationInfo } from "../thunks/GeneralThunk";
  import { onDestroy, onMount } from "svelte";
  import { socketStore } from "../stores/SocketStore";
  import socket from "socket.io-client/lib/socket";

  export let params = {};
  let data = null;
  let dataIndex = 0;
  let team1TotalRatingPoint;
  let team2TotalRatingPoint;

  let candidates = [];
  let weights = null;

  let team1ParticipantsMap = {};
  let team2ParticipantsMap = {};

  let socketConnected = false;
  let canManage = false;
  let ownedPuuids = [];
  let isOptimizing = false;
  let viewingPuuids = [];
  let unsubscribeSocket = () => {};

  const onViewersChanged = (payload) => {
    viewingPuuids = payload?.puuids ?? [];
  };

  const updateBalance = async () => {
    try {
      const resp = await getCustomGameBalanceReq(params.id);
      data.balance = resp;
      console.log(resp);
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "밸런스 업데이트 실패",
        description: "밸런스 업데이트에 실패했습니다.",
        duration: 3000,
        type: "error",
      });
    }
  };

  const fetchAllData = async () => {
    try {
      const resp = await getCustomGameConfigurationInfo(params.id);
      data = resp;
      dataIndex++;

      console.log(data);

      candidates = data.candidates;
      team1ParticipantsMap = data.team1.reduce((acc, cur) => {
        acc[cur?.position] = cur?.puuid;
        return acc;
      }, {});
      team2ParticipantsMap = data.team2.reduce((acc, cur) => {
        acc[cur?.position] = cur?.puuid;
        return acc;
      }, {});
      weights = data.weights;
      canManage = data.canManage === true;
      ownedPuuids = data.ownedPuuids ?? [];
      isOptimizing = data.isOptimizing === true;
      console.log(resp);
    } catch (err) {
      console.error(err);
    }
  };

  onMount(() => {
    fetchAllData();
    socketStore.initialize();
    socketStore.on("custom_config/viewers", onViewersChanged);
    unsubscribeSocket = socketStore.subscribe((value) => {
      socketConnected = value?.connected;
      if (value?.connected) {
        socketStore.emit("join_custom_config_room", params.id);
      }
    });
    socketStore.on("custom_config/updated", () => {
      fetchAllData();
    });
  });

  onDestroy(() => {
    socketStore.off("custom_config/viewers", onViewersChanged);
    unsubscribeSocket();
    socketStore.disconnect();
  });
</script>

<svelte:head>
  <title>내전 팀 구성</title>
</svelte:head>

<CustomGameHeader
  configId={data?.id}
  name={data?.name}
  lastUpdatedAt={data?.lastUpdatedAt}
  canEdit={canManage}
  locked={isOptimizing}
  onNameChanged={(name, lastUpdatedAt) => {
    data = { ...data, name, lastUpdatedAt };
  }}
/>
<CustomGameSummary
  balance={data?.balance}
  configId={data?.id}
  {dataIndex}
  {weights}
  {canManage}
  {isOptimizing}
  onOptimizingChanged={(value) => {
    isOptimizing = value;
    if (data) data = { ...data, isOptimizing: value };
  }}
  {socketConnected}
  {fetchAllData}
  bind:team1TotalRatingPoint
  bind:team2TotalRatingPoint
/>
<CustomGameContent
  bind:team1TotalRatingPoint
  bind:team2TotalRatingPoint
  configId={data?.id}
  {candidates}
  {team1ParticipantsMap}
  {team2ParticipantsMap}
  {updateBalance}
  {fetchAllData}
  {canManage}
  {ownedPuuids}
  {isOptimizing}
  {viewingPuuids}
/>
