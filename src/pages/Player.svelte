<script>
  import PlayerContent from "../fragments/player/PlayerContent.svelte";
  import PlayerHeader from "../fragments/player/PlayerHeader.svelte";
  import PlayerSearcher from "../fragments/player/PlayerSearcher.svelte";
  import PlayerStatMenu from "../fragments/player/PlayerStatMenu.svelte";
  import { getSummonerInfo } from "../thunks/GeneralThunk";
  export let params = {};

  let summonerInfo = {};

  console.log(params);
  (async () => {
    let summonerName = params.summonerName;
    summonerInfo = await getSummonerInfo(summonerName);
    console.log(summonerInfo);
  })();
</script>

<PlayerSearcher />
<PlayerHeader summary={summonerInfo?.summary} />
<PlayerStatMenu />
<PlayerContent sr={summonerInfo?.soloRank} fr={summonerInfo?.flexRank} />
