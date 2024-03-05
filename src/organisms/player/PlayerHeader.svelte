<script>
  import { onDestroy, onMount } from "svelte";
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
  import { profileIconUrl } from "../../thunks/GeneralThunk";
  import { toRelativeTime } from "../../utils/Datetime";
  import { fastInterval, formatDecimalBy3 } from "../../utils/Common";
  import { toggleSummonerFavorite } from "../../utils/Storage";
  import Skeleton from "../../molecules/Skeleton.svelte";
  import IoIosStar from "svelte-icons/io/IoIosStar.svelte";
  import IoIosStarOutline from "svelte-icons/io/IoIosStarOutline.svelte";
  import "./PlayerHeader.scss";
  import SafeImg from "../../atoms/SafeImg.svelte";
  import JsxUtil from "../../utils/JsxUtil";
  import { getGGscoreGrade } from "../../utils/Util";

  export let summary = {};
  export let extra = {};
  export let onTryRenew = () => {};
  export let loading = true;
  export let renewing = false;
  let t;

  let favorites = [];
  let isFavorite = false;
  let ranking = {};

  let lastUpdatedRelativeTime = "-";
  let canRenew = false;
  let lastUpdatedAtMillis = null;
  let renewableLeftTime = null;

  const renewAvailableTime = 1000 * 60 * 1;

  $: {
    ranking = extra?.ranking;
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

  onMount(() => {
    t = fastInterval(() => {
      if (summary?.lastUpdatedAt) {
        lastUpdatedAtMillis = new Date(summary?.lastUpdatedAt).getTime();
        lastUpdatedRelativeTime = toRelativeTime(lastUpdatedAtMillis);
        canRenew = Date.now() - lastUpdatedAtMillis > renewAvailableTime;
        renewableLeftTime = Math.floor((lastUpdatedAtMillis + renewAvailableTime - Date.now()) / 1000);
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(t);
  });
</script>

<div class="player-header">
  <MainContentWrapper>
    <div class="player-info-summary">
      <div class="player-profile-icon img">
        <SafeImg src={profileIconUrl(summary?.profileIconId)} />
        <div class="player-level">Lv. {summary?.summonerLevel ?? "-"}</div>
      </div>
      <div class="player-profile-info">
        <div class="profile-header">
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
          <div class="last-renewed-time">최근 업데이트: {lastUpdatedRelativeTime}</div>
          <button id="renew_btn" on:click={onTryRenew} disabled={renewing || summary?.puuid == null || !canRenew}
            >{renewing
              ? "갱신 중..."
              : canRenew || renewableLeftTime == null
                ? `프로필 갱신`
                : `${renewableLeftTime}초 뒤 갱신 가능`}</button
          >
        </div>
        <div class="player-detail">
          <div class="last-tiers">
            <div class="prev-tier">
              <div class="label">S2024.1</div>
              <div class="tier">언랭</div>
            </div>
            <div class="prev-tier">
              <div class="label">S2023</div>
              <div class="tier">언랭</div>
            </div>
            <!-- <div class="prev-tier">
              <div class="label">S11</div>
              <div class="tier">언랭</div>
            </div>
            <div class="prev-tier">
              <div class="label">S10</div>
              <div class="tier">언랭</div>
            </div> -->
          </div>
          <div class="ranking">
            <div class="header">
              <div class="label">소환사 랭킹</div>
              <div class="value">
                {formatDecimalBy3(ranking?.ranking ?? 0)}위 (상위 {(
                  (((ranking?.ranking ?? 1) - 1) * 100) /
                  (ranking?.total ?? 1)
                ).toFixed(3)}%)
              </div>
            </div>
            <div class="bar">
              <div
                class="filler"
                style={`width: ${100 - (((ranking?.ranking ?? 1) - 1) * 100) / (ranking?.total ?? 1)}%`}
              ></div>
            </div>
          </div>
          <div class="performance">
            <div class="header">
              <div class="label">최근 솔랭 평균 GG Score</div>
              <div class="value">{(extra?.recentAvgGGScore ?? 0).toFixed(3)}</div>
            </div>
            <div class="bar">
              <div
                class={"filler gg-grade" + JsxUtil.class(`grade-${getGGscoreGrade(extra?.recentAvgGGScore ?? 0)}`)}
                style={`width: ${extra?.recentAvgGGScore ?? 0}%`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainContentWrapper>
</div>
