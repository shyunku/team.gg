<script>
  import { onDestroy, onMount } from "svelte";
  import JsxUtil from "../utils/JsxUtil";

  export let trackId = null;
  let { class: class_ } = $$props;

  let tracker = null;
  let opened = false;

  const parentOnClick = () => {
    opened = !opened;
    // console.log("clicked");
  };

  onMount(() => {
    if (trackId == null) {
      console.error("trackId is required");
      return;
    }

    // observe the trackId
    // const observer = new MutationObserver((mutations) => {
    //   tracker = document.getElementById(trackId);
    //   if (tracker) {
    //     tracker.addEventListener("click", parentOnClick);
    //     observer.disconnect();

    //     tracker.style.position = "relative";
    //     // console.log("tracker found");
    //   } else {
    //     // console.log("tracker not found");
    //   }
    // });

    // observer.observe(document.body, {
    //   childList: true,
    //   subtree: true,
    // });

    let t = setInterval(() => {
      tracker = document.getElementById(trackId);
      if (tracker) {
        tracker.addEventListener("click", parentOnClick);
        tracker.style.position = "relative";
        console.log("tracker found");
        clearInterval(t);
      } else {
        console.log("tracker not found");
      }
    }, 10);
  });

  onDestroy(() => {
    if (tracker) {
      tracker.removeEventListener("click", parentOnClick);
    }
  });
</script>

<div class={"dropdown" + JsxUtil.class(class_) + JsxUtil.classByCondition(!opened, "disabled")}>
  <slot />
</div>

<style lang="scss">
  .dropdown {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    width: 100%;
    z-index: 10;
    cursor: default;

    &.disabled {
      display: none;
    }
  }
</style>
