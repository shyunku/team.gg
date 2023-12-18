<script>
  import MainContentLayout from "../../../layouts/MainContentLayout.svelte";
  import { championIconUrl } from "../../../thunks/GeneralThunk";
  import { formatDecimalBy3 } from "../../../utils/Common";
  import JsxUtil from "../../../utils/JsxUtil";
  import "./PlayerContentMastery.scss";

  export let masteries = [];
  let most3Masteries = [];
  let masteriesList = [];

  $: {
    let sortedMasteries = masteries.sort((a, b) => b.championPoints - a.championPoints);
    most3Masteries = sortedMasteries.slice(0, 3);
    masteriesList = sortedMasteries.slice(3);
  }
</script>

<MainContentLayout>
  <div class="content-wrapper">
    <div class="masteries">
      <div class="most3-masteries">
        {#each most3Masteries as mastery}
          <div class={"mastery card" + JsxUtil.class(`m-${mastery?.championLevel ?? 0}`)}>
            <div class="color-flag"></div>
            <div class="mastery-image img">
              <img src={championIconUrl(mastery?.championId)} alt={mastery?.championName ?? "???"} />
            </div>
            <div class="mastery-info">
              <div class="mastery-name">{mastery?.championName ?? "???"}</div>
              <!-- <div class="mastery-level">Level {mastery?.championLevel}</div> -->
              <div class="mastery-points">{formatDecimalBy3(mastery?.championPoints ?? 0)} 점</div>
            </div>
          </div>
        {/each}
      </div>
      <div class="masteries-list">
        {#each masteriesList as mastery}
          <div class={"mastery card" + JsxUtil.class(`m-${mastery?.championLevel ?? 0}`)}>
            <div class="color-flag"></div>
            <div class="mastery-image img">
              <img src={championIconUrl(mastery?.championId)} alt={mastery?.championName ?? "???"} />
            </div>
            <div class="mastery-info">
              <div class="mastery-header">
                <div class="mastery-level">{mastery?.championLevel ?? "?"}</div>
                <div class="mastery-name">{mastery?.championName ?? "???"}</div>
              </div>
              <!-- <div class="mastery-level">Level {mastery?.championLevel}</div> -->
              <div class="mastery-points">{formatDecimalBy3(mastery?.championPoints ?? 0)} 점</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</MainContentLayout>
