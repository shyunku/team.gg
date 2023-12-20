<script>
  import JsxUtil from "../utils/JsxUtil";
  import { formatRankKr, formatTierKr } from "../utils/Util";

  export let label;
  export let tier;
  export let rank;
  export let ratingPoint;
  export let lp;
  export let compact = false;
</script>

<div class={"tier-rank" + JsxUtil.class(tier?.toLowerCase()) + JsxUtil.classByCondition(compact, "compact")}>
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

<style lang="scss">
  @import "../styles/variables.scss";

  .tier-rank {
    display: flex;
    align-items: center;
    padding: 5px 8px;
    border-radius: 3px;
    font-size: 12px;

    &.compact {
      background-color: transparent !important;
      background: none !important;
      padding: 0;
      box-shadow: none !important;

      .value {
        font-weight: bold;
        // color: $main-fg-color;
        // opacity: 0.6;
      }
    }

    .label {
      font-weight: bold;
      color: rgb(255, 255, 255);
      margin-right: 5px;
    }

    .value {
      display: flex;
      align-items: center;
      justify-content: center;

      .rank {
        margin-left: 3px;
      }

      .lp {
        margin-left: 3px;
      }
    }
  }

  .tier-rank {
    color: rgb(255, 255, 255);
    background-color: rgb(56, 56, 56);

    &.unranked {
      background-color: rgb(53, 53, 53);
    }

    &.iron {
      color: rgb(255, 255, 255);
      background-color: rgb(101, 101, 101);
    }

    &.bronze {
      color: rgb(255, 255, 255);
      background-color: rgb(126, 97, 78);
    }

    &.silver {
      background: linear-gradient(135deg, rgb(196, 196, 196), rgb(46, 46, 46), rgb(133, 133, 133));
    }

    &.gold {
      background: linear-gradient(135deg, rgb(255, 196, 138), rgb(153, 100, 0), rgb(232, 176, 92));
    }

    &.platinum {
      background: linear-gradient(135deg, rgb(71, 215, 255), rgb(0, 95, 89), rgb(157, 244, 255));
    }

    &.emerald {
      background: linear-gradient(135deg, rgb(107, 255, 206), rgb(0, 101, 52), rgb(50, 255, 177));
    }

    &.diamond {
      background: linear-gradient(
        135deg,
        rgb(189, 153, 255),
        rgb(30, 124, 255),
        rgb(101, 194, 255),
        rgb(219, 189, 255),
        rgb(49, 138, 255)
      );
    }

    &.master {
      background: linear-gradient(
        135deg,
        rgb(255, 209, 245),
        rgb(192, 0, 195),
        rgb(186, 95, 255),
        rgb(229, 173, 255),
        rgb(255, 49, 197)
      );
      box-shadow: 0 0 8px 1px rgba(252, 78, 255, 0.676);
    }

    &.grandmaster {
      background: linear-gradient(
        135deg,
        rgb(255, 218, 198),
        rgb(195, 0, 0),
        rgb(102, 22, 0),
        rgb(255, 165, 165),
        rgb(255, 16, 16)
      );
      box-shadow: 0 0 8px 1px rgba(255, 78, 78, 0.676);
    }

    &.challenger {
      background: linear-gradient(
        135deg,
        rgb(63, 185, 255),
        rgb(255, 216, 118),
        rgb(174, 221, 255),
        rgb(17, 160, 255),
        rgb(190, 228, 255),
        rgb(255, 201, 63)
      );
      box-shadow: 0 0 8px 1px rgba(78, 181, 255, 0.676);
    }

    &.compact {
      &.iron {
        color: rgb(92, 92, 92);
      }

      &.bronze {
        color: rgb(126, 97, 78);
      }

      &.silver {
        color: rgb(161, 161, 161);
      }

      &.gold {
        color: rgb(193, 146, 76);
      }

      &.platinum {
        color: rgb(90, 171, 200);
      }

      &.emerald {
        color: rgb(54, 182, 120);
      }

      &.diamond .value {
        background: linear-gradient(135deg, rgb(195, 163, 255), rgb(119, 178, 255));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        // color: rgb(139, 122, 218);
      }

      &.master .value {
        background: linear-gradient(135deg, rgb(244, 183, 255), rgb(255, 95, 210));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }

      &.grandmaster .value {
        background: linear-gradient(135deg, rgb(255, 165, 165), rgb(255, 81, 81));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }

      &.challenger .value {
        background: linear-gradient(
          135deg,
          rgb(135, 211, 255),
          rgb(244, 215, 141),
          rgb(184, 226, 255),
          rgb(255, 252, 178)
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }
    }
  }
</style>
