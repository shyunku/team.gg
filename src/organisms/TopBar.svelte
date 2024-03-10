<script>
  import { onMount } from "svelte";
  import IpcSender from "../utils/IpcSender";
  import IoIosRemove from "svelte-icons/io/IoIosRemove.svelte";
  import MdFilterNone from "svelte-icons/md/MdFilterNone.svelte";
  import MdCropDin from "svelte-icons/md/MdCropDin.svelte";
  import IoIosClose from "svelte-icons/io/IoIosClose.svelte";
  import "./TopBar.scss";
  import SafeImg from "../atoms/SafeImg.svelte";

  let maximized = false;

  const onMinimize = () => {
    IpcSender.system.minimizeWindow();
  };

  const onMaximize = () => {
    IpcSender.system.maximizeWindow();
  };

  const onRestore = () => {
    IpcSender.system.restoreWindow();
  };

  const onClose = () => {
    IpcSender.system.terminateSignal();
  };

  onMount(() => {
    IpcSender.system.isMaximizable(({ success, data }) => {
      if (success) {
        maximized = !data;
      }
    });
    IpcSender.onAll("win_state_changed", ({ success, data }) => {
      if (success) {
        switch (data) {
          case "maximize":
            maximized = true;
            break;
          case "unmaximize":
            maximized = false;
            break;
        }
      }
    });
  });
</script>

<div class="top-bar">
  <div class="drag-section"></div>
  <div class="top-header">
    <div class="icon img">
      <SafeImg src="/img/common/team_gg_logo.png" />
    </div>
    <div class="name">team.gg</div>
    <div class="version">- {APP_VERSION ?? "0.0.0"}v</div>
  </div>
  <div class="window-control-section">
    <div class="window-control-button minimize" on:click={onMinimize}><IoIosRemove /></div>
    {#if maximized}
      <div class="window-control-button restore" on:click={onRestore}>
        <MdFilterNone />
      </div>
    {:else}
      <div class="window-control-button maximize" on:click={onMaximize}>
        <MdCropDin />
      </div>
    {/if}
    <div class="window-control-button close" on:click={onClose}><IoIosClose /></div>
  </div>
</div>
