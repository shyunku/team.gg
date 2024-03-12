<script>
  import ChampionDetailContentMeta from "./contents/ChampionDetailContentMeta.svelte";

  export let menuKey;
  export let data;
</script>

{#if menuKey === "meta"}
  <ChampionDetailContentMeta {data} />
{:else if menuKey === "skill"}
  <!-- create content -->
{:else if menuKey === "counter"}
  <!-- create content -->
{/if}
