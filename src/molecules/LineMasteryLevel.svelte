<script>
  export let level = 0;
  export let disabled = false;
  export let onChange = () => {};

  const steps = [1, 2, 3, 4, 5];
  let previewLevel = null;

  const selectLevel = (step) => {
    if (disabled) return;
    onChange(level === step ? 0 : step);
  };

  $: visibleLevel = previewLevel ?? level;
</script>

<div
  class:disabled
  class={`line-mastery-level level-${visibleLevel}`}
  title={disabled ? "라인 숙련도를 변경할 권한이 없습니다." : `라인 숙련도 ${level}/5`}
  on:mouseleave={() => (previewLevel = null)}
>
  {#each steps as step}
    <button
      type="button"
      class:active={step <= visibleLevel}
      aria-label={`${step}단계 숙련도`}
      {disabled}
      on:mouseenter={() => !disabled && (previewLevel = step)}
      on:focus={() => !disabled && (previewLevel = step)}
      on:blur={() => (previewLevel = null)}
      on:click|stopPropagation={() => selectLevel(step)}
    ></button>
  {/each}
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .line-mastery-level {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 1px;
    width: 24px;
    height: 12px;

    &.level-1 {
      color: $color-mastery-level-1;
    }
    &.level-2 {
      color: $color-mastery-level-2;
    }
    &.level-3 {
      color: $color-mastery-level-3;
    }
    &.level-4 {
      color: $color-mastery-level-4;
    }
    &.level-5 {
      color: $color-mastery-level-5;
    }

    button {
      display: block;
      flex: 0 0 3px;
      width: 3px;
      min-width: 3px;
      padding: 0;
      border: 0;
      border-radius: 1px 1px 0 0;
      background-color: $color-border-strong;
      color: inherit;
      box-shadow: none;
      cursor: pointer;
      opacity: 0.55;
      transition:
        background-color 0.1s ease,
        opacity 0.1s ease,
        filter 0.1s ease;

      &:nth-child(1) {
        height: 6px;
      }
      &:nth-child(2) {
        height: 6px;
      }
      &:nth-child(3) {
        height: 6px;
      }
      &:nth-child(4) {
        height: 6px;
      }
      &:nth-child(5) {
        height: 6px;
      }

      &.active {
        background-color: currentColor;
        opacity: 1;
      }

      &:focus,
      &:focus-visible {
        outline: none;
        border: 0;
        box-shadow: none;
      }
    }

    &:not(.disabled):hover button.active {
      filter: brightness(1.18);
    }

    &.disabled {
      cursor: not-allowed;

      button {
        cursor: not-allowed;
      }
    }
  }
</style>
