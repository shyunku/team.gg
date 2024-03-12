<script>
  import PageMenu from "../../../components/PageMenu.svelte";
  import PageMenuItem from "../../../components/PageMenuItem.svelte";
  import PageHeaderLayout from "../../../layouts/PageHeaderLayout.svelte";

  export let menus;
  export let menuKey;
</script>

<PageHeaderLayout class="champion-detail-menu">
  <PageMenu>
    {#each Object.values(menus) as m}
      <PageMenuItem
        selected={m.key === menuKey}
        onClick={(e) => {
          // TODO :: change menu
        }}>{m.label}</PageMenuItem
      >
    {/each}
  </PageMenu>
</PageHeaderLayout>
