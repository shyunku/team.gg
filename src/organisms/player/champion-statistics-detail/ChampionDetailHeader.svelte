<script>
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import PageHeaderLayout from "../../../layouts/PageHeaderLayout.svelte";
  import { championIconUrl } from "../../../thunks/GeneralThunk";

  const pickRateCap = 0.5;
  const winRateCap = 1;
  const banRateCap = 0.5;

  export let data;

  let pickRate = 0;
  let winRate = 0;
  let banRate = 0;
  $: {
    pickRate = data?.avgPickRate ?? 0;
    winRate = data?.avgWinRate ?? 0;
    banRate = data?.avgBanRate ?? 0;
  }
</script>

<PageHeaderLayout class="champion-detail-summary">
  <div class="content">
    <div class="champion-section">
      <div class="champion-icon img">
        <SafeImg src={championIconUrl(data?.championId)} />
      </div>
      <div class="champion-header">
        <div class="champion-name">{data?.championName}</div>
        <div class="champion-title">{data?.championTitle}</div>
        <div class="champion-story">{data?.championStory}</div>
      </div>
    </div>
    <div class="fat"></div>
    <div class="champion-stat-section">
      <div class="pick-win-ban-rate">
        <div class="rate pick-rate">
          <div class="label">픽률</div>
          <div class="value">{(pickRate * 100).toFixed(2)}%</div>
          <div class="fat"></div>
          <div class="bar">
            <div class="filler" style="width: {(pickRate * 100) / pickRateCap}%" />
          </div>
        </div>
        <div class="rate win-rate">
          <div class="label">승률</div>
          <div class="value">{(winRate * 100).toFixed(2)}%</div>
          <div class="fat"></div>
          <div class="bar">
            <div class="filler" style="width: {(winRate * 100) / winRateCap}%" />
          </div>
        </div>
        <div class="rate ban-rate">
          <div class="label">밴률</div>
          <div class="value">{(banRate * 100).toFixed(2)}%</div>
          <div class="fat"></div>
          <div class="bar">
            <div class="filler" style="width: {(banRate * 100) / banRateCap}%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</PageHeaderLayout>
