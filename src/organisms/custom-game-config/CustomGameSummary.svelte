<script>
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import { Pie } from "svelte-chartjs";
  import "chart.js/auto";
  import "./CustomGameSummary.scss";
  import DaughnutChart from "../../molecules/DoughnutRateChart.svelte";
  import { bgColorByRate } from "../../utils/Util";

  export let fairness = 0;
  export let lineFairness = 0;
  export let tierFairness = 0;
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
          <DaughnutChart rate={0.4} text={`-1`} reversed={true} />
        </div>
      </div>
    </div>
  </MainContentLayout>
</div>
