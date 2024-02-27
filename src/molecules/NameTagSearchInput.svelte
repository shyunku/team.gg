<script>
  import { onMount, tick } from "svelte";
  import JsxUtil from "../utils/JsxUtil";
  import SafeImg from "../atoms/SafeImg.svelte";
  import "./NameTagSearchInput.scss";
  import { profileIconUrl, quickSearchSummonerReq } from "../thunks/GeneralThunk";

  const defaultTag = "KR1";

  let content = "";
  let width = 0;
  let spanRef;
  let tagPadding = "#" + defaultTag;
  let inputValue = "";
  let focused = false;
  let results = [];

  let inputElement;
  let resultIndex = -1;

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

    quickSearchSummoner();
  };

  const quickSearchSummoner = async () => {
    let keyword = summonerName + (summonerTag != null && summonerTag.length > 0 ? "#" + summonerTag : "");
    try {
      if (keyword.length === 0) {
        results = [];
      } else {
        const resp = await quickSearchSummonerReq(keyword);
        results = resp;
      }
    } catch (err) {
      console.error(err);
      results = [];
    } finally {
      resultIndex = -1;
    }
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") {
      if (resultIndex !== -1) {
        const selected = results[resultIndex];
        onEnterHandler(selected?.gameName, selected?.tagLine);
      } else {
        onEnterHandler(summonerName, summonerTag ?? defaultTag);
      }
    }
    if (e.key === "ArrowDown") {
      resultIndex = Math.min(resultIndex + 1, results.length - 1);
    } else if (e.key === "ArrowUp") {
      resultIndex = Math.max(resultIndex - 1, -1);
    }
  };

  onMount(async () => {
    await tick();
    width = spanRef.offsetWidth;
  });

  $: {
    console.log(resultIndex);
  }

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
    bind:this={inputElement}
    on:keydown={onInputKeyDown}
    on:focus={() => (focused = true)}
    on:blur={() => (focused = false)}
  />
  <div class="tag-padding" style="left: {width}px">{tagPadding}</div>
  <div
    class={"quick-search-results" +
      JsxUtil.classByCondition(focused, "focused") +
      JsxUtil.classByCondition(results.length === 0, "inactive")}
  >
    {#each results as r, ind}
      <div class={"result" + JsxUtil.classByEqual(ind, resultIndex, "selected")}>
        <div class="profile-img img">
          <SafeImg src={profileIconUrl(r?.profileIconId)} />
        </div>
        <div class="summoner-name">
          <div class="name">
            <div class="game-name">{r?.gameName}</div>
            <div class="tag">#{r?.tagLine}</div>
          </div>
          <div class="prev-name">Prev. {r?.name}</div>
        </div>
        <div class="metadata">
          <div class="summoner-level">{r?.summonerLevel} 레벨</div>
        </div>
      </div>
    {/each}
  </div>
</div>
