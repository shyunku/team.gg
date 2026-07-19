<script>
  import { v4 } from "uuid";
  const id = `context_menu_${v4()}`;

  export let className = "";
</script>

<div {id} class={"context-menu " + (className ?? "")} {...$$restProps}>
  <slot />
</div>

<style lang="scss">
  .context-menu {
    position: fixed;
    z-index: 1000;
    display: none;
    flex-direction: column;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background-color: rgba(17, 27, 51, 0.96);
    box-shadow: var(--shadow-card);
    backdrop-filter: blur(12px);
    // height: 500px;
    // overflow-y: overlay;
    cursor: initial;
  }

  .context-menu-inner {
    position: fixed;
    z-index: 1001;
    display: none;
    flex-direction: column;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background-color: rgba(17, 27, 51, 0.96);
    box-shadow: var(--shadow-card);
    backdrop-filter: blur(12px);
  }
</style>
