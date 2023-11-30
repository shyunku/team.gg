<script>
  import Router from "svelte-spa-router";
  import routes from "./routers/MainRouter";
  import Header from "./organisms/Header.svelte";
</script>

<svelte:head>
  <title>team.gg</title>
</svelte:head>

<Header />
<div class="content">
  <Router {routes} />
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
