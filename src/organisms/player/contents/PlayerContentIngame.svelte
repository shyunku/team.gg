<script>
  import { onDestroy } from "svelte";
  import SafeImg from "../../../atoms/SafeImg.svelte";
  import MainContentLayout from "../../../layouts/MainContentLayout.svelte";
  import { championIconUrl, getIngameInfo } from "../../../thunks/GeneralThunk";
  import { toDuration, toRelativeTime } from "../../../utils/Datetime";
  import "./PlayerContentIngame.scss";
  import { fastInterval } from "../../../utils/Common";
  import { MapType, QueueType } from "../../../types/General";

  export let puuid = null;

  const ingameActive = true; // TODO :: replace to real data
  let data = null;
  let gameDuration = 0;
  let loading = true;
  let t;

  async function loadIngameInfo() {
    try {
      loading = true;
      const res = await getIngameInfo(puuid);
      console.log("ingameInfo", res);
      data = res;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  $: {
    t = fastInterval(() => {
      if (data?.gameStartTime) {
        gameDuration = toDuration(Date.now() - data.gameStartTime);
      }
    }, 1000);
  }

  $: if (puuid) {
    loadIngameInfo();
  }

  onDestroy(() => {
    clearInterval(t);
  });
</script>

<MainContentLayout>
  <div class="content-wrapper">
    {#if loading || data != null}
      <div class="ingame-card active card">
        <div class="header">
          <div class="game-type">{QueueType?.[data?.gameQueueConfigId] ?? "게임모드"}</div>
          <div class="map-name">{MapType?.[data?.mapId] ?? "맵"}</div>
          <div class="game-time">{gameDuration}</div>
        </div>
        <div class="body">
          <div class="team team-1">
            <div class="team-header">
              <div class="team-label">블루 팀</div>
            </div>
            <div class="members">
              {#each data?.team1 ?? [] as m}
                <div class="member">
                  <div class="champion-icon img">
                    <SafeImg src={championIconUrl(m?.championId)} />
                  </div>
                  <div class="summoner-nametag">
                    <div class="summoner-name">{m?.summonerName}</div>
                    <div class="summoner-tag">#KR1</div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          <div class="team team-2">
            <div class="team-header">
              <div class="team-label">레드 팀</div>
            </div>
            <div class="members">
              {#each data?.team2 ?? [] as m}
                <div class="member">
                  <div class="champion-icon img">
                    <SafeImg src={championIconUrl(m?.championId)} />
                  </div>
                  <div class="summoner-nametag">
                    <div class="summoner-name">{m?.summonerName}</div>
                    <div class="summoner-tag">#KR1</div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="ingame-card inactive card">
        <div class="body">현재 게임중이 아닙니다.</div>
      </div>
    {/if}
  </div>
</MainContentLayout>
