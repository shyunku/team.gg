<script>
  import { push } from "svelte-spa-router";
  import MainContentWrapper from "../layouts/MainContentLayout.svelte";
  import JsxUtil from "../utils/JsxUtil";
  import NameTagSearcher from "../molecules/NameTagSearchInput.svelte";

  let summonerName = "";
  let summonerTag = null;

  const onPlayerSearch = () => {
    push(`/player/${summonerName}/${summonerTag ?? "KR1"}`);
  };
</script>

<MainContentWrapper>
  <div class="content-wrapper">
    <div class="app-logo">
      <img src="https://via.placeholder.com/320x200" />
    </div>
    <div class="summoner-searcher">
      <div class="summoner-region">
        <select>
          <option>KR</option>
          <!-- <option>NA</option>
          <option>EU</option> -->
        </select>
      </div>
      <div class={"id-tag-searcher" + JsxUtil.classByCondition(summonerName.length > 0, "unempty")}>
        <NameTagSearcher bind:summonerName bind:summonerTag onEnter={onPlayerSearch} />
      </div>
      <button id="search" on:click={onPlayerSearch}>검색</button>
    </div>
  </div>
</MainContentWrapper>

<style lang="scss">
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .app-logo {
    margin-top: 100px;
    margin-bottom: 50px;
  }

  .summoner-searcher {
    display: flex;
    align-items: center;

    select,
    input,
    button {
      background-color: black;
      color: white;
      border: 1px solid rgb(67, 67, 67);
      height: 40px;
      padding: 8px 12px;
      border-radius: 5px;
    }

    select {
    }

    .id-tag-searcher {
      display: flex;
      position: relative;
      align-items: center;
      margin-left: 15px;
      width: 500px;
      border: 1px solid rgb(67, 67, 67);
      height: 40px;
      border-radius: 5px;
      padding: 8px 12px;
      box-sizing: border-box;
    }

    #search {
      margin-left: 15px;
      cursor: pointer;
    }
  }
</style>
