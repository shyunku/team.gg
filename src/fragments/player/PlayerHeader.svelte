<script>
  import { onDestroy } from "svelte";
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
  import { profileIconUrl } from "../../thunks/GeneralThunk";
  import { toRelativeTime } from "../../utils/Datetime";

  export let summary = {};
  let t;

  let lastUpdatedRelativeTime = "-";
  $: {
    t = setInterval(() => {
      if (summary?.lastUpdatedAt) {
        let lastUpdatedAtMillis = new Date(summary?.lastUpdatedAt).getTime();
        lastUpdatedRelativeTime = toRelativeTime(lastUpdatedAtMillis);
      }
    }, 1000);
  }

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
        <div class="player-name">{summary?.name ?? "-"}</div>
        <div class="last-renewed-time">마지막 갱신: {lastUpdatedRelativeTime}</div>
        <button id="renew_btn">프로필 갱신</button>
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
          font-size: 12px;
          bottom: 0;
          padding: 6px 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.412);
        }
      }

      .player-profile-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        flex: 1;

        .player-name {
          font-size: 28px;
          font-weight: bold;
        }

        .last-renewed-time {
          font-size: 12px;
          color: rgb(215, 201, 165);
          margin-top: 8px;
        }

        #renew_btn {
          font-size: 13px;
          margin-top: 10px;
          padding: 6px 8px;
          background-color: rgb(162, 128, 49);
          color: rgb(255, 255, 255);
          border: none;
          width: 120px;
          cursor: pointer;
        }
      }
    }
  }
</style>
