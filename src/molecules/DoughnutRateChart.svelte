<script>
  import { Doughnut } from "svelte-chartjs";
  import { colorByRate } from "../utils/Util";
  import "chart.js/auto";

  export let rate = 0.5;
  export let text = null;
  export let reversed = false;

  const data = {
    labels: ["Red", "Blue"],
    datasets: [
      {
        data: [rate, 1 - rate],
        backgroundColor: [colorByRate(reversed ? 1 - rate : rate), "#00000040"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    borderColor: "transparent",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: 32,
  };
</script>

<div class="chart-wrapper">
  <Doughnut {data} {options} />
  <div class="text">{text ?? `${(rate * 100).toFixed(0)}%`}</div>
</div>

<style lang="scss">
  .chart-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .text {
      position: absolute;
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
