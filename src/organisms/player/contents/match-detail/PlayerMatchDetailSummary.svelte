<script>
  import SafeImg from "../../../../atoms/SafeImg.svelte";
  import "./PlayerMatchDetailSummary.scss";
  import PlayerMatchDetailSummaryTeammate from "./summary/PlayerMatchDetailSummaryTeammate.svelte";

  export let match;
  export let puuid;

  let team1 = [];
  let team2 = [];
  let team1MaxDealt = 0;
  let team1MaxHealToTeammates = 0;
  let team2MaxDealt = 0;
  let team2MaxHealToTeammates = 0;
  $: {
    team1 = match.team1 ?? [];
    team2 = match.team2 ?? [];
    let team1GGScores = team1.map((e) => e.ggScore);
    let team2GGScores = team2.map((e) => e.ggScore);
    let totalGGscores = [...team1GGScores, ...team2GGScores];

    team1 = team1.map((e) => ({
      ...e,
      ggRank: totalGGscores.filter((score) => score > e.ggScore).length + 1,
      teamGGRank: team1GGScores.filter((score) => score > e.ggScore).length + 1,
    }));
    team2 = team2.map((e) => ({
      ...e,
      ggRank: totalGGscores.filter((score) => score > e.ggScore).length + 1,
      teamGGRank: team2GGScores.filter((score) => score > e.ggScore).length + 1,
    }));

    team1MaxDealt = team1.reduce((acc, cur) => Math.max(acc, cur.totalDamageDealtToChampions ?? 0), 0);
    team1MaxHealToTeammates = team1.reduce((acc, cur) => acc + (cur.totalHeal ?? 0), 0);
    team2MaxDealt = team2.reduce((acc, cur) => Math.max(acc, cur.totalDamageDealtToChampions ?? 0), 0);
    team2MaxHealToTeammates = team2.reduce((acc, cur) => acc + (cur.totalHeal ?? 0), 0);
  }

  export const onActivate = () => {
    // console.log("activate");
  };
</script>

<div class="summary">
  <div class="team team-1">
    <div class="header row">
      <div class="team-name">팀 1 (블루팀)</div>
      <div class="gg-score">GG Score</div>
      <div class="kda-section">KDA</div>
      <div class="dealt">딜량/힐량</div>
      <div class="cc">CC</div>
      <div class="ward">와드(점수)</div>
      <div class="cs">CS</div>
      <div class="items">아이템</div>
    </div>
    <div class="teammates">
      {#each team1 as teammate}
        <PlayerMatchDetailSummaryTeammate
          {teammate}
          teamMaxDealt={team1MaxDealt}
          teamMaxHeal={team1MaxHealToTeammates}
          gameDuration={match.gameDuration}
          {puuid}
        />
      {/each}
    </div>
  </div>
  <div class="team team-2">
    <div class="header row">
      <div class="team-name">팀 2 (레드팀)</div>
      <div class="gg-score">GG Score</div>
      <div class="kda-section">KDA</div>
      <div class="dealt">딜량/힐량</div>
      <div class="cc">CC</div>
      <div class="ward">와드(점수)</div>
      <div class="cs">CS</div>
      <div class="items">아이템</div>
    </div>
    <div class="teammates">
      {#each team2 as teammate}
        <PlayerMatchDetailSummaryTeammate
          {teammate}
          teamMaxDealt={team2MaxDealt}
          teamMaxHeal={team2MaxHealToTeammates}
          gameDuration={match.gameDuration}
          {puuid}
        />
      {/each}
    </div>
  </div>
</div>
