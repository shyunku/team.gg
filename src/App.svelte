<script>
  import Router from "svelte-spa-router";
  import routes from "./routers/MainRouter";
  import Header from "./organisms/Header.svelte";
  import TopBar from "./organisms/TopBar.svelte";
  import { toasts, ToastContainer, FlatToast, BootstrapToast } from "svelte-toasts";
  import IpcSender from "./utils/IpcSender";
</script>

<svelte:head>
  <title>team.gg</title>
</svelte:head>

{#if IpcSender.isCurrentElectron}
  <TopBar />
{/if}
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
    height: 100%;
    overflow-y: overlay;
  }
</style>
