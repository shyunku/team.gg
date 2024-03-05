<script>
  import SafeImg from "../../../../../atoms/SafeImg.svelte";
  import {
    championIconUrl,
    itemIconUrl,
    perkStyleIconUrl,
    summonerSpellIconUrl,
  } from "../../../../../thunks/GeneralThunk";
  import { formatDecimalBy3 } from "../../../../../utils/Common";
  import { toDuration } from "../../../../../utils/Datetime";
  import JsxUtil from "../../../../../utils/JsxUtil";
  import { getGGscoreGrade, moveToPlayerPage, moveToPlayerPageByPuuid } from "../../../../../utils/Util";

  export let teammate;
  export let teamMaxDealt;
  export let teamMaxHeal;
  export let gameDuration;
  export let puuid;
  let kda = null;

  $: {
    // console.log(teammate);
    kda = teammate?.deaths === 0 ? "Perfect" : ((teammate?.kills + teammate?.assists) / teammate?.deaths).toFixed(2);
  }
</script>

<div class={"teammate row" + JsxUtil.classByEqual(puuid, teammate?.puuid, "me")}>
  <div class="champion-icon img">
    <SafeImg src={championIconUrl(teammate?.championId)} />
    <div class="champion-level">{teammate?.championLevel}</div>
  </div>
  <div class="spells">
    <div class="spell-icon icon img">
      <SafeImg src={summonerSpellIconUrl(teammate?.summoner1Id)} />
    </div>
    <div class="spell-icon icon sub img">
      <SafeImg src={summonerSpellIconUrl(teammate?.summoner2Id)} />
    </div>
  </div>
  <div class="runes">
    <div class="rune-icon icon img">
      <SafeImg src={perkStyleIconUrl(teammate?.primaryPerkStyle)} />
    </div>
    <div class="rune-icon icon sub img">
      <SafeImg src={perkStyleIconUrl(teammate?.subPerkStyle)} />
    </div>
  </div>
  <div class="name-tier-section">
    <div class="name" on:click={moveToPlayerPageByPuuid(teammate?.puuid)}>
      {#if teammate?.riotIdName == null || teammate?.riotIdName === ""}
        <div class="game-name">{teammate?.summonerName}</div>
      {:else}
        <div class="game-name">{teammate?.riotIdName}</div>
        <div class="tag-line">#{teammate?.riotIdTagLine}</div>
      {/if}
    </div>
    <div class="tier">{teammate?.summonerLevel} 레벨</div>
  </div>
  <div class={"gg-score"}>
    <div class={"gg-score-box gg-grade" + JsxUtil.class(`grade-${getGGscoreGrade(teammate?.ggScore ?? 0)}`)}>
      <div class="score">{teammate?.ggScore?.toFixed(0) ?? 0}</div>
      <div
        class={"ranking" + JsxUtil.classByEqual(teammate?.teamGGRank ?? 0, 1, teammate?.win == true ? "mvp" : "ace")}
      >
        {#if (teammate?.teamGGRank ?? 0) == 1}
          {#if teammate?.win == true}
            MVP
          {:else}
            ACE
          {/if}
        {:else}
          {teammate?.ggRank ?? 0}등
        {/if}
      </div>
    </div>
    <!-- <div class="rank">({teammate?.ggRank ?? "-"}위)</div> -->
  </div>
  <div class="kda-section">
    <div class="kda">
      <div class="kda-segment kill">{teammate?.kills}</div>
      <div class="kda-split">/</div>
      <div class="kda-segment death">{teammate?.deaths}</div>
      <div class="kda-split">/</div>
      <div class="kda-segment assist">{teammate?.assists}</div>
    </div>
    <div class="kda-score">평점 {kda}</div>
  </div>
  <div class="dealt">
    <div class="total-dealt">
      <div class="label">{formatDecimalBy3(teammate?.totalDamageDealtToChampions ?? 0)}</div>
      <div class="bar">
        <div class="filler" style={`width: ${(teammate?.totalDamageDealtToChampions * 100) / teamMaxDealt}%;`}></div>
      </div>
    </div>
    <div class="total-heal">
      <div class="label">{formatDecimalBy3(teammate?.totalHeal ?? 0)}</div>
      <div class="bar">
        <div class="filler" style={`width: ${(teammate?.totalHeal * 100) / teamMaxHeal}%;`}></div>
      </div>
    </div>
  </div>
  <div class="cc">{toDuration((teammate?.totalTimeCCDealt ?? 0) * 1000)}</div>
  <div class="ward">
    <div class="main">
      <div class="normal">{teammate?.wardsPlaced ?? 0}</div>
      <div class="score">({teammate?.visionScore ?? 0})</div>
    </div>
    <div class="rest">
      <div class="control">{teammate?.visionWardsBoughtInGame ?? 0}</div>
      <div class="split">/</div>
      <div class="remove">{teammate?.wardsKilled ?? 0}</div>
    </div>
  </div>
  <div class="cs">
    {teammate?.totalMinionsKilled ?? 0} ({((teammate?.totalMinionsKilled ?? 0) / (gameDuration / 60)).toFixed(1)})
  </div>
  <div class="items">
    {#each Array(7) as _, ind}
      <div class="item img">
        <SafeImg src={itemIconUrl(teammate?.[`item${ind}`])} />
      </div>
    {/each}
  </div>
</div>
