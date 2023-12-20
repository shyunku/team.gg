<script>
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import { Pie } from "svelte-chartjs";
  import "chart.js/auto";
  import "./CustomGameSummary.scss";
  import DaughnutChart from "../../molecules/DoughnutRateChart.svelte";
  import { bgColorByRate } from "../../utils/Util";

  export let balance;

  export let team1TotalRatingPoint;
  export let team2TotalRatingPoint;

  let rpDifference = 0;
  let rpDifferenceRate = 0;

  let fairness = 0;
  let lineFairness = 0;
  let tierFairness = 0;

  $: if (balance) {
    fairness = balance?.fairness ?? 0;
    lineFairness = balance?.lineFairness ?? 0;
    tierFairness = balance?.tierFairness ?? 0;
  }

  $: if (team1TotalRatingPoint != null && team2TotalRatingPoint != null) {
    rpDifference = Math.abs(team1TotalRatingPoint - team2TotalRatingPoint);
    rpDifferenceRate =
      1 -
      Math.min(team1TotalRatingPoint, team2TotalRatingPoint) / Math.max(team1TotalRatingPoint, team2TotalRatingPoint);
  }
</script>

<div class="custom-game-summary">
  <MainContentLayout>
    <div class="summary">
      <!-- 팀 간 스탯 -->
    </div>
    <div class="stats">
      <div class="stat highlight" style={`background-color: ${bgColorByRate(fairness)};`}>
        <div class="label">총 밸런스</div>
        <div class="chart">
          <DaughnutChart rate={fairness} />
        </div>
      </div>
      <div class="stat">
        <div class="label">라인 공정성</div>
        <div class="chart">
          <DaughnutChart rate={lineFairness} />
        </div>
      </div>
      <div class="stat">
        <div class="label">티어 공정성</div>
        <div class="chart">
          <DaughnutChart rate={tierFairness} />
        </div>
      </div>
      <div class="stat">
        <div class="label">LP 차이</div>
        <div class="chart">
          <DaughnutChart rate={rpDifferenceRate} text={`${rpDifference}`} reversed={true} />
        </div>
      </div>
    </div>
  </MainContentLayout>
</div>
