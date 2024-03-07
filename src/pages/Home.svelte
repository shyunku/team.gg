<script>
  import { push } from "svelte-spa-router";
  import MainContentWrapper from "../layouts/MainContentLayout.svelte";
  import JsxUtil from "../utils/JsxUtil";
  import NameTagSearcher from "../molecules/NameTagSearchInput.svelte";
  import SafeImg from "../atoms/SafeImg.svelte";
  import IoIosStar from "svelte-icons/io/IoIosStar.svelte";
  import IoIosStarOutline from "svelte-icons/io/IoIosStarOutline.svelte";
  import "./Home.scss";
  import { profileIconUrl } from "../thunks/GeneralThunk";
  import { toggleSummonerFavorite } from "../utils/Storage";
  import PlayerSearcher from "../organisms/player/PlayerSearcher.svelte";
  import NameTagSearchInput from "../molecules/NameTagSearchInput.svelte";
  import { moveToPlayerPageByPuuid } from "../utils/Util";

  let summonerName = "";
  let summonerTag = null;
  let favoriteSummoners = [];

  const onPlayerSearch = (gameName = summonerName, tagLine = summonerTag) => {
    push(`/player/${gameName}/${tagLine ?? "KR1"}`);
  };

  const renewFavorites = () => {
    try {
      favoriteSummoners = JSON.parse(localStorage.getItem("favorite_summoners") ?? "[]")?.slice(0, 8) ?? [];
      console.log(favoriteSummoners);
    } catch (err) {
      console.error(err);
    }
  };

  $: {
    renewFavorites();
  }
</script>

<div class="home-cover">
  <MainContentWrapper>
    <div class="home-content-wrapper">
      <div class="app-logo img">
        <SafeImg src="/img/common/app_logo.png" />
        <div class="version">v{APP_VERSION}</div>
      </div>
      <div class="summoner-searcher">
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
        <button id="search_btn" on:click={(e) => onPlayerSearch(summonerName, summonerTag)}>검색</button>
      </div>
      <div class="favorites card">
        <div class="header">즐겨찾기 (최대 8개)</div>
        <div class="body">
          <div class="favorite-summoners">
            {#each favoriteSummoners as p}
              <div class="summoner" on:click={(e) => moveToPlayerPageByPuuid(p?.puuid)}>
                <div class="summoner-icon img">
                  <SafeImg src={profileIconUrl(p?.profileIconId)} />
                </div>
                <div class="summoner-name">{p?.gameName ?? "-"}</div>
                <div class="summoner-tag">#{p?.tagLine ?? "??"}</div>
                <div
                  class="favorite-icon"
                  on:click={(e) => {
                    e.stopPropagation();
                    toggleSummonerFavorite(p?.puuid);
                    renewFavorites();
                  }}
                >
                  <IoIosStar />
                </div>
              </div>
            {/each}
          </div>
          {#if favoriteSummoners.length === 0}
            <div class="empty">
              <div class="placeholder">즐겨찾기에 추가된 소환사가 없습니다.</div>
              <div class="placeholder">소환사 검색 후 즐겨찾기 등록을 해보세요.</div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </MainContentWrapper>
</div>
