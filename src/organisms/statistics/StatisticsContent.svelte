<script>
  import StatisticsChampion from "./StatisticsChampion.svelte";
  import StatisticsMastery from "./StatisticsMastery.svelte";
  import StatisticsTier from "./StatisticsTier.svelte";

  export let menu;
</script>

{#if menu === "champion"}
  <StatisticsChampion />
{:else if menu === "tier"}
  <StatisticsTier />
{:else}
  <StatisticsMastery />
{/if}
