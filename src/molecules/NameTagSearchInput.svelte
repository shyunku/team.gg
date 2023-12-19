<script>
  import { onMount, tick } from "svelte";
  import JsxUtil from "../utils/JsxUtil";

  const defaultTag = "KR1";

  let content = "";
  let width = 0;
  let spanRef;
  let tagPadding = "#" + defaultTag;
  let inputValue = "";

  export let summonerName = "";
  export let summonerTag = "";

  export let onEnter = () => {};

  let onEnterHandler = (...args) => {
    onEnter(...args);
    inputValue = "";
    content = "";
  };

  const changeHandler = (event) => {
    content = event.target.value;
    // change tag padding if value has tag
    tagPadding = "#" + defaultTag;
    if ((content.match(/\#/g) || []).length === 1 && content.startsWith("#")) return;
    if (content.endsWith("#")) {
      tagPadding = "KR1";
    } else if (content.includes("#")) {
      tagPadding = "";
    }

    summonerName = (content.split("#")?.[0] ?? "").trim();
    summonerTag = content.split("#")?.[1]?.trim() ?? null;
  };

  onMount(async () => {
    await tick();
    width = spanRef.offsetWidth;
  });

  $: if (spanRef && content.length >= 0) {
    requestAnimationFrame(() => {
      width = spanRef.offsetWidth;
    });
  }
</script>

<div class={"name-tag-search-input" + JsxUtil.classByCondition(content.length > 0, "unempty")}>
  <div class="placeholder">Riot ID + #태그 검색</div>
  <span id="hide" bind:this={spanRef}>{content}</span>
  <input
    type="text"
    on:input={changeHandler}
    spellcheck="false"
    bind:value={inputValue}
    on:keydown={(e) => {
      if (e.key === "Enter") onEnterHandler(summonerName, summonerTag ?? defaultTag);
    }}
  />
  <div class="tag-padding" style="left: {width}px">{tagPadding}</div>
</div>

<style lang="scss">
  #hide {
    position: absolute;
    opacity: 0;
    z-index: -100;
    white-space: pre;
  }

  .name-tag-search-input {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: text;

    &.unempty {
      .placeholder {
        display: none;
      }

      .tag-padding {
        display: block;
      }
    }

    .placeholder {
      position: absolute;
      color: rgb(67, 67, 67);
      pointer-events: none;
    }

    .tag-padding {
      display: none;
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.3);
      margin-left: 5px;
      pointer-events: none;
    }

    input {
      color: white;
      padding: 0;
      min-width: 1px;
      background-color: transparent;
      border: none;
      width: 100%;
    }
  }
</style>
