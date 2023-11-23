<script>
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
</script>

<div class="player-header">
  <MainContentWrapper>
    <div class="player-info-summary">
      <div class="player-profile-icon">
        <img src="https://via.placeholder.com/120x120" />
        <div class="player-level">Lv. 250</div>
      </div>
      <div class="player-profile-info">
        <div class="player-name">summoner name</div>
        <div class="last-renewed-time">마지막 갱신: 3분 전</div>
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
        border-radius: 3px;
        width: 120px;
        height: 120px;

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
        margin-left: 20px;
        width: 100%;

        .player-name {
          font-size: 28px;
          font-weight: bold;
        }

        .last-renewed-time {
          font-size: 12px;
          color: rgb(215, 201, 165);
          margin-top: 5px;
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
