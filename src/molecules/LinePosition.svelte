<script>
  import SafeImg from "../atoms/SafeImg.svelte";
  import JsxUtil from "../utils/JsxUtil";

  /**
   * @type {string}
   * @description 라인 아이콘의 포지션
   * @example "top", "jungle", "mid", "adc", "support"
   */
  export let position = "";
  export let enabled = false;
  export let interactive = false;

  let hovered = false;

  const sources = {
    top: {
      disabled: "/img/positions/icon-position-top-disabled.png",
      default: "/img/positions/icon-position-top.png",
      hovered: "/img/positions/icon-position-top-hover.png",
    },
    jungle: {
      disabled: "/img/positions/icon-position-jungle-disabled.png",
      default: "/img/positions/icon-position-jungle.png",
      hovered: "/img/positions/icon-position-jungle-hover.png",
    },
    mid: {
      disabled: "/img/positions/icon-position-middle-disabled.png",
      default: "/img/positions/icon-position-middle.png",
      hovered: "/img/positions/icon-position-middle-hover.png",
    },
    adc: {
      disabled: "/img/positions/icon-position-bottom-disabled.png",
      default: "/img/positions/icon-position-bottom.png",
      hovered: "/img/positions/icon-position-bottom-hover.png",
    },
    support: {
      disabled: "/img/positions/icon-position-utility-disabled.png",
      default: "/img/positions/icon-position-utility.png",
      hovered: "/img/positions/icon-position-utility-hover.png",
    },
  };

  let sourceByCondition;
  $: {
    const source = sources[position];
    if (hovered && interactive) sourceByCondition = source.hovered;
    else if (enabled) sourceByCondition = source.default;
    else sourceByCondition = source.disabled;
  }
</script>

<div
  class={"position-icon img" +
    JsxUtil.classByCondition(enabled, "enabled") +
    JsxUtil.classByCondition(interactive, "interactive")}
  on:mouseenter={(e) => {
    hovered = true;
  }}
  on:mouseleave={(e) => {
    hovered = false;
  }}
>
  <SafeImg src={sourceByCondition} />
</div>

<style lang="scss">
  .position-icon {
    width: 100%;
    height: 100%;
    opacity: 0.4;
    background-color: transparent !important;

    &.enabled {
      opacity: 1;
      filter: brightness(1.1);
    }

    &.interactive {
      cursor: pointer;
    }
  }
</style>
