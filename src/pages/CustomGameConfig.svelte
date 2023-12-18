<script>
  import CustomGameContent from "../organisms/custom-game-config/CustomGameContent.svelte";
  import CustomGameHeader from "../organisms/custom-game-config/CustomGameHeader.svelte";
  import CustomGameOptions from "../organisms/custom-game-config/CustomGameOptions.svelte";
  import CustomGameSummary from "../organisms/custom-game-config/CustomGameSummary.svelte";
  import { getCustomGameConfigurationInfo } from "../thunks/GeneralThunk";

  export let params = {};
  let data = null;

  const fetchConfigurationData = async () => {
    try {
      const resp = await getCustomGameConfigurationInfo(params.id);
      data = resp;
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
<CustomGameSummary fairness={data?.fairness} lineFairness={data?.lineFairness} tierFairness={data?.tierFairness} />
<CustomGameContent />
