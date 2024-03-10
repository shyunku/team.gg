<script>
  import { onMount } from "svelte";
  import IpcSender from "../../../utils/IpcSender";

  let pickCompleted = false;

  onMount(() => {
    IpcSender.req.platform.getCurrentChampSelectSession();

    IpcSender.onAll("platform/current_champ_select_session", ({ success, data }) => {
      if (success) {
        console.log(data);
      }
    });
  });
</script>

<div class="in-game-champion-select">
  {#if !pickCompleted}
    <!-- 픽 추천 -->
  {:else}
    <!-- 픽 완료, 룬/특성/템트리 추천 -->
  {/if}
</div>
