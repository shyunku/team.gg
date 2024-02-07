<script>
  import { ValidTierRanks } from "../types/General";
  import { reverseFormatRankKr } from "../utils/Util";
  import TierRank from "./TierRank.svelte";

  export let onSelect;
</script>

<div class="tier-rank-group">
  {#each Object.keys(ValidTierRanks) as tier}
    {@const ranks = ValidTierRanks[tier]}
    {#each ranks as rawRank}
      {@const rank = reverseFormatRankKr(rawRank)}
      <TierRank {tier} {rank} onClick={(e) => onSelect(tier, rank)} />
    {/each}
  {/each}
</div>

<style lang="scss">
  .tier-rank-group {
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 5px;
  }
</style>
