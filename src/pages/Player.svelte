<script>
  import PlayerContentTotal from "../fragments/player/contents/PlayerContentTotal.svelte";
  import PlayerHeader from "../fragments/player/PlayerHeader.svelte";
  import PlayerSearcher from "../fragments/player/PlayerSearcher.svelte";
  import PlayerStatMenu from "../fragments/player/PlayerStatMenu.svelte";
  import { PlayerInfoMenu } from "../types/General";
  import { getSummonerInfo, loadMoreMatches, renewSummonerInfo } from "../thunks/GeneralThunk";
  import PlayerContentMastery from "../fragments/player/contents/PlayerContentMastery.svelte";
  import PlayerContentIngame from "../fragments/player/contents/PlayerContentIngame.svelte";
  import { location, push } from "svelte-spa-router";

  export let params = {};

  let summonerInfo = null;
  let summonerName = null;

  let renewing = false;
  let loading = false;
  let loadingMoreMatches = false;
  let summonerNotFound = false;

  let menu = PlayerInfoMenu.total;

  $: {
    // console.log("params", params);
    if (!loading && (summonerInfo == null || summonerName != params?.summonerName)) {
      summonerName = params.summonerName;
      console.log(">> load", summonerName);
      loadSummonerInfo();
    }
  }

  if (params.menu != null) {
    if (PlayerInfoMenu.hasOwnProperty(params.menu)) {
      menu = PlayerInfoMenu[params.menu];
    } else {
      // reroute to total
      push(`/player/${encodeURIComponent(summonerName)}`);
    }
  }

  let loadSummonerInfo = async () => {
    const searchingName = summonerName;
    try {
      summonerNotFound = false;
      loading = true;
      summonerInfo = await getSummonerInfo(searchingName);
      console.log("summonerInfo", summonerInfo);
      summonerNotFound = false;
    } catch (e) {
      console.error(e);
      // console.error(e.response?.status);
      if (e.response?.status === 404) {
        console.log(`${searchingName}은/는 존재하지 않는 소환사입니다.`);
        summonerNotFound = true;
        summonerInfo = {};
      }
    } finally {
      renewing = false;
      loading = false;
    }
  };

  let loadMoreBefore = async (before) => {
    try {
      const puuid = summonerInfo?.summary?.puuid;
      if (puuid == null) {
        console.error("puuid is null");
        return;
      }
      loadingMoreMatches = true;
      let moreMatches = await loadMoreMatches(puuid, before);
      const originalMatches = summonerInfo?.matches ?? [];
      summonerInfo = {
        ...summonerInfo,
        matches: [...originalMatches, ...moreMatches],
      };
      console.log("more matches", moreMatches);
    } catch (e) {
      console.error(e);
    } finally {
      loadingMoreMatches = false;
    }
  };

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
      console.log("renewed summonerInfo", summonerInfo);
    } catch (e) {
      console.error(e);
    } finally {
      renewing = false;
    }
  };
</script>

<PlayerSearcher bind:summonerName />
{#if summonerNotFound}
  <!-- TODO :: design this -->
  <div class="not-found">'{summonerName}'는 존재하지 않는 소환사입니다.</div>
{:else}
  <PlayerHeader summary={summonerInfo?.summary} {onTryRenew} {renewing} {loading} />
  <PlayerStatMenu bind:menu {summonerName} />
  {#if menu === PlayerInfoMenu.total}
    {#if summonerInfo?.summary?.puuid != null}
      <PlayerContentTotal
        sr={summonerInfo?.soloRank}
        fr={summonerInfo?.flexRank}
        matches={summonerInfo?.matches}
        puuid={summonerInfo?.summary?.puuid}
        {loadMoreBefore}
        {loadingMoreMatches}
      />
    {/if}
  {:else if menu === PlayerInfoMenu.ingame}
    <PlayerContentIngame />
  {:else if menu === PlayerInfoMenu.mastery}
    <PlayerContentMastery masteries={summonerInfo?.mastery} />
  {/if}
{/if}
