<script>
  import StatisticsChampion from "./contents/StatisticsChampion.svelte";
  import StatisticsMastery from "./contents/StatisticsMastery.svelte";
  import StatisticsTier from "./contents/StatisticsTier.svelte";

  export let menu;
</script>

{#if menu === "champion"}
  <StatisticsChampion />
{:else if menu === "tier"}
  <StatisticsTier />
{:else}
  <StatisticsMastery />
{/if}
