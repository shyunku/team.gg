<script>
  import PlayerContentTotal from "../fragments/player/contents/PlayerContentTotal.svelte";
  import PlayerHeader from "../fragments/player/PlayerHeader.svelte";
  import PlayerSearcher from "../fragments/player/PlayerSearcher.svelte";
  import PlayerStatMenu from "../fragments/player/PlayerStatMenu.svelte";
  import { PlayerInfoMenu } from "../types/General";
  import { getSummonerInfo, renewSummonerInfo } from "../thunks/GeneralThunk";
  import PlayerContentMastery from "../fragments/player/contents/PlayerContentMastery.svelte";
  import PlayerContentIngame from "../fragments/player/contents/PlayerContentIngame.svelte";
  import { location, push } from "svelte-spa-router";

  export let params = {};

  let summonerInfo = {};
  let summonerName = params.summonerName;
  let renewing = true;

  let menu = PlayerInfoMenu.total;

  if (params.menu != null) {
    if (PlayerInfoMenu.hasOwnProperty(params.menu)) {
      menu = PlayerInfoMenu[params.menu];
    } else {
      // reroute to total
      push(`/player/${encodeURIComponent(summonerName)}`);
    }
  }

  let loadSummonerInfo = async () => {
    try {
      summonerInfo = await getSummonerInfo(summonerName);
      console.log(summonerInfo);
    } catch (e) {
      console.error(e);
    } finally {
      renewing = false;
    }
  };

  $: if (summonerName) {
    loadSummonerInfo();
  }

  let onTryRenew;
  $: onTryRenew = async () => {
    renewing = true;

    let puuid = summonerInfo?.summary?.puuid;
    if (puuid == null) {
      return;
    }

    try {
      await renewSummonerInfo(puuid);
      summonerInfo = await getSummonerInfo(summonerInfo?.summary?.name);
      console.log(summonerInfo);
    } catch (e) {
      console.error(e);
    } finally {
      renewing = false;
    }
  };
</script>

<PlayerSearcher bind:summonerName />
<PlayerHeader summary={summonerInfo?.summary} {onTryRenew} {renewing} />
<PlayerStatMenu bind:menu {summonerName} />
{#if menu === PlayerInfoMenu.total}
  <PlayerContentTotal
    sr={summonerInfo?.soloRank}
    fr={summonerInfo?.flexRank}
    matches={summonerInfo?.matches}
    puuid={summonerInfo?.summary?.puuid}
  />
{:else if menu === PlayerInfoMenu.ingame}
  <PlayerContentIngame />
{:else if menu === PlayerInfoMenu.mastery}
  <PlayerContentMastery masteries={summonerInfo?.mastery} />
{/if}
