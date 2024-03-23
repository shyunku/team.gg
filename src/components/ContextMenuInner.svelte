<script>
  import JsxUtil from "../utils/JsxUtil";
  import ContextMenu from "./ContextMenu.svelte";

  let { class: className } = $$props;
</script>

<ContextMenu class={"context-menu-inner" + JsxUtil.class(className)}>
  <slot />
</ContextMenu>

<style lang="scss">
  .context-menu-inner {
    z-index: 1002;
  }
</style>
