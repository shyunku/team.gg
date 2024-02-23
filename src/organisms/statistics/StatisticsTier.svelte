<script>
  import SafeImg from "../../atoms/SafeImg.svelte";
  import { getTierStatisticsReq, profileIconUrl } from "../../thunks/GeneralThunk";
  import { RankQueueType } from "../../types/General";
  import JsxUtil from "../../utils/JsxUtil";
  import TierRank from "../../molecules/TierRank.svelte";
  import "./StatisticsTier.scss";

  let rawData = null;
  let refinedData = {};
  let queueData = [];
  let rankType = RankQueueType.SOLO_RANK;
  let totalSummoners = 0;
  let maxSummoners = 0;

  let selectedGroup = null;
  let rankers = null;

  const getTierStatistics = async () => {
    try {
      const resp = await getTierStatisticsReq();
      const { updatedAt, queueGroups } = resp;
      rawData = queueGroups;
      for (let queueGroup of queueGroups) {
        refinedData[queueGroup.queueType] = queueGroup.rankGroups
          .sort((a, b) => b.level - a.level)
          .map((e) => {
            return {
              ...e,
              rankGroups: e.rankGroups
                .sort((a, b) => b.level - a.level)
                .map((r) => {
                  return {
                    ...r,
                    rankers: r.rankers.sort((a, b) => a.ranks - b.ranks),
                  };
                }),
            };
          });
      }
      console.log(queueGroups, refinedData);
    } catch (e) {
      console.error(e);
      toasts.add({
        title: "티어/랭크 통계",
        description: "통계를 불러오는 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  $: {
    if (rawData) {
      queueData = refinedData[rankType];
      totalSummoners = queueData.reduce(
        (acc, cur) => acc + cur.rankGroups.reduce((acc2, cur2) => acc2 + cur2.summoners, 0),
        0
      );
      maxSummoners = queueData.reduce(
        (acc, cur) =>
          Math.max(
            acc,
            cur.rankGroups.reduce((acc2, cur2) => Math.max(acc2, cur2.summoners), 0)
          ),
        0
      );
      if (selectedGroup == null) selectedGroup = queueData[0]?.tier + "-" + queueData[0]?.rankGroups[0]?.rank;
      if (rankers == null) rankers = queueData[0]?.rankGroups[0]?.rankers;
      console.log(queueData, totalSummoners, rankers);
    }
  }

  getTierStatistics();
</script>

<div class="statistics-tier">
  <div class="content card">
    <div class="title">플레이어 통계 (티어 및 랭크)</div>
    <div class="description">해당 지표들은 team.gg에서 검색 또는 추적되는 플레이어들만 해당됩니다.</div>
    <div class="options">
      <div
        class={"option" + JsxUtil.classByEqual(rankType, RankQueueType.SOLO_RANK, "selected")}
        on:click={(e) => {
          rankType = RankQueueType.SOLO_RANK;
          selectedGroup = null;
        }}
      >
        솔로랭크
      </div>
      <div
        class={"option" + JsxUtil.classByEqual(rankType, RankQueueType.FLEX_RANK, "selected")}
        on:click={(e) => {
          rankType = RankQueueType.FLEX_RANK;
          selectedGroup = null;
        }}
      >
        자유랭크
      </div>
    </div>
  </div>
  <div class="tier-content">
    <div class="tier-list card">
      <div class="header">티어 통계 ({totalSummoners ?? 0}명)</div>
      <div class="tiers">
        {#each queueData as q, ind}
          <div class="tier-group">
            {#each q.rankGroups as r}
              {@const groupKey = `${q.tier}-${r.rank}`}
              <div
                class={"rank-group" +
                  JsxUtil.classByCondition(selectedGroup == groupKey, "selected") +
                  JsxUtil.class(q.tier?.toLowerCase())}
                on:click={(e) => {
                  selectedGroup = groupKey;
                  rankers = r.rankers;
                }}
              >
                <div class="ratio-filler">
                  <div class="ratio" style={`width: ${(100 * r.summoners) / maxSummoners}%`}></div>
                </div>
                <div class="tier-rank">
                  <div class="tier">{q.tier}</div>
                  <div class="rank">{r.rank}</div>
                </div>
                <div class="summoner-count">{r.summoners}명</div>
                <div class="summoner-rate">{((100 * r.summoners) / totalSummoners).toFixed(2)}%</div>
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
    <div class="summoner-list card">
      <div class="header">플레이어 순위 (상위 {(rankers ?? []).length}명)</div>
      <div class="summoners">
        {#each rankers ?? [] as r}
          {@const [tier, rank] = selectedGroup.split("-")}
          <div class="summoner">
            <div class="summoner-rank">{r.ranks + 1}위</div>
            <div class="profile-img img">
              <SafeImg src={profileIconUrl(r?.profileIconId)} />
            </div>
            <div class="name-tag">
              <div class="game-name">{r.gameName}</div>
              <div class="tag-line">#{r.tagLine}</div>
            </div>
            <div class="tier-rank-wrapper">
              <TierRank label={rankType === RankQueueType.SOLO_RANK ? "솔랭" : "자랭"} {tier} {rank} />
            </div>
            <div class="league-points">{r.leaguePoints} LP</div>
            <div class="win-lose">
              <div class="wins">{r.wins}승</div>
              <div class="losses">{r.losses}패</div>
            </div>
            <div class="win-rate">{((100 * r.wins) / (r.wins + r.losses)).toFixed(0)}%</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
