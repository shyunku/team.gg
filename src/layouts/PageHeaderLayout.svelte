<script>
  import JsxUtil from "../utils/JsxUtil";
  import MainContentLayout from "./MainContentLayout.svelte";

  let { class: _class } = $$props;
</script>

<div class={_class + JsxUtil.class("page-header")}>
  <MainContentLayout>
    <slot />
  </MainContentLayout>
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .page-header {
    width: 100%;
    background-color: $sub-bg-color;
    border-bottom: 1px solid $sub-border-color;
  }
</style>
