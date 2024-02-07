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
    background-color: rgba(0, 0, 0, 0.75);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    height: 500px;
    overflow-y: overlay;
  }
</style>
