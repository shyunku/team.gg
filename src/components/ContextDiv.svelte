<script>
  import { onDestroy, onMount } from "svelte";
  import { v4 } from "uuid";
  import JsxUtil from "../utils/JsxUtil";

  export let onDragStart;
  export let onDragEnter;
  export let onDragEnd;

  let { class: class_ } = $$props;

  const id = `context_div_${v4()}`;
  let x = 0;
  let y = 0;
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;
  let horizontalReverse = false;
  let verticalReverse = false;
  let menuOpened = false;

  const getRootMenus = (target) =>
    target.querySelectorAll(".context-menu:not(.context-menu-inner)");

  const positionMenu = () => {
    if (!menuOpened) return;

    const target = document.getElementById(id);
    if (!target) return;

    const targetRect = target.getBoundingClientRect();
    x = targetRect.left + pointerOffsetX;
    y = targetRect.top + pointerOffsetY;

    for (let menu of getRootMenus(target)) {
      if (horizontalReverse) {
        menu.style.left = "auto";
        menu.style.right = `${window.innerWidth - x}px`;
      } else {
        menu.style.left = `${x}px`;
        menu.style.right = "auto";
      }

      if (verticalReverse) {
        menu.style.top = "auto";
        menu.style.bottom = `${window.innerHeight - y}px`;
      } else {
        menu.style.top = `${y}px`;
        menu.style.bottom = "auto";
      }
    }
  };

  const onContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = document.getElementById(id);
    const targetRect = target.getBoundingClientRect();
    pointerOffsetX = e.clientX - targetRect.left;
    pointerOffsetY = e.clientY - targetRect.top;
    horizontalReverse = e.clientX > window.innerWidth / 2;
    verticalReverse = e.clientY > window.innerHeight / 2;
    menuOpened = true;
    window.dispatchEvent(new CustomEvent("teamgg-context-menu-open", { detail: id }));

    for (let menu of getRootMenus(target)) {
      menu.style.display = "flex";
    }
    positionMenu();

  };

  const hideMenu = (e) => {
    // check if target is inside the context div
    const target = document.getElementById(id);
    if (!target) return;
    menuOpened = false;
    const menus = target.querySelectorAll(".context-menu:not(.context-menu-inner)");
    for (let menu of menus) {
      menu.style.display = "none";
    }
  };

  const hideMenuOnContextMenu = (e) => {
    if (e.target.closest(`#${id}`)) return;
    hideMenu(e);
  };

  const hideOtherMenu = (e) => {
    if (e.detail !== id) hideMenu(e);
  };

  onMount(() => {
    window.addEventListener("click", hideMenu);
    window.addEventListener("contextmenu", hideMenuOnContextMenu);
    window.addEventListener("scroll", positionMenu, true);
    window.addEventListener("resize", positionMenu);
    window.addEventListener("teamgg-context-menu-open", hideOtherMenu);
  });

  onDestroy(() => {
    window.removeEventListener("click", hideMenu);
    window.removeEventListener("contextmenu", hideMenuOnContextMenu);
    window.removeEventListener("scroll", positionMenu, true);
    window.removeEventListener("resize", positionMenu);
    window.removeEventListener("teamgg-context-menu-open", hideOtherMenu);
  });

  $: {
    let { class: className } = $$props;
    class_ = className;
  }
</script>

<div
  {id}
  on:contextmenu={onContextMenu}
  on:dragstart={onDragStart}
  on:dragenter={onDragEnter}
  on:dragend={onDragEnd}
  {...$$restProps}
  class={"context-div" + JsxUtil.class(class_)}
  class:context-menu-open={menuOpened}
>
  <slot />
</div>
