<script>
  import StatisticsChampion from "./StatisticsChampion.svelte";
  import StatisticsTier from "./StatisticsTier.svelte";

  export let menu;
</script>

{#if menu === "champion"}
  <StatisticsChampion />
{:else if menu === "tier"}
  <StatisticsTier />
{:else}
  <div>준비중입니다.</div>
{/if}
