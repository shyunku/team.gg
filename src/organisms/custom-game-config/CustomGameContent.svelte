<script>
  import SafeImg from "../../atoms/SafeImg.svelte";
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import IoIosArrowRoundBack from "svelte-icons/io/IoIosArrowRoundBack.svelte";
  import IoIosArrowRoundForward from "svelte-icons/io/IoIosArrowRoundForward.svelte";
  import IoIosSwap from "svelte-icons/io/IoIosSwap.svelte";
  import IoIosShuffle from "svelte-icons/io/IoIosShuffle.svelte";
  import IoMdClose from "svelte-icons/io/IoMdClose.svelte";
  import "./CustomGameContent.scss";
  import NameTagSearchInput from "../../molecules/NameTagSearchInput.svelte";
  import LinePosition from "../../molecules/LinePosition.svelte";
</script>

<div class="custom-game-content">
  <MainContentLayout>
    <div class="content">
      <div class="teams">
        <div class="team team1 card">
          <div class="header">
            <div class="title">팀 1</div>
            <div class="rating">
              <div class="label">총 레이팅</div>
              <div class="value">1234 LP</div>
            </div>
            <div class="avg-tier">
              <div class="label">평균 티어</div>
              <div class="value">플레티넘 1</div>
            </div>
          </div>
          <div class="body">
            <div class="placeholder">팀에 배정된 후보가 없습니다.</div>
            <div class="summoners">
              {#each Array(5).fill(null) as c}
                <div class="summoner">
                  <div class="profile-icon img">
                    <SafeImg src="https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/588.png" />
                  </div>
                  <div class="name">플레이어 1</div>
                  <div class="tiers">
                    <div class="tier">플레티넘 1</div>
                    <div class="tier">다이아몬드 3</div>
                  </div>
                  <div class="rating">1234 LP</div>
                  <div class="available-lines">
                    <div class="line">
                      <LinePosition position="top" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="jungle" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="mid" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="adc" interactive={true} enabled={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="support" interactive={true} enabled={true} />
                    </div>
                  </div>
                  <div class="most-champions">
                    {#each Array(5).fill(null) as m}
                      <div class="most-champion">
                        <div class="champion-icon img">
                          <SafeImg src="https://ddragon.leagueoflegends.com/cdn/11.16.1/img/champion/Yasuo.png" />
                        </div>
                        <div class="score">139만</div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
        <div class="team team2 card">
          <div class="header">
            <div class="title">팀 2</div>
            <div class="rating">
              <div class="label">총 레이팅</div>
              <div class="value">1234 LP</div>
            </div>
            <div class="avg-tier">
              <div class="label">평균 티어</div>
              <div class="value">플레티넘 1</div>
            </div>
          </div>
          <div class="body">
            <div class="placeholder">팀에 배정된 후보가 없습니다.</div>
            <div class="summoners">
              {#each Array(5).fill(null) as c}
                <div class="summoner">
                  <div class="profile-icon img">
                    <SafeImg src="https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/588.png" />
                  </div>
                  <div class="name">플레이어 1</div>
                  <div class="tiers">
                    <div class="tier">플레티넘 1</div>
                    <div class="tier">다이아몬드 3</div>
                  </div>
                  <div class="rating">1234 LP</div>
                  <div class="available-lines">
                    <div class="line">
                      <LinePosition position="top" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="jungle" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="mid" interactive={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="adc" interactive={true} enabled={true} />
                    </div>
                    <div class="line">
                      <LinePosition position="support" interactive={true} enabled={true} />
                    </div>
                  </div>
                  <div class="most-champions">
                    {#each Array(5).fill(null) as m}
                      <div class="most-champion">
                        <div class="champion-icon img">
                          <SafeImg src="https://ddragon.leagueoflegends.com/cdn/11.16.1/img/champion/Annie.png" />
                        </div>
                        <div class="score">139만</div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      <div class="sub-panels">
        <div class="utility card">
          <div class="header">유틸리티</div>
          <div class="body">
            <div class="options">
              <div class="option">
                <div class="icon"><IoIosArrowRoundBack /></div>
                <div class="text">10명 랜덤 차출</div>
              </div>
              <div class="option">
                <div class="icon"><IoIosArrowRoundForward /></div>
                <div class="text">전부 후보 리스트로 이동</div>
              </div>
              <div class="option">
                <div class="icon"><IoIosSwap /></div>
                <div class="text">팀 바꾸기</div>
              </div>
              <div class="option">
                <div class="icon"><IoIosShuffle /></div>
                <div class="text">팀 섞기</div>
              </div>
              <div class="option">
                <div class="icon"><IoMdClose /></div>
                <div class="text">지정 랭크 초기화</div>
              </div>
            </div>
          </div>
        </div>
        <div class="candidate-list card">
          <div class="header">후보</div>
          <div class="body">
            <div class="searcher">
              <div class="searcher-wrapper">
                <NameTagSearchInput />
              </div>
            </div>
            <div class="candidates">
              {#each Array(10).fill(null) as c}
                <div class="candidate">
                  <div class="profile-icon img">
                    <SafeImg src="https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/588.png" />
                  </div>
                  <div class="name">플레이어 1</div>
                  <div class="tier">플레티넘 1</div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainContentLayout>
</div>
