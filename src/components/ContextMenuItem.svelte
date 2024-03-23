<script>
  import JsxUtil from "../utils/JsxUtil";

  let { class: _class } = $$props;
  let elem = null;
  let hovering = false;

  const onMouseEnter = (e) => {
    hovering = true;
  };

  const onMouseLeave = (e) => {
    hovering = false;
  };

  $: {
    if (elem) {
      if (hovering) {
        const revealing = elem.getElementsByClassName("context-menu-inner");
        for (let menu of revealing) {
          menu.style.display = "flex";

          const parent = elem.offsetParent;

          const x = elem.getBoundingClientRect().left + elem.offsetWidth;
          const y = elem.getBoundingClientRect().top;

          const relX = elem.offsetWidth;
          const relY = elem.getBoundingClientRect().top - parent.getBoundingClientRect().top;
          const botRelY = parent.getBoundingClientRect().bottom - elem.getBoundingClientRect().bottom;

          let horizontalReverse = x > window.innerWidth / 2;
          let verticalReverse = y > window.innerHeight / 2;

          if (horizontalReverse) {
            menu.style.left = "auto";
            menu.style.right = `${relX}px`;
          } else {
            menu.style.left = `${relX}px`;
            menu.style.right = "auto";
          }

          if (verticalReverse) {
            menu.style.top = "auto";
            menu.style.bottom = `${botRelY}px`;
          } else {
            menu.style.top = `${relY}px`;
            menu.style.bottom = "auto";
          }
        }
      } else {
        const revealing = elem.getElementsByClassName("context-menu-inner");
        for (let menu of revealing) {
          menu.style.display = "none";
        }
      }
    }
  }
</script>

<div
  bind:this={elem}
  class={"context-menu-item" + JsxUtil.class(_class)}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <slot />
</div>

<style lang="scss">
  .context-menu-item {
    // position: relative;
  }
</style>
