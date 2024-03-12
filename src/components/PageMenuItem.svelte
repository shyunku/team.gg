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
    border-radius: 3px;
    cursor: pointer;
    font-size: 13px;
    color: rgb(163, 152, 133);
    padding: 6px 12px;
    box-sizing: border-box;

    &:hover {
      background-color: rgb(53, 49, 41);
    }

    &.selected {
      background-color: rgb(105, 92, 64);
      color: white;
    }

    &:not(:first-child) {
      margin-left: 10px;
    }
  }
</style>
