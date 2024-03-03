<script>
  import PlayerContentTotal from "../organisms/player/contents/PlayerContentTotal.svelte";
  import PlayerHeader from "../organisms/player/PlayerHeader.svelte";
  import PlayerSearcher from "../organisms/player/PlayerSearcher.svelte";
  import PlayerStatMenu from "../organisms/player/PlayerStatMenu.svelte";
  import { PlayerInfoMenu } from "../types/General";
  import {
    getSummonerInfoByPuuidReq,
    getSummonerInfoReq,
    loadMoreMatches,
    renewSummonerInfoReq,
  } from "../thunks/GeneralThunk";
  import PlayerContentMastery from "../organisms/player/contents/PlayerContentMastery.svelte";
  import PlayerContentIngame from "../organisms/player/contents/PlayerContentIngame.svelte";
  import { location, push } from "svelte-spa-router";
  import { updateSummonerInfo } from "../utils/Storage";
  import { toasts } from "svelte-toasts";

  export let params = {};

  let summonerInfo = null;
  let summonerName = null;
  let summonerTag = null;

  let matches = [];
  let renewing = false;
  let loading = false;
  let loadingMoreMatches = false;
  let summonerNotFound = false;

  let menu = PlayerInfoMenu.total;

  $: {
    // console.log("params", params);
    if (!loading) {
      if (params?.puuid != null) {
        let puuid = params.puuid;
        console.log(">> load", puuid);
        loadSummonerMetadata(params.puuid);
      } else if (summonerInfo == null || summonerName != params?.summonerName || summonerTag != params?.summonerTag) {
        summonerName = params.summonerName;
        summonerTag = params.summonerTag;
        console.log(">> load", summonerName, summonerTag ? "#" + summonerTag : "");
        loadSummonerInfo();
      }
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

  let loadSummonerMetadata = async (puuid) => {
    try {
      let data = await getSummonerInfoByPuuidReq(puuid);
      const { gameName, tagLine } = data;
      window.location = `#/player/${gameName}/${tagLine}`;
    } catch (e) {
      console.error(e);
    }
  };

  let loadSummonerInfo = async (puuid = null) => {
    const searchingName = summonerName;
    try {
      summonerNotFound = false;
      loading = true;
      summonerInfo = await getSummonerInfoReq(searchingName, summonerTag);
      updateSummonerInfo(summonerInfo?.summary?.puuid, summonerInfo?.summary);
      console.log("summonerInfo", summonerInfo);

      summonerNotFound = false;
      matches = summonerInfo?.matches ?? [];
    } catch (e) {
      console.error(e);
      // console.error(e.response?.status);
      summonerInfo = {};
      if (e.response?.status === 404) {
        console.log(`${searchingName}은/는 존재하지 않는 소환사입니다.`);
        summonerNotFound = true;
      } else {
        alert("오류가 발생했습니다.");
        push("/");
      }
    } finally {
      renewing = false;
      loading = false;
    }
  };

  let loadMoreBefore = async (queueId, before) => {
    let toast;
    try {
      toast = toasts.add({
        title: "불러오는 중...",
        description: "이전 전적을 불러오는 중입니다...",
        type: "info",
        duration: 0,
      });
      const puuid = summonerInfo?.summary?.puuid;
      if (puuid == null) {
        console.error("puuid is null");
        return;
      }
      loadingMoreMatches = true;
      let moreMatches = await loadMoreMatches(puuid, queueId, before);
      const originalMatches = matches ?? [];
      matches = [...originalMatches, ...moreMatches];
      console.log("more matches", moreMatches);
    } catch (e) {
      console.error(e);
      toasts.add({
        title: "전적 불러오기 실패",
        description: "이전 전적을 불러오는 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      loadingMoreMatches = false;
      toast.remove();
    }
  };

  let onTryRenew;
  $: onTryRenew = async () => {
    renewing = true;

    let success;
    let puuid = summonerInfo?.summary?.puuid;
    if (puuid == null) {
      return;
    }

    try {
      await renewSummonerInfoReq(puuid);
      await loadSummonerInfo();
      success = true;
    } catch (e) {
      console.error(e);
      success = false;
    } finally {
      renewing = false;
    }

    return success;
  };
</script>

<svelte:head>
  <title>{summonerName} #{summonerTag} 전적검색</title>
</svelte:head>

<PlayerSearcher bind:summonerName />
{#if summonerNotFound}
  <!-- TODO :: design this -->
  <div class="not-found">
    <div class="title">'{summonerName} #{summonerTag}'는 존재하지 않는 소환사입니다.</div>
    <div class="description">최근에 Riot ID나 태그를 변경했을 수 있습니다. 다시 확인해주세요.</div>
  </div>
{:else}
  <PlayerHeader summary={summonerInfo?.summary} {onTryRenew} {renewing} {loading} />
  <PlayerStatMenu bind:menu {summonerName} {summonerTag} />
  {#if menu === PlayerInfoMenu.total}
    {#if summonerInfo?.summary?.puuid != null}
      <PlayerContentTotal
        bind:summonerName
        sr={summonerInfo?.soloRank}
        fr={summonerInfo?.flexRank}
        bind:matches
        puuid={summonerInfo?.summary?.puuid}
        {loadMoreBefore}
        {loadingMoreMatches}
      />
    {/if}
  {:else if menu === PlayerInfoMenu.ingame}
    <PlayerContentIngame puuid={summonerInfo?.summary?.puuid} />
  {:else if menu === PlayerInfoMenu.mastery}
    <PlayerContentMastery masteries={summonerInfo?.mastery} />
  {/if}
{/if}

<style lang="scss">
  .not-found {
    display: flex;
    flex-direction: column;

    margin-top: 50px;
    text-align: center;
    font-size: 16px;
    background-color: rgb(63, 57, 46);
    padding: 30px 50px;
    width: 500px;
    border-radius: 3px;
    color: rgb(237, 221, 190);

    .description {
      margin-top: 10px;
      font-size: 13px;
      color: rgb(169, 155, 128);
    }
  }
</style>
