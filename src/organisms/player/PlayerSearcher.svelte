<script>
  import { push } from "svelte-spa-router";
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
  import NameTagSearchInput from "../../molecules/NameTagSearchInput.svelte";

  let summonerName = "";
  let summonerTag = "";

  const onPlayerSearch = () => {
    push(`/player/${summonerName}/${summonerTag ?? "KR1"}`);
  };
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
      <div class="searcher-input">
        <NameTagSearchInput bind:summonerName bind:summonerTag onEnter={onPlayerSearch} />
      </div>
      <button id="search_btn" on:click={onPlayerSearch}>검색</button>
    </div>
  </MainContentWrapper>
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .player-searcher {
    display: flex;
    background-color: $highlight-color;
    width: 100%;
    padding: 8px 0;
    box-sizing: border-box;

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

      .searcher-input {
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
