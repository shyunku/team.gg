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

  const onContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    x = e.clientX;
    y = e.clientY;

    const target = document.getElementById(id);
    const menus = target.getElementsByClassName("context-menu");
    for (let menu of menus) {
      menu.style.display = "flex";
      let horizontalReverse = x > window.innerWidth / 2;
      let verticalReverse = y > window.innerHeight / 2;
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

    // hide other context menus
    const contextDivs = document.getElementsByClassName("context-div");
    for (let div of contextDivs) {
      if (div.id !== id) {
        // find context menu
        const menus = div.getElementsByClassName("context-menu");
        for (let menu of menus) {
          menu.style.display = "none";
        }
      }
    }
  };

  const hideMenu = (e) => {
    // check if target is inside the context div
    const target = document.getElementById(id);
    const menus = target.getElementsByClassName("context-menu");
    for (let menu of menus) {
      menu.style.display = "none";
    }
  };

  const hideMenuOnContextMenu = (e) => {
    if (e.target.closest(`#${id}`)) return;
    hideMenu(e);
  };

  onMount(() => {
    window.addEventListener("click", hideMenu);
    window.addEventListener("contextmenu", hideMenuOnContextMenu);
  });

  onDestroy(() => {
    window.removeEventListener("click", hideMenu);
    window.removeEventListener("contextmenu", hideMenuOnContextMenu);
  });
</script>

<div
  {id}
  on:contextmenu={onContextMenu}
  on:dragstart={onDragStart}
  on:dragenter={onDragEnter}
  on:dragend={onDragEnd}
  {...$$restProps}
  class={"context-div" + JsxUtil.class(class_)}
>
  <slot />
</div>
