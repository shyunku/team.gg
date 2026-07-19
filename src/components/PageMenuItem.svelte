<script>
  import JsxUtil from "../utils/JsxUtil";

  let { class: class_ } = $$props;

  export let selected = false;
  export let onClick = null;
</script>

<div
  class={"page-menu-item" + JsxUtil.classByCondition(selected, "selected") + JsxUtil.class(class_)}
  on:click={onClick}
>
  <slot />
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .page-menu-item {
    display: flex;
    min-width: 80px;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    color: $color-text-secondary;
    padding: 6px 12px;
    box-sizing: border-box;

    &:hover {
      background-color: var(--color-surface-hover);
    }

    &.selected {
      background-color: $color-accent-soft;
      color: $color-text-primary;
      box-shadow: inset 0 0 0 1px rgba(139, 92, 246, 0.35);
    }

    &:not(:first-child) {
      margin-left: 10px;
    }
  }
</style>
