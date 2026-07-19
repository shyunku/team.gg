<script>
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
  export let disabled = false;
  export let highlightColor = null;

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

  let source;
  $: {
    source = sources[position?.toLowerCase()];

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
    JsxUtil.classByCondition(interactive && !disabled, "interactive") +
    JsxUtil.classByCondition(disabled, "disabled") +
    JsxUtil.classByCondition(hovered, "hovered") +
    JsxUtil.classByCondition(highlightColor != null, "highlighted")}
  style={Object.keys(style)
    .map((k) => `${k}: ${style[k]} !important`)
    .join("; ")}
  on:mouseenter={(e) => {
    hovered = true;
  }}
  on:mouseleave={(e) => {
    hovered = false;
  }}
  on:click={(e) => interactive && !disabled && onClick((strength + 1) % 3)}
  on:contextmenu={(e) => {
    e.preventDefault();
    e.stopPropagation();
    interactive && !disabled && onClick(strength == -1 ? 0 : -1);
  }}
>
  {#if highlightColor != null}
    <span
      class="highlighted-icon"
      style={`background-color:${highlightColor};-webkit-mask-image:url(${source?.default});mask-image:url(${source?.default});`}
    ></span>
  {:else if source != null}
    <span class="icon-stack">
      <span class="state-icon state-default" style={`--icon-url:url(${source.default})`}></span>
      <span class="state-icon state-disabled" style={`--icon-url:url(${source.disabled})`}></span>
      <span class="state-icon state-hovered" style={`--icon-url:url(${source.hovered})`}></span>
    </span>
  {/if}
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
      filter: sepia(1) hue-rotate(-50deg) brightness(0.64) saturate(6) contrast(1);

      .strength {
        // background-color: rgba(255, 0, 0, 0.7);
        // z-index: 3;
      }
    }

    &.strength-0 {
      opacity: 0.15;
      filter: grayscale(1) brightness(1);
    }

    &.strength-1 {
      opacity: 0.5;
      filter: brightness(1);
    }

    &.strength-2 {
      opacity: 1;
      filter: brightness(1) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3)) contrast(1.2);
    }

    &.interactive {
      cursor: pointer;
    }

    &.disabled {
      cursor: not-allowed;
    }

    &.highlighted {
      opacity: 1;
      filter: none;
    }

    .icon-stack {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;

      .state-icon {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
        background-color: $color-text-secondary;
        -webkit-mask-image: var(--icon-url);
        mask-image: var(--icon-url);
        -webkit-mask-position: center;
        mask-position: center;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: contain;
        mask-size: contain;
      }

      .state-default {
        opacity: 1;
      }

      .state-disabled {
        background-color: $color-text-muted;
      }

      .state-hovered {
        background-color: $color-highlight-hover;
      }
    }

    &.interactive.strength-0:not(.hovered) .icon-stack {
      .state-default {
        opacity: 0;
      }
      .state-disabled {
        opacity: 1;
      }
    }

    &.interactive.strength-1:not(.hovered) {
      opacity: 1;
      filter: saturate(1.25) brightness(0.68);

      .state-default {
        background-color: $color-highlight;
      }
    }


    &.interactive.strength-2:not(.hovered) {
      filter: saturate(1.25) brightness(1.08) drop-shadow(0 0 2px $color-highlight-glow);

      .state-default {
        background-color: $color-highlight-hover;
      }
    }

    &.interactive.hovered .icon-stack {
      .state-default,
      .state-disabled {
        opacity: 0;
      }
      .state-hovered {
        opacity: 1;
      }
    }

    &.interactive.strength--1.hovered {
      opacity: 1;
      filter: brightness(0.9) drop-shadow(0 0 2px $color-text-muted);

      .state-hovered {
        background-color: $color-text-muted;
      }
    }

    &.interactive.strength-0.hovered {
      opacity: 1;
      filter: saturate(1.2) brightness(0.6) drop-shadow(0 0 3px $color-highlight-glow);

      .state-hovered {
        background-color: $color-highlight;
      }
    }

    &.interactive.strength-1.hovered {
      opacity: 1;
      filter: saturate(1.25) brightness(1.08) drop-shadow(0 0 3px $color-highlight-glow);

      .state-hovered {
        background-color: $color-highlight-hover;
      }
    }

    &.interactive.strength-2.hovered {
      opacity: 1;
      filter: saturate(1.25) brightness(1.15) drop-shadow(0 0 4px $color-highlight-glow);

      .state-hovered {
        background-color: $color-highlight-light;
      }
    }

    .highlighted-icon {
      display: block;
      width: 100%;
      height: 100%;
      -webkit-mask-position: center;
      mask-position: center;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-size: contain;
      mask-size: contain;
    }
  }
</style>
