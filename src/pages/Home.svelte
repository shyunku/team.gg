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

  let summonerName = "";
  let summonerTag = null;
  let favoriteSummoners = [];

  const onPlayerSearch = (gameName = summonerName, tagLine = summonerTag) => {
    push(`/player/${gameName}/${tagLine ?? "KR1"}`);
  };

  const renewFavorites = () => {
    try {
      favoriteSummoners = JSON.parse(localStorage.getItem("favorite_summoners") ?? "[]");
      console.log(favoriteSummoners);
    } catch (err) {
      console.error(err);
    }
  };

  $: {
    renewFavorites();
  }
</script>

<MainContentWrapper>
  <div class="home-content-wrapper">
    <div class="app-logo img">
      <SafeImg src="/img/common/app_logo.png" />
      <div class="version">v{APP_VERSION}</div>
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
    <div class="favorites card">
      <div class="header">즐겨찾기 (최대 5개)</div>
      <div class="favorite-summoners">
        {#each favoriteSummoners as p}
          <div class="summoner" on:mouseup={(e) => onPlayerSearch(p?.gameName, p?.tagLine)}>
            <div class="summoner-icon img">
              <SafeImg src={profileIconUrl(p?.profileIconId)} />
            </div>
            <div class="summoner-name">{p?.gameName ?? "-"}</div>
            <div class="summoner-tag">#{p?.tagLine ?? "??"}</div>
            <div
              class="favorite-icon"
              on:mouseup={(e) => {
                toggleSummonerFavorite(p?.puuid);
                renewFavorites();
              }}
            >
              <IoIosStar />
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</MainContentWrapper>
