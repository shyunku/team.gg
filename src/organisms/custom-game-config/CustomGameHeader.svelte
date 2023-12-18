<script>
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import { toRelativeTime } from "../../utils/Datetime";
  import "./CustomGameHeader.scss";

  export let name = "";
  export let lastUpdatedAt = null;
</script>

<div class="custom-game-header">
  <MainContentLayout>
    <div class="header">
      <div class="title">{name}</div>
      <div class="last-update-time">최종 수정: {toRelativeTime(new Date(lastUpdatedAt ?? 0).getTime())}</div>
    </div>
  </MainContentLayout>
</div>
