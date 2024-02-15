<script>
  import { onDestroy } from "svelte";
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
  import { profileIconUrl } from "../../thunks/GeneralThunk";
  import { toRelativeTime } from "../../utils/Datetime";
  import { fastInterval } from "../../utils/Common";
  import { toggleSummonerFavorite } from "../../utils/Storage";
  import Skeleton from "../../molecules/Skeleton.svelte";
  import IoIosStar from "svelte-icons/io/IoIosStar.svelte";
  import IoIosStarOutline from "svelte-icons/io/IoIosStarOutline.svelte";
  import "./PlayerHeader.scss";

  export let summary = {};
  export let onTryRenew = () => {};
  export let loading = true;
  export let renewing = false;
  let t;

  let favorites = [];
  let isFavorite = false;

  let lastUpdatedRelativeTime = "-";
  let canRenew = false;
  let lastUpdatedAtMillis = null;
  let renewableLeftTime = null;

  const renewAvailableTime = 1000 * 60 * 1;

  $: {
    t = fastInterval(() => {
      if (summary?.lastUpdatedAt) {
        lastUpdatedAtMillis = new Date(summary?.lastUpdatedAt).getTime();
        lastUpdatedRelativeTime = toRelativeTime(lastUpdatedAtMillis);
        canRenew = Date.now() - lastUpdatedAtMillis > renewAvailableTime;
        renewableLeftTime = Math.floor((lastUpdatedAtMillis + renewAvailableTime - Date.now()) / 1000);
      }
    }, 1000);

    try {
      favorites = JSON.parse(localStorage.getItem("favorite_summoners") ?? "[]");
      isFavorite = favorites.some((f) => f.puuid === summary?.puuid);
    } catch (err) {
      console.error(err);
    }
  }

  const onFavoriteClick = () => {
    // load from local storage
    try {
      isFavorite = toggleSummonerFavorite(summary?.puuid, summary);
    } catch (err) {
      console.error(err);
    }
  };

  onDestroy(() => {
    clearInterval(t);
  });
</script>

<div class="player-header">
  <MainContentWrapper>
    <div class="player-info-summary">
      <div class="player-profile-icon img">
        <img src={profileIconUrl(summary?.profileIconId)} />
        <div class="player-level">Lv. {summary?.summonerLevel ?? "-"}</div>
      </div>
      <div class="player-profile-info">
        <div class="player-name">
          {#if loading}
            <Skeleton height={"40px"} />
          {:else}
            <div class="name">{summary?.gameName ?? "-"}</div>
            <div class="tag">#{summary?.tagLine ?? "-"}</div>
            <div class={"favorite-icon" + (isFavorite ? " enabled" : "")} on:mouseup={onFavoriteClick}>
              {#if isFavorite}
                <IoIosStar />
              {:else}
                <IoIosStarOutline />
              {/if}
            </div>
          {/if}
        </div>
        <div class="last-renewed-time">마지막 갱신: {lastUpdatedRelativeTime}</div>
        <button id="renew_btn" on:click={onTryRenew} disabled={renewing || summary?.puuid == null || !canRenew}
          >{renewing
            ? "갱신 중..."
            : canRenew || renewableLeftTime == null
              ? `프로필 갱신`
              : `${renewableLeftTime}초 뒤 갱신 가능`}</button
        >
      </div>
    </div>
  </MainContentWrapper>
</div>
