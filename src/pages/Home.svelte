<script>
  import { push } from "svelte-spa-router";
  import MainContentWrapper from "../layouts/MainContentLayout.svelte";

  const onPlayerSearch = () => {
    push("/player");
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
          <option>NA</option>
          <option>EU</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="플레이어 이름"
        spellcheck="false"
        on:keydown={(e) => {
          if (e.key === "Enter") onPlayerSearch();
        }}
      />
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

    input {
      margin-left: 15px;
      width: 500px;
    }

    #search {
      margin-left: 15px;
      cursor: pointer;
    }
  }
</style>
