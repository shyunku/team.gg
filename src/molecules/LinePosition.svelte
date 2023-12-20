<script>
  import SafeImg from "../atoms/SafeImg.svelte";
  import JsxUtil from "../utils/JsxUtil";

  /**
   * @type {string}
   * @description 라인 아이콘의 포지션
   * @example "top", "jungle", "mid", "adc", "support"
   */
  export let position = "";
  export let strength = 0;
  export let interactive = false;
  export let showStrength = false;
  export let onClick = () => {};

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
    else if (strength > 0) sourceByCondition = source.default;
    else sourceByCondition = source.disabled;
  }
</script>

<div
  class={"position-icon img" +
    JsxUtil.class(`strength-${strength}`) +
    JsxUtil.classByCondition(interactive, "interactive")}
  on:mouseenter={(e) => {
    hovered = true;
  }}
  on:mouseleave={(e) => {
    hovered = false;
  }}
  on:mouseup={(e) => interactive && onClick((strength + 1) % 3)}
>
  <SafeImg src={sourceByCondition} />
  {#if showStrength}
    <div class="strength">{strength}</div>
  {/if}
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .position-icon {
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background-color: transparent !important;
    position: relative;

    .strength {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: -3px;
      right: -3px;
      width: 12px;
      height: 12px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      overflow: hidden;
      color: $main-fg-color;
      font-size: 9px;
    }

    &.strength-1 {
      opacity: 0.7;
      filter: brightness(1);
    }

    &.strength-2 {
      opacity: 1;
      filter: brightness(1) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3)) contrast(1.2);
    }

    &.interactive {
      cursor: pointer;
    }
  }
</style>
