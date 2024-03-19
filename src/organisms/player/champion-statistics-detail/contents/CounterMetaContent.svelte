<script>
  import SafeImg from "../../../../atoms/SafeImg.svelte";
  import {
    championIconUrl,
    itemIconUrl,
    perkStyleIconUrl,
    summonerSpellIconUrl,
  } from "../../../../thunks/GeneralThunk";
  import { MetaCategories, TeamLaneType, TeamPositionKeyType, TeamPositionType } from "../../../../types/General";
  import JsxUtil from "../../../../utils/JsxUtil";
  import { championWinRateGrade, formatRate } from "../../../../utils/Util";

  const PerkStatLabel = {
    공격: "statOffenseId",
    방어: "statDefenseId",
    유연: "statFlexId",
  };

  export let metaTree = {};
  export let selectedLane = null;
  export let selectedMeta = null;

  let meta = null;
  let counters = [];

  let selectedMajorSubPerkMap = {};
  let selectedMinorSubPerkMap = {};
  let sortedStatSlots = [];
  let counterGameCount = 0;
  $: {
    meta = metaTree[selectedLane] ?? null;
    let counterMap = meta?.counterMap ?? null;

    if (counterMap != null) {
      counters = Object.values(counterMap).sort((a, b) => b.count - a.count);

      if (selectedMeta == null && counters.length > 0) {
        selectedMeta = counters[0];
      }
      counterGameCount = counters.reduce((acc, e) => acc + e.count, 0);
      selectedMajorSubPerkMap = (selectedMeta?.majorPerkGroup?.subPerks ?? []).reduce((acc, e) => {
        acc[e] = true;
        return acc;
      }, {});
      selectedMinorSubPerkMap = (selectedMeta?.minorPerkGroup?.subPerks ?? []).reduce((acc, e) => {
        acc[e] = true;
        return acc;
      }, {});
      sortedStatSlots = [];
      let selectedStatSlotMap = (selectedMeta?.statSlots ?? []).reduce((acc, e) => {
        acc[e.slotLabel] = e;
        return acc;
      }, {});
      for (const statLabel in PerkStatLabel) {
        let statKey = PerkStatLabel[statLabel];
        const stat = selectedStatSlotMap[statLabel];
        if (stat != null) {
          const newPerks = stat.perks.map((perkId) => ({
            perkId,
            highlight: selectedMeta?.perkExtra?.[statKey] == perkId,
          }));
          sortedStatSlots.push(newPerks);
        }
      }
      console.log(counters?.[0]);
    } else {
      counters = [];
    }
  }
</script>

<div class="meta-list card">
  <div class="header">
    <div class="title">카운터 빌드 ({counters.length}개) - 총 {counterGameCount}게임</div>
  </div>
  <div class="body">
    {#each counters as e}
      {@const items = e?.itemTree ?? []}
      <div
        class={"meta-item" + JsxUtil.classByEqual(selectedMeta.counterChampionId, e?.counterChampionId, "selected")}
        on:click={(e2) => {
          selectedMeta = e;
        }}
      >
        <div class="champion">
          <div class="champion-icon img">
            <SafeImg src={championIconUrl(e?.counterChampionId)} />
          </div>
          <div class="champion-name">{e?.counterChampionName}</div>
        </div>
        <div class="styles">
          <div class="primary-style-icon style img">
            <SafeImg src={perkStyleIconUrl(e?.majorPerkGroup?.perkStyleId)} />
          </div>
          <div class="sub-style-icon style img">
            <SafeImg src={perkStyleIconUrl(e?.minorPerkGroup?.perkStyleId)} />
          </div>
        </div>
        <div class="item-set">
          <div class="item-icon img">
            <SafeImg src={itemIconUrl(items?.[0])} />
          </div>
          <div class="item-icon img">
            <SafeImg src={itemIconUrl(items?.[1])} />
          </div>
        </div>
        <div class="meta-plays">{e?.count} 게임</div>
        <div class={"win-rate rate gg-grade" + JsxUtil.class(`grade-${championWinRateGrade(e?.winRate ?? 0)}`)}>
          {formatRate(e?.winRate, 0)}%
        </div>
      </div>
    {/each}
  </div>
</div>
<div class="meta-detail card">
  <div class="header">
    <div class="title">{selectedMeta?.counterChampionName ?? ""} 대응 메타 상세</div>
  </div>
  <div class="body">
    <div class="perk-style-details">
      <div class="primary-style-detail section">
        {#each selectedMeta?.mainSlots ?? [] as mainSlot}
          <div class="perk-slots">
            {#each mainSlot?.perks ?? [] as perkId}
              <div
                class={"perk-slot img" + JsxUtil.classByCondition(selectedMajorSubPerkMap[perkId] == true, "highlight")}
              >
                <SafeImg src={perkStyleIconUrl(perkId)} />
              </div>
            {/each}
          </div>
        {/each}
      </div>
      <div class="sub-style-detail section">
        {#each selectedMeta?.subSlots ?? [] as subSlot}
          <div class="perk-slots">
            {#each subSlot?.perks ?? [] as perkId}
              <div
                class={"perk-slot img" + JsxUtil.classByCondition(selectedMinorSubPerkMap[perkId] == true, "highlight")}
              >
                <SafeImg src={perkStyleIconUrl(perkId)} />
              </div>
            {/each}
          </div>
        {/each}
      </div>
      <div class="stat-detail section">
        {#each sortedStatSlots ?? [] as statSlots}
          <div class="stat-slots">
            {#each statSlots ?? [] as perk}
              {@const { perkId, highlight } = perk}
              <div class={"stat-slot img" + JsxUtil.classByCondition(highlight, "highlight")}>
                <SafeImg src={perkStyleIconUrl(perkId)} />
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
    <div class="spells spell-set">
      <div class="label">소환사 주문</div>
      <div class="item-list">
        <div class="spell-icon img">
          <SafeImg src={summonerSpellIconUrl(selectedMeta?.summoner1Id)} />
        </div>
        <div class="spell-icon img">
          <SafeImg src={summonerSpellIconUrl(selectedMeta?.summoner2Id)} />
        </div>
      </div>
    </div>
    <div class="sub-items item-set">
      <div class="label">시작 아이템</div>
      <div class="item-list">
        {#each selectedMeta?.startItemTree ?? [] as itemId}
          <div class="item-icon img">
            <SafeImg src={itemIconUrl(itemId)} />
          </div>
        {/each}
      </div>
    </div>
    <div class="sub-items item-set">
      <div class="label">기본 아이템</div>
      <div class="item-list">
        {#each selectedMeta?.basicItemTree ?? [] as itemId}
          <div class="item-icon img">
            <SafeImg src={itemIconUrl(itemId)} />
          </div>
        {/each}
      </div>
    </div>
    <div class="main-items item-set">
      <div class="label">핵심 아이템 빌드</div>
      <div class="item-list">
        {#each selectedMeta?.itemTree ?? [] as itemId}
          <div class="item-icon img">
            <SafeImg src={itemIconUrl(itemId)} />
          </div>
        {/each}
      </div>
    </div>
    <div class="sub-items item-set">
      <div class="label">상황별 아이템 빌드</div>
      <div class="item-list">
        {#each (selectedMeta?.subItemTree ?? []).slice(0, 8) as itemId}
          <div class="item-icon img">
            <SafeImg src={itemIconUrl(itemId)} />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
