<script>
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
  import "./PlayerContent.scss";

  export let sr = {};
  export let fr = {};

  let srTierRank = "언랭";
  let srWinRate = 0;
  let srTierImgUrl = null;
  let frTierRank = "언랭";
  let frWinRate = 0;
  let frTierImgUrl = null;

  $: console.log(sr, fr);
  $: {
    if (sr?.tier != null && sr?.rank != null) {
      srTierRank = sr.tier + " " + sr.rank;
    }
    if (sr?.wins != null && sr?.losses != null) {
      srWinRate = sr.wins / (sr.wins + sr.losses);
    }
    if (sr?.tier != null) {
      let tier = sr.tier.toLowerCase();
      tier = tier.charAt(0).toUpperCase() + tier.slice(1);
      srTierImgUrl = `/img/tier/Rank=${tier}.png`;
    }

    if (fr?.tier != null && fr?.rank != null) {
      frTierRank = fr.tier + " " + fr.rank;
    }
    if (fr?.wins != null && fr?.losses != null) {
      frWinRate = fr.wins / (fr.wins + fr.losses);
    }
    if (fr?.tier != null) {
      let tier = fr.tier.toLowerCase();
      tier = tier.charAt(0).toUpperCase() + tier.slice(1);
      frTierImgUrl = `/img/tier/Rank=${tier}.png`;
    }
  }
</script>

<MainContentWrapper>
  <div class="content-wrapper">
    <div class="rank-summary">
      <div class="solo-rank rank card">
        <div class="rank-header header">솔로랭크</div>
        <div class="rank-body">
          <div class="rank-icon img">
            <img src={srTierImgUrl} />
          </div>
          <div class="rank-info">
            <div class="rank-row">
              <div class="rank-tier">{srTierRank}</div>
              <div class="rank-lp">{sr?.lp ?? "0"} LP</div>
            </div>
            <div class="rank-row">
              <div class="rank-win-lose">{sr?.wins ?? "0"}승 {sr?.losses ?? "0"}패</div>
              <div class="rank-win-rate">승률 {(100 * srWinRate).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-rank rank card">
        <div class="rank-header header">자유랭크</div>
        <div class="rank-body">
          <div class="rank-icon img">
            <img src={frTierImgUrl} />
          </div>
          <div class="rank-info">
            <div class="rank-row">
              <div class="rank-tier">{frTierRank}</div>
              <div class="rank-lp">{fr?.lp ?? "0"} LP</div>
            </div>
            <div class="rank-row">
              <div class="rank-win-lose">{fr?.wins ?? "0"}승 {fr?.losses ?? "0"}패</div>
              <div class="rank-win-rate">승률 {(100 * frWinRate).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="recent-players card">
        <div class="header">최근 함께한 소환사</div>
        <div class="body">
          <div class="list-header row">
            <div class="player-name">소환사</div>
            <div class="player-game-count">게임 수</div>
            <div class="player-win-lose">승패</div>
            <div class="player-win-rate">승률</div>
          </div>
          {#each Array(10) as player, i}
            <div class="player row">
              <div class="player-icon">
                <img src="https://via.placeholder.com/20x20" />
              </div>
              <div class="player-name">player name</div>
              <div class="player-game-count">15</div>
              <div class="player-win-lose">10승 5패</div>
              <div class="player-win-rate">67%</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="match-info">
      <div class="match-summary card">
        <div class="header">
          <div class="menu">
            <div class="menu-item selected">전체</div>
            <div class="menu-item">솔로랭크</div>
            <div class="menu-item">자유랭크</div>
          </div>
        </div>
        <div class="body">
          <!-- TODO :: implement summary of recent histories -->
        </div>
      </div>
      <div class="match-history">
        {#each Array(20) as match}
          <div class={"match " + (Math.random() < 0.6 ? "win" : "lose")}>
            <div class="color-flag"></div>
            <div class="header">
              <div class="match-win">
                {Math.random() < 0.6 ? "승리" : "패배"}
              </div>
              <div class="match-type">솔로랭크</div>
              <div class="match-date">2021-01-01</div>
              <div class="match-duration">24분 49초</div>
            </div>
            <div class="body">
              <div class="champion-item-section">
                <div class="champion-section">
                  <div class="champion-icon">
                    <img src="https://via.placeholder.com/50x50" />
                  </div>
                  <div class="spell-section">
                    <div class="spell-icon">
                      <img src="https://via.placeholder.com/23x23" />
                    </div>
                    <div class="spell-icon">
                      <img src="https://via.placeholder.com/23x23" />
                    </div>
                  </div>
                  <div class="rune-section">
                    <div class="rune-icon">
                      <img src="https://via.placeholder.com/23x23" />
                    </div>
                    <div class="rune-icon">
                      <img src="https://via.placeholder.com/23x23" />
                    </div>
                  </div>
                  <div class="kda-section">
                    <div class="kda">18 / 8 / 14</div>
                    <div class="kda-rate">2.25:1 평점</div>
                  </div>
                </div>
                <div class="item-section">
                  {#each Array(7) as item}
                    <div class="item">
                      <img src="https://via.placeholder.com/26x26" />
                    </div>
                  {/each}
                </div>
              </div>
              <div class="ingame-stat-section"></div>
              <div class="ingame-summoners-section">
                <div class="team team-1">
                  {#each Array(5) as teammate}
                    <div class="teammate">
                      <div class="teammate-icon">
                        <img src="https://via.placeholder.com/16x16" />
                      </div>
                      <div class="teammate-name">teammate name</div>
                    </div>
                  {/each}
                </div>
                <div class="team team-2">
                  {#each Array(5) as teammate}
                    <div class="teammate">
                      <div class="teammate-icon">
                        <img src="https://via.placeholder.com/16x16" />
                      </div>
                      <div class="teammate-name">teammate name</div>
                    </div>
                  {/each}
                </div>
              </div>
              <div class="expand-btn">
                <div class="expand-icon">
                  <img src="https://via.placeholder.com/16x16" />
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</MainContentWrapper>
