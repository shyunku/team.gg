<script>
  import { push } from "svelte-spa-router";
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import NameTagSearchInput from "../../molecules/NameTagSearchInput.svelte";

  let summonerName = "";
  let summonerTag = "";

  const onPlayerSearch = () => {
    push(`/player/${summonerName}/${summonerTag ?? "KR1"}`);
  };
</script>

<div class="player-searcher">
  <MainContentLayout>
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
  </MainContentLayout>
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .player-searcher {
    display: flex;
    background-color: $color-surface;
    border-bottom: 1px solid $color-border;
    width: 100%;
    padding: 8px 0;
    box-sizing: border-box;

    .searcher {
      display: flex;
      height: 30px;
      width: 100%;
      background-color: $color-bg-elevated;
      border: 1px solid $color-border;
      border-radius: 6px;
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
        color: var(--color-text-primary);
      }

      .searcher-input {
        flex: 1;
        color: $color-text-primary;
        font-weight: normal;
        padding: 0px 4px;

        &::placeholder {
          color: $highlight-color;
          opacity: 0.7;
        }
      }

      #search_btn {
        padding: 0px 12px;
        background-color: $color-accent-soft;
        color: $color-accent-light;
        border-left: 1px solid $color-border;

        &:hover {
          background-color: $color-surface-hover;
          color: $color-text-primary;
        }
      }
    }
  }
</style>
