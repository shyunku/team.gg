<script>
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import "./CustomGameSummary.scss";
  import DoughnutRateChart from "../../molecules/DoughnutRateChart.svelte";
  import { bgColorByRate, formatStdEn } from "../../utils/Util";
  import { socketStore } from "../../stores/SocketStore";
  import { findMostBalancedCustomGameReq } from "../../thunks/GeneralThunk";
  import { toasts } from "svelte-toasts";
  import RangeSlider from "svelte-range-slider-pips";

  export let balance;
  export let team1TotalRatingPoint;
  export let team2TotalRatingPoint;
  export let fetchAllData;
  export let socketConnected;
  export let configId;
  export let dataIndex;
  export let weights;

  let rpDifference = 0;
  let rpDifferenceRate = 0;
  let fairness = 0;
  let lineFairness = 0;
  let teamFairness = 0;
  let lineSatisfaction = 0;
  let calculatingOptimization = false;
  let processType = null;
  let processRate = 0;
  let processCurrent = 0;
  let processTotal = 0;
  let initializedWeightConfigId = null;
  let scoreWeights = {
    team: 40,
    line: 20,
    satisfaction: 40,
  };

  const resetScoreWeights = () => {
    scoreWeights = { team: 40, line: 20, satisfaction: 40 };
  };

  const updateScoreWeight = (key, value) => {
    const nextValue = Math.max(5, Math.min(90, value));
    const otherKeys = Object.keys(scoreWeights).filter((otherKey) => otherKey !== key);
    const previousOtherTotal = otherKeys.reduce((total, otherKey) => total + scoreWeights[otherKey], 0);
    const nextOtherTotal = 100 - nextValue;
    const nextWeights = { ...scoreWeights, [key]: nextValue };

    otherKeys.forEach((otherKey) => {
      nextWeights[otherKey] =
        previousOtherTotal === 0
          ? nextOtherTotal / otherKeys.length
          : (scoreWeights[otherKey] * nextOtherTotal) / previousOtherTotal;
    });
    scoreWeights = nextWeights;
  };

  const findMostBalancedCombination = async () => {
    try {
      calculatingOptimization = true;
      await findMostBalancedCustomGameReq(configId, {
        tierFairnessWeight: scoreWeights.team / 100,
        lineFairnessWeight: scoreWeights.line / 100,
        lineSatisfactionWeight: scoreWeights.satisfaction / 100,
      });
      await fetchAllData();
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
      processCurrent = 0;
      processTotal = 0;
    }
  };

  $: if (balance) {
    fairness = balance?.fairness ?? 0;
    lineFairness = balance?.lineFairness ?? 0;
    teamFairness = balance?.tierFairness ?? 0;
    lineSatisfaction = balance?.lineSatisfaction ?? 0;
  }

  $: if (weights != null && initializedWeightConfigId !== configId) {
    scoreWeights = {
      team: (weights.tierFairness ?? 0.4) * 100,
      line: (weights.lineFairness ?? 0.2) * 100,
      satisfaction: (weights.lineSatisfaction ?? 0.4) * 100,
    };
    initializedWeightConfigId = configId;
  }

  $: if (team1TotalRatingPoint != null && team2TotalRatingPoint != null) {
    const maximumRatingPoint = Math.max(team1TotalRatingPoint, team2TotalRatingPoint);
    rpDifference = Math.abs(team1TotalRatingPoint - team2TotalRatingPoint);
    rpDifferenceRate = maximumRatingPoint === 0 ? 0 : rpDifference / maximumRatingPoint;
  }

  $: if (socketConnected != null) {
    const onOptimizeProcess = (data) => {
      try {
        const { type, progress, total, current } = data;
        processType = type;
        processRate = progress;
        processTotal = total;
        processCurrent = current;
        calculatingOptimization = true;
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
                <DoughnutRateChart rate={processRate} cutout={28} color={"rgb(209, 160, 68)"} />
              </div>
            {:else}
              <div class="label">최적의 조합</div>
              <div class="progress-bar">
                <DoughnutRateChart rate={0} cutout={28} color={"rgb(209, 160, 68)"} />
              </div>
            {/if}
          </div>
          <div class="current-process">
            {#if calculatingOptimization && processType != null}
              {`${formatStdEn(processCurrent)}/${formatStdEn(processTotal)}`}
            {:else}
              조합 대기 중
            {/if}
          </div>
          <button class="find-optimized" disabled={calculatingOptimization} on:click={findMostBalancedCombination}>
            {calculatingOptimization ? "계산 중" : "최적의 조합 찾기"}
          </button>
        </div>
        <div class="options">
          <div class="options-header">
            <span>밸런스 가중치</span>
            <button on:click={resetScoreWeights} disabled={calculatingOptimization}>기본값</button>
          </div>
          <div class="option">
            <div class="label">팀 밸런스</div>
            <div class="slider">
              <RangeSlider
                min={5}
                max={90}
                range={"min"}
                values={[scoreWeights.team]}
                step={1}
                disabled={calculatingOptimization}
                on:change={(event) => updateScoreWeight("team", event.detail.value)}
              />
            </div>
            <div class="value">{scoreWeights.team.toFixed(0)}%</div>
          </div>
          <div class="option">
            <div class="label">라인 밸런스</div>
            <div class="slider">
              <RangeSlider
                min={5}
                max={90}
                range={"min"}
                values={[scoreWeights.line]}
                step={1}
                disabled={calculatingOptimization}
                on:change={(event) => updateScoreWeight("line", event.detail.value)}
              />
            </div>
            <div class="value">{scoreWeights.line.toFixed(0)}%</div>
          </div>
          <div class="option">
            <div class="label">라인 선호도</div>
            <div class="slider">
              <RangeSlider
                min={5}
                max={90}
                range={"min"}
                values={[scoreWeights.satisfaction]}
                step={1}
                disabled={calculatingOptimization}
                on:change={(event) => updateScoreWeight("satisfaction", event.detail.value)}
              />
            </div>
            <div class="value">{scoreWeights.satisfaction.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div class="stats">
        <div class="stat highlight" style={`background-color: ${bgColorByRate(fairness)};`}>
          <div class="label">총 밸런스</div>
          <div class="chart"><DoughnutRateChart rate={fairness} /></div>
        </div>
        <div class="stat">
          <div class="label">팀 전력 균형</div>
          <div class="chart"><DoughnutRateChart rate={teamFairness} /></div>
        </div>
        <div class="stat">
          <div class="label">라인별 전력 균형</div>
          <div class="chart"><DoughnutRateChart rate={lineFairness} /></div>
        </div>
        <div class="stat">
          <div class="label">라인 만족도</div>
          <div class="chart"><DoughnutRateChart rate={lineSatisfaction} /></div>
        </div>
        <div class="stat">
          <div class="label">LP 차이</div>
          <div class="chart">
            <DoughnutRateChart rate={rpDifferenceRate} text={formatStdEn(rpDifference)} reversed={true} />
          </div>
        </div>
      </div>
    </div>
  </MainContentLayout>
</div>
