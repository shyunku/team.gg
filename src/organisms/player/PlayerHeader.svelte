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

  export let summary = {};
  export let onTryRenew = () => {};
  export let loading = true;
  export let renewing = false;
  let t;

  let favorites = [];
  let isFavorite = false;

  let lastUpdatedRelativeTime = "-";
  $: {
    t = fastInterval(() => {
      if (summary?.lastUpdatedAt) {
        let lastUpdatedAtMillis = new Date(summary?.lastUpdatedAt).getTime();
        lastUpdatedRelativeTime = toRelativeTime(lastUpdatedAtMillis);
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
        <button id="renew_btn" on:click={onTryRenew} disabled={renewing || summary?.puuid == null}
          >{renewing ? "갱신 중..." : "프로필 갱신"}</button
        >
      </div>
    </div>
  </MainContentWrapper>
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .player-header {
    border-bottom: 1px solid $sub-border-color;
    width: 100%;
    background-color: $sub-bg-color;

    .player-info-summary {
      display: flex;
      width: 100%;
      padding: 16px 0;

      .player-profile-icon {
        position: relative;
        overflow: hidden;
        border-radius: 5px;
        width: 120px;
        height: 120px;
        border: 2px solid $main-fg-color;
        box-sizing: border-box;

        .player-level {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          font-size: 13px;
          // font-weight: bold;
          bottom: 0;
          padding: 7px 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.6);
        }
      }

      .player-profile-info {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 5px 0;
        margin-left: 20px;
        flex: 1;

        .player-name {
          display: flex;
          font-size: 28px;
          font-weight: bold;
          align-items: flex-end;

          .tag {
            margin-left: 6px;
            color: rgba(255, 255, 255, 0.25);
            // font-weight: normal;
            font-size: 22px;
            margin-top: -5px;
          }

          .favorite-icon {
            display: flex;
            align-items: center;
            height: 15px;
            border-radius: 3px;
            align-self: center;
            margin-left: 10px;
            padding: 5px 5px;
            background-color: rgba(255, 255, 255, 0.083);
            cursor: pointer;

            // &:hover {
            //   background-color: rgb(91, 81, 63);
            // }

            &.enabled {
              background-color: rgb(91, 81, 63);
              color: rgb(255, 199, 31);
            }
          }
        }

        .last-renewed-time {
          font-size: 12px;
          color: rgb(215, 201, 165);
          margin-top: 8px;
        }

        #renew_btn {
          font-size: 14px;
          margin-top: 10px;
          padding: 10px 0;
          background-color: rgb(162, 128, 49);
          color: rgb(255, 255, 255);
          border: none;
          width: 140px;
          cursor: pointer;

          &:disabled {
            background-color: rgb(59, 51, 32);
            cursor: not-allowed;
          }
        }
      }
    }
  }
</style>
