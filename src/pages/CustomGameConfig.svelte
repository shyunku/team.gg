<script>
  import { toasts } from "svelte-toasts";
  import CustomGameContent from "../organisms/custom-game-config/CustomGameContent.svelte";
  import CustomGameHeader from "../organisms/custom-game-config/CustomGameHeader.svelte";
  import CustomGameOptions from "../organisms/custom-game-config/CustomGameOptions.svelte";
  import CustomGameSummary from "../organisms/custom-game-config/CustomGameSummary.svelte";
  import { getCustomGameBalanceReq, getCustomGameConfigurationInfo } from "../thunks/GeneralThunk";

  export let params = {};
  let data = null;
  let team1TotalRatingPoint;
  let team2TotalRatingPoint;

  let candidates = [];

  let team1ParticipantsMap = {};
  let team2ParticipantsMap = {};

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

  const fetchConfigurationData = async () => {
    try {
      const resp = await getCustomGameConfigurationInfo(params.id);
      data = resp;

      candidates = data.candidates;
      team1ParticipantsMap = data.team1.reduce((acc, cur) => {
        acc[cur?.position] = cur?.puuid;
        return acc;
      }, {});
      team2ParticipantsMap = data.team2.reduce((acc, cur) => {
        acc[cur?.position] = cur?.puuid;
        return acc;
      }, {});
      console.log(resp);
    } catch (err) {
      console.error(err);
    }
  };

  fetchConfigurationData();
</script>

<svelte:head>
  <title>내전 팀 구성</title>
</svelte:head>

<CustomGameHeader name={data?.name} lastUpdatedAt={data?.lastUpdatedAt} />
<CustomGameSummary balance={data?.balance} bind:team1TotalRatingPoint bind:team2TotalRatingPoint />
<CustomGameContent
  bind:team1TotalRatingPoint
  bind:team2TotalRatingPoint
  configId={data?.id}
  {candidates}
  {team1ParticipantsMap}
  {team2ParticipantsMap}
  {updateBalance}
/>
