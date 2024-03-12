<script>
  import ChampionDetailContent from "../organisms/player/champion-statistics-detail/ChampionDetailContent.svelte";
  import ChampionDetailHeader from "../organisms/player/champion-statistics-detail/ChampionDetailHeader.svelte";
  import ChampionDetailMenu from "../organisms/player/champion-statistics-detail/ChampionDetailMenu.svelte";
  import { championIconUrl, getChampionDetailStatisticsReq } from "../thunks/GeneralThunk";
  import "./StatisticsChampionDetail.scss";

  export const ChampionDetailOptions = {
    META: { key: "meta", label: "빌드 및 메타" },
    SKILL: { key: "skill", label: "스킬 설명 (Beta)" },
    COUNTER: { key: "counter", label: "챔피언 상대 (Beta)" },
  };

  export let params = {};

  let data = null;
  let menuKey = ChampionDetailOptions.META.key;

  $: {
    if (params?.championId != null) {
      console.log(">> load champion detail", params.championId);
      loadChampionDetail(params.championId);
    }
  }

  let loadChampionDetail = async (championId) => {
    try {
      let resp = await getChampionDetailStatisticsReq(championId);
      console.log(resp);
      data = resp;
    } catch (e) {
      console.error(e);
    }
  };
</script>

<ChampionDetailHeader {data} />
<ChampionDetailMenu menus={ChampionDetailOptions} bind:menuKey />
<ChampionDetailContent {menuKey} {data} />
