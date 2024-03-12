<script>
  import PageMenuItem from "../../components/PageMenuItem.svelte";
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
  import { PlayerInfoMenu } from "../../types/General";
  import { location, push, querystring } from "svelte-spa-router";
  import JsxUtil from "../../utils/JsxUtil";
  import PageMenu from "../../components/PageMenu.svelte";
  import PageHeaderLayout from "../../layouts/PageHeaderLayout.svelte";

  export let summonerName;
  export let summonerTag;
  export let menu;
</script>

<PageHeaderLayout>
  <PageMenu>
    {#each Object.keys(PlayerInfoMenu) as menuKey}
      <PageMenuItem
        selected={menu === PlayerInfoMenu[menuKey]}
        onClick={() => {
          menu = PlayerInfoMenu[menuKey];
          const encodedName = encodeURIComponent(summonerName);
          const encodedTag = encodeURIComponent(summonerTag);
          if (menu === PlayerInfoMenu.total) {
            push(`/player/${encodedName}/${encodedTag}`);
          } else {
            push(`/player/${encodedName}/${encodedTag}/${menuKey}`);
          }
        }}>{PlayerInfoMenu[menuKey]}</PageMenuItem
      >
    {/each}
  </PageMenu>
</PageHeaderLayout>
