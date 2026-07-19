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
    background: linear-gradient(110deg, $color-surface, rgba(16, 24, 54, 0.94));
    border-bottom: 1px solid $sub-border-color;
  }
</style>
