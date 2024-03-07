<script>
  import JsxUtil from "../utils/JsxUtil";
  import { formatRankKr, formatTierKr } from "../utils/Util";
  import "./TierRank.scss";

  export let label;
  export let tier;
  export let rank;
  export let ratingPoint;
  export let lp;
  export let compact = false;

  export let onClick;
</script>

<div
  class={"tier-rank-component" +
    JsxUtil.class(tier?.toLowerCase()) +
    JsxUtil.classByCondition(compact, "compact") +
    JsxUtil.classByEqual(label, "지정", "custom") +
    JsxUtil.classByCondition(onClick != null, "interactive")}
  on:mouseup={onClick}
>
  {#if label != null}
    <div class="label">{label}</div>
  {/if}
  <div class="value">
    <div class="tier">{formatTierKr(tier)}</div>
    <div class="rank">{formatRankKr(rank)}</div>
    {#if lp != null}
      <div class="lp">({lp} LP)</div>
    {/if}
  </div>
</div>
