<script>
  import MainContentLayout from "../../../layouts/MainContentLayout.svelte";
  import "./PlayerContentIngame.scss";

  const ingameActive = false; // TODO :: replace to real data
</script>

<MainContentLayout>
  <div class="content-wrapper">
    {#if ingameActive}
      <div class="ingame-card active card">asdf</div>
    {:else}
      <div class="ingame-card inactive card">
        <div class="body">현재 게임중이 아닙니다.</div>
      </div>
    {/if}
  </div>
</MainContentLayout>
