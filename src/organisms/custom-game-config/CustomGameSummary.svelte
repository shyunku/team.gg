<script>
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import { Pie } from "svelte-chartjs";
  import "chart.js/auto";
  import "./CustomGameSummary.scss";
  import DaughnutChart from "../../molecules/DoughnutRateChart.svelte";
  import { bgColorByRate } from "../../utils/Util";
  import DoughnutRateChart from "../../molecules/DoughnutRateChart.svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { onMount } from "svelte";
  import { socketStore } from "../../stores/SocketStore";
  import { findMostBalancedCustomGameReq } from "../../thunks/GeneralThunk";
  import { toasts } from "svelte-toasts";

  export let balance;

  export let team1TotalRatingPoint;
  export let team2TotalRatingPoint;
  export let fetchAllData;

  export let socketConnected;
  export let configId;
  export let weights;

  export let dataIndex;

  let rpDifference = 0;
  let rpDifferenceRate = 0;

  let fairness = 0;
  let lineFairness = 0;
  let tierFairness = 0;
  let lineSatisfaction = 0;

  let calculatingOptimization = false;

  let defaultWeights = {
    lineFairnessWeight: 33,
    tierFairnessWeight: 33,
    lineSatisfactionWeight: 34,
    topInfluence: 20,
    jungleInfluence: 20,
    midInfluence: 20,
    adcInfluence: 20,
    supportInfluence: 20,
  };

  // weights
  let lineFairnessWeight;
  let tierFairnessWeight;
  let lineSatisfactionWeight;

  let topInfluence;
  let jungleInfluence;
  let midInfluence;
  let adcInfluence;
  let supportInfluence;

  let processType = null;
  let processRate = 0;

  const findMostBalancedCombination = async () => {
    try {
      calculatingOptimization = true;
      await findMostBalancedCustomGameReq(configId, {
        lineFairnessWeight: lineFairnessWeight / 100,
        tierFairnessWeight: tierFairnessWeight / 100,
        lineSatisfactionWeight: lineSatisfactionWeight / 100,
        topInfluenceWeight: topInfluence / 100,
        jungleInfluenceWeight: jungleInfluence / 100,
        midInfluenceWeight: midInfluence / 100,
        adcInfluenceWeight: adcInfluence / 100,
        supportInfluenceWeight: supportInfluence / 100,
      });
      try {
        await fetchAllData();
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      toasts.add({
        title: "최적의 조합 찾기 오류",
        description: "최적의 조합을 찾던 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      calculatingOptimization = false;
      processType = null;
      processRate = 0;
    }
  };

  const initFairnessWeights = () => {
    lineFairnessWeight = defaultWeights.lineFairnessWeight;
    tierFairnessWeight = defaultWeights.tierFairnessWeight;
    lineSatisfactionWeight = 100 - lineFairnessWeight - tierFairnessWeight;
  };

  const initInfluenceWeights = () => {
    topInfluence = defaultWeights.topInfluence;
    jungleInfluence = defaultWeights.jungleInfluence;
    midInfluence = defaultWeights.midInfluence;
    adcInfluence = defaultWeights.adcInfluence;
    supportInfluence = 100 - topInfluence - jungleInfluence - midInfluence - adcInfluence;
  };

  $: if (weights != null) {
    defaultWeights = {
      lineFairnessWeight: (weights?.lineFairness ?? 0.33) * 100,
      tierFairnessWeight: (weights?.tierFairness ?? 0.33) * 100,
      lineSatisfactionWeight: 100 * (1 - (weights?.lineFairness ?? 0.33) - (weights?.tierFairness ?? 0.33)),
      topInfluence: (weights?.topInfluence ?? 0.2) * 100,
      jungleInfluence: (weights?.jungleInfluence ?? 0.2) * 100,
      midInfluence: (weights?.midInfluence ?? 0.2) * 100,
      adcInfluence: (weights?.adcInfluence ?? 0.2) * 100,
      supportInfluence: null,
    };
    defaultWeights.supportInfluence =
      100 -
      defaultWeights.topInfluence -
      defaultWeights.jungleInfluence -
      defaultWeights.midInfluence -
      defaultWeights.adcInfluence;

    initFairnessWeights();
    initInfluenceWeights();
  }

  $: if (balance) {
    fairness = balance?.fairness ?? 0;
    lineFairness = balance?.lineFairness ?? 0;
    tierFairness = balance?.tierFairness ?? 0;
    lineSatisfaction = balance?.lineSatisfaction ?? 0;
  }

  $: if (team1TotalRatingPoint != null && team2TotalRatingPoint != null) {
    rpDifference = Math.abs(team1TotalRatingPoint - team2TotalRatingPoint);
    rpDifferenceRate =
      1 -
      Math.min(team1TotalRatingPoint, team2TotalRatingPoint) / Math.max(team1TotalRatingPoint, team2TotalRatingPoint);
  }

  $: if (socketConnected != null) {
    const onOptimizeProcess = (data) => {
      try {
        const { type, progress } = data;
        processType = type;
        processRate = progress;
        calculatingOptimization = true;
        // console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (socketConnected) {
      socketStore.on("custom_config/optimize_process", onOptimizeProcess);
    } else {
      socketStore.off("custom_config/optimize_process", onOptimizeProcess);
    }
  }

  $: if (dataIndex != null) {
    calculatingOptimization = false;
  }

  initFairnessWeights();
  initInfluenceWeights();
</script>

<div class="custom-game-summary">
  <MainContentLayout>
    <div class="content">
      <div class="controller">
        <div class="process">
          <div class="process-info">
            {#if calculatingOptimization}
              <div class="label">
                {processType != null
                  ? processType === "combinating"
                    ? "조합 수집 중..."
                    : "최적의 조합 계산 중..."
                  : "초기화 중..."}
              </div>
              <div class="progress-bar">
                <DoughnutRateChart rate={processRate} cutout={40} color={"rgb(209, 160, 68)"} />
              </div>
            {:else}
              <div class="label">{"최적의 조합"}</div>
              <div class="progress-bar">
                <DoughnutRateChart rate={0} cutout={40} color={"rgb(209, 160, 68)"} />
              </div>
            {/if}
          </div>
          <button class="find-optimized" disabled={calculatingOptimization} on:click={findMostBalancedCombination}>
            {calculatingOptimization ? "계산 중" : "최적의 조합 찾기"}
          </button>
        </div>
        <div class="options">
          <div class="option-panel">
            <div class="header">
              <div class="label">공정성 가중치 설정</div>
              <button on:click={initFairnessWeights}>초기화</button>
            </div>
            <div class="option">
              <div class="label">라인 공정성 우선</div>
              <div class="slider">
                <RangeSlider
                  min={5}
                  max={80}
                  range={"min"}
                  values={[lineFairnessWeight]}
                  step={0.01}
                  disabled={calculatingOptimization}
                  on:change={(e) => {
                    let remain = 100 - lineFairnessWeight;
                    lineFairnessWeight = e?.detail?.value;
                    let afterRemain = 100 - lineFairnessWeight;

                    tierFairnessWeight = (tierFairnessWeight * afterRemain) / remain;
                    if (isNaN(tierFairnessWeight)) tierFairnessWeight = 5;
                    lineSatisfactionWeight = 100 - lineFairnessWeight - tierFairnessWeight;
                  }}
                />
              </div>
              <div class="value">{lineFairnessWeight.toFixed(0)}%</div>
            </div>
            <div class="option">
              <div class="label">티어 공정성 우선</div>
              <div class="slider">
                <RangeSlider
                  min={5}
                  max={80}
                  range={"min"}
                  values={[tierFairnessWeight]}
                  step={0.01}
                  disabled={calculatingOptimization}
                  on:change={(e) => {
                    let remain = 100 - tierFairnessWeight;
                    tierFairnessWeight = e?.detail?.value;
                    let afterRemain = 100 - tierFairnessWeight;

                    lineFairnessWeight = (lineFairnessWeight * afterRemain) / remain;
                    if (isNaN(lineFairnessWeight)) lineFairnessWeight = 5;
                    lineSatisfactionWeight = 100 - lineFairnessWeight - tierFairnessWeight;
                  }}
                />
              </div>
              <div class="value">{tierFairnessWeight.toFixed(0)}%</div>
            </div>
            <div class="option">
              <div class="label">라인 만족도 우선</div>
              <div class="slider">
                <RangeSlider
                  min={5}
                  max={80}
                  range={"min"}
                  values={[lineSatisfactionWeight]}
                  step={0.01}
                  disabled={calculatingOptimization}
                  on:change={(e) => {
                    let remain = 100 - lineSatisfactionWeight;
                    lineSatisfactionWeight = e?.detail?.value;
                    let afterRemain = 100 - lineSatisfactionWeight;

                    lineFairnessWeight = (lineFairnessWeight * afterRemain) / remain;
                    if (isNaN(lineFairnessWeight)) lineFairnessWeight = 5;
                    tierFairnessWeight = 100 - lineFairnessWeight - lineSatisfactionWeight;
                  }}
                />
              </div>
              <div class="value">{lineSatisfactionWeight.toFixed(0)}%</div>
            </div>
          </div>
          <div class="option-panel">
            <div class="header">
              <div class="label">라인 영향력 설정</div>
              <button on:click={initInfluenceWeights}>초기화</button>
            </div>
            <div class="option">
              <div class="label">탑 영향력</div>
              <div class="slider">
                <RangeSlider
                  min={10}
                  max={40}
                  range={"min"}
                  values={[topInfluence]}
                  step={0.01}
                  disabled={calculatingOptimization}
                  on:change={(e) => {
                    let remain = 100 - topInfluence;
                    topInfluence = e?.detail?.value;
                    let afterRemain = 100 - topInfluence;

                    jungleInfluence = (jungleInfluence * afterRemain) / remain;
                    midInfluence = (midInfluence * afterRemain) / remain;
                    adcInfluence = (adcInfluence * afterRemain) / remain;
                    supportInfluence = 100 - topInfluence - jungleInfluence - midInfluence - adcInfluence;
                  }}
                />
              </div>
              <div class="value">{topInfluence.toFixed(0)}%</div>
            </div>
            <div class="option">
              <div class="label">정글 영향력</div>
              <div class="slider">
                <RangeSlider
                  min={10}
                  max={40}
                  range={"min"}
                  values={[jungleInfluence]}
                  step={0.01}
                  disabled={calculatingOptimization}
                  on:change={(e) => {
                    let remain = 100 - jungleInfluence;
                    jungleInfluence = e?.detail?.value;
                    let afterRemain = 100 - jungleInfluence;

                    topInfluence = (topInfluence * afterRemain) / remain;
                    midInfluence = (midInfluence * afterRemain) / remain;
                    adcInfluence = (adcInfluence * afterRemain) / remain;
                    supportInfluence = 100 - topInfluence - jungleInfluence - midInfluence - adcInfluence;
                  }}
                />
              </div>
              <div class="value">{jungleInfluence.toFixed(0)}%</div>
            </div>
            <div class="option">
              <div class="label">미드 영향력</div>
              <div class="slider">
                <RangeSlider
                  min={10}
                  max={40}
                  range={"min"}
                  values={[midInfluence]}
                  step={0.01}
                  disabled={calculatingOptimization}
                  on:change={(e) => {
                    let remain = 100 - midInfluence;
                    midInfluence = e?.detail?.value;
                    let afterRemain = 100 - midInfluence;

                    topInfluence = (topInfluence * afterRemain) / remain;
                    jungleInfluence = (jungleInfluence * afterRemain) / remain;
                    adcInfluence = (adcInfluence * afterRemain) / remain;
                    supportInfluence = 100 - topInfluence - jungleInfluence - midInfluence - adcInfluence;
                  }}
                />
              </div>
              <div class="value">{midInfluence.toFixed(0)}%</div>
            </div>
            <div class="option">
              <div class="label">원딜 영향력</div>
              <div class="slider">
                <RangeSlider
                  min={10}
                  max={40}
                  range={"min"}
                  values={[adcInfluence]}
                  step={0.01}
                  disabled={calculatingOptimization}
                  on:change={(e) => {
                    let remain = 100 - adcInfluence;
                    adcInfluence = e?.detail?.value;
                    let afterRemain = 100 - adcInfluence;

                    topInfluence = (topInfluence * afterRemain) / remain;
                    jungleInfluence = (jungleInfluence * afterRemain) / remain;
                    midInfluence = (midInfluence * afterRemain) / remain;
                    supportInfluence = 100 - topInfluence - jungleInfluence - midInfluence - adcInfluence;
                  }}
                />
              </div>
              <div class="value">{adcInfluence.toFixed(0)}%</div>
            </div>
            <div class="option">
              <div class="label">서폿 영향력</div>
              <div class="slider">
                <RangeSlider
                  min={10}
                  max={40}
                  range={"min"}
                  values={[supportInfluence]}
                  step={0.01}
                  disabled={calculatingOptimization}
                  on:change={(e) => {
                    let remain = 100 - supportInfluence;
                    supportInfluence = e?.detail?.value;
                    let afterRemain = 100 - supportInfluence;

                    topInfluence = (topInfluence * afterRemain) / remain;
                    jungleInfluence = (jungleInfluence * afterRemain) / remain;
                    midInfluence = (midInfluence * afterRemain) / remain;
                    adcInfluence = 100 - topInfluence - jungleInfluence - midInfluence - supportInfluence;
                  }}
                />
              </div>
              <div class="value">{supportInfluence.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="stats">
        <div class="stat highlight" style={`background-color: ${bgColorByRate(fairness)};`}>
          <div class="label">총 밸런스</div>
          <div class="chart">
            <DaughnutChart rate={fairness} />
          </div>
        </div>
        <div class="stat">
          <div class="label">라인 공정성</div>
          <div class="chart">
            <DaughnutChart rate={lineFairness} />
          </div>
        </div>
        <div class="stat">
          <div class="label">티어 공정성</div>
          <div class="chart">
            <DaughnutChart rate={tierFairness} />
          </div>
        </div>
        <div class="stat">
          <div class="label">라인 만족도</div>
          <div class="chart">
            <DaughnutChart rate={lineSatisfaction} />
          </div>
        </div>
        <div class="stat">
          <div class="label">LP 차이</div>
          <div class="chart">
            <DaughnutChart rate={rpDifferenceRate} text={`${rpDifference}`} reversed={true} />
          </div>
        </div>
      </div>
    </div>
  </MainContentLayout>
</div>
