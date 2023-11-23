<script>
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
</script>

<div class="player-searcher">
  <MainContentWrapper>
    <div class="searcher">
      <div class="searcher-region">
        <select id="region_selector">
          <option>KR</option>
          <option>NA</option>
          <option>EU</option>
        </select>
      </div>
      <input id="player_name_input" type="text" placeholder="플레이어 이름" spellcheck="false" />
      <button id="search_btn">검색</button>
    </div>
  </MainContentWrapper>
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .player-searcher {
    background-color: $highlight-color;
    width: 100%;
    padding: 8px 0;

    .searcher {
      display: flex;
      height: 30px;
      width: 100%;
      background-color: rgb(29, 26, 22);
      border-radius: 3px;
      font-size: 14px;

      & > * {
        height: 100%;
        border: none;
      }

      .searcher-region {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px 8px;
      }

      #region_selector {
        border: none;
        // background-color: $highlight-color;
        color: rgb(215, 201, 165);
      }

      #player_name_input {
        flex: 1;
        color: rgb(242, 228, 194);
        font-weight: normal;
        padding: 0px 4px;

        &::placeholder {
          color: $highlight-color;
          opacity: 0.7;
        }
      }

      #search_btn {
        padding: 0px 12px;
        background-color: rgb(63, 50, 36);
        color: rgb(213, 186, 123);
      }
    }
  }
</style>
