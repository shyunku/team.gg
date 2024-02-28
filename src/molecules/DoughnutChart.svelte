<script>
  import { Doughnut } from "svelte-chartjs";
  import { colorByRate } from "../utils/Util";
  import "chart.js/auto";

  export let rates = [];
  export let colors = [];
  export let cutout = 38;
  export let fill = false;

  let data = {
    labels: ["Red", "Blue"],
    datasets: [
      {
        data: rates,
        backgroundColor: colors,
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
    cutout,
  };

  $: {
    if (fill) {
      rates = [...rates, 1 - rates.reduce((a, b) => a + b, 0)];
      colors = [...colors, "#00000040"];
    }

    data.datasets[0].data = rates;
    data.datasets[0].backgroundColor = colors;
  }
</script>

<div class="dougnut-chart-wrapper">
  <Doughnut {data} {options} />
  <div class="inner">
    <slot />
  </div>
</div>

<style lang="scss">
  .dougnut-chart-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner {
      position: absolute;
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
