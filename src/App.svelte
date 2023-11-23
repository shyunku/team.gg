<script>
  import Router from "svelte-spa-router";
  import routes from "./routers/MainRouter";
  import Header from "./organisms/Header.svelte";
</script>

<Header />
<div class="content">
  <Router {routes} />
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    // background-color: rgb(229, 217, 239);
    flex: 1;
  }
</style>
