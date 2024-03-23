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
  export let opacity = null;
  export let size = 15;
  export let brightness = null;
  export let showStrength = false;
  export let onClick = () => {};

  let hovered = false;
  let style = {};

  const TopImage = {
    disabled: "/img/positions/icon-position-top-disabled.png",
    default: "/img/positions/icon-position-top.png",
    hovered: "/img/positions/icon-position-top-hover.png",
  };
  const JungleImage = {
    disabled: "/img/positions/icon-position-jungle-disabled.png",
    default: "/img/positions/icon-position-jungle.png",
    hovered: "/img/positions/icon-position-jungle-hover.png",
  };
  const MidImage = {
    disabled: "/img/positions/icon-position-middle-disabled.png",
    default: "/img/positions/icon-position-middle.png",
    hovered: "/img/positions/icon-position-middle-hover.png",
  };
  const AdcImage = {
    disabled: "/img/positions/icon-position-bottom-disabled.png",
    default: "/img/positions/icon-position-bottom.png",
    hovered: "/img/positions/icon-position-bottom-hover.png",
  };
  const SupportImage = {
    disabled: "/img/positions/icon-position-utility-disabled.png",
    default: "/img/positions/icon-position-utility.png",
    hovered: "/img/positions/icon-position-utility-hover.png",
  };

  const sources = {
    top: TopImage,
    jungle: JungleImage,
    mid: MidImage,
    middle: MidImage,
    adc: AdcImage,
    bottom: AdcImage,
    support: SupportImage,
    utility: SupportImage,
  };

  let sourceByCondition;
  $: {
    const source = sources[position?.toLowerCase()];
    if (source) {
      if (!interactive) sourceByCondition = source.default;
      else {
        if (hovered && interactive) sourceByCondition = source.hovered;
        else if (strength !== 0) sourceByCondition = source.default;
        else sourceByCondition = source.disabled;
      }
    }

    style = {
      width: `${size}px`,
      height: `${size}px`,
    };
    if (opacity != null) {
      style = { ...style, opacity };
    }
    if (brightness !== null) {
      style = { ...style, filter: `brightness(${brightness})` };
    }
  }
</script>

<div
  class={"line-position img" +
    JsxUtil.class(`strength-${strength}`) +
    JsxUtil.classByCondition(interactive, "interactive")}
  style={Object.keys(style)
    .map((k) => `${k}: ${style[k]} !important`)
    .join("; ")}
  on:mouseenter={(e) => {
    hovered = true;
  }}
  on:mouseleave={(e) => {
    hovered = false;
  }}
  on:click={(e) => interactive && onClick((strength + 1) % 3)}
  on:contextmenu={(e) => {
    e.preventDefault();
    e.stopPropagation();
    interactive && onClick(strength == -1 ? 0 : -1);
  }}
>
  <SafeImg src={sourceByCondition} />
  {#if showStrength}
    <div class="strength">{strength}</div>
  {/if}
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .line-position {
    // opacity: 0.3;
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

    &.strength--1 {
      // red image
      opacity: 0.7;
      filter: sepia(1) hue-rotate(-50deg) brightness(0.8) saturate(6) contrast(1);

      .strength {
        // background-color: rgba(255, 0, 0, 0.7);
        // z-index: 3;
      }
    }

    &.strength-0 {
      opacity: 0.3;
      filter: grayscale(1) brightness(1);
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
