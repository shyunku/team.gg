<script>
  import Router from "svelte-spa-router";
  import routes from "./routers/MainRouter";
  import Header from "./organisms/Header.svelte";
  import { toasts, ToastContainer, FlatToast, BootstrapToast } from "svelte-toasts";
</script>

<svelte:head>
  <title>team.gg</title>
</svelte:head>

<Header />
<div class="content">
  <Router {routes} />
</div>
<ToastContainer placement="top-right" showProgress={true} width={"360px"} let:data>
  <FlatToast {data} />
</ToastContainer>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
