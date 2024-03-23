import { push } from "svelte-spa-router";

export const moveToPlayerPage = (summonerName, summonerTag) => {
  push(`/player/${summonerName}/${summonerTag}`);
  // window.location.href = `#/player/${summonerName}/${summonerTag}`;
};

export const moveToPlayerPageByPuuid = (puuid) => {
  push(`/player/${puuid}`);
  // window.location.href = `#/player/${puuid}`;
};

export const colorByRate = (rate) => {
  if (rate < 0.5) {
    return "rgb(255, 100, 100)";
  } else if (rate < 0.85) {
    return "rgb(213, 193, 104)";
  } else {
    return "rgb(80, 219, 108)";
  }
};

export const bgColorByRate = (rate) => {
  if (rate < 0.5) {
    return "rgb(97, 53, 53)";
  } else if (rate < 0.85) {
    return "rgb(109, 91,13)";
  } else {
    return "rgb(19, 83, 30)";
  }
};

export const formatMasteryPoints = (points) => {
  if (points < 10000) {
    return `${Math.floor(points)}`;
  } else {
    return `${Math.floor(points / 10000)}만`;
  }
};

export const formatTierKr = (tier) => {
  if (tier == null) return "???";
  const lTier = tier.toUpperCase();
  switch (lTier) {
    case "IRON":
      return "아이언";
    case "BRONZE":
      return "브론즈";
    case "SILVER":
      return "실버";
    case "GOLD":
      return "골드";
    case "PLATINUM":
      return "플래티넘";
    case "EMERALD":
      return "에메랄드";
    case "DIAMOND":
      return "다이아몬드";
    case "MASTER":
      return "마스터";
    case "GRANDMASTER":
      return "그랜드마스터";
    case "CHALLENGER":
      return "챌린저";
    default:
      return "언랭";
  }
};

export const formatRankKr = (rank) => {
  switch (rank) {
    case "I":
      return "1";
    case "II":
      return "2";
    case "III":
      return "3";
    case "IV":
      return "4";
    default:
      return "";
  }
};

export const reverseFormatRankKr = (rank) => {
  rank = `${rank}`;
  switch (rank) {
    case "1":
      return "I";
    case "2":
      return "II";
    case "3":
      return "III";
    case "4":
      return "IV";
    default:
      return "";
  }
};

export const formatStdKr = (num) => {
  if (num > 10000 * 10000) {
    return `${Math.floor(num / 100000000)}억`;
  } else if (num > 10000) {
    return `${Math.floor(num / 10000)}만`;
  } else {
    return `${num.toFixed(0)}`;
  }
};

export const formatStdEn = (num) => {
  let divided = 0,
    fixed = 0;
  if (num > 1000 * 1000 * 1000) {
    divided = num / 1000000000;
    fixed = divided < 10 ? 1 : 0;
    return `${divided.toFixed(fixed)}B`;
  } else if (num > 1000 * 1000) {
    divided = num / 1000000;
    fixed = divided < 10 ? 1 : 0;
    return `${divided.toFixed(fixed)}M`;
  } else if (num > 1000) {
    divided = num / 1000;
    fixed = num < 10 ? 1 : 0;
    return `${divided.toFixed(fixed)}K`;
  } else {
    return `${num.toFixed(0)}`;
  }
};

export const formatStd = (num) => {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getRankingRateGrade = (rate) => {
  if (rate < 0.001) {
    return "SSS";
  } else if (rate < 0.01) {
    return "S";
  } else if (rate < 0.05) {
    return "A";
  } else if (rate < 0.1) {
    return "B";
  } else if (rate < 0.2) {
    return "C";
  } else if (rate < 0.4) {
    return "D";
  } else if (rate < 0.7) {
    return "E";
  } else {
    return "F";
  }
};

export const getGGscoreGrade = (score) => {
  if (score < 10) {
    return "F";
  } else if (score < 15) {
    return "E";
  } else if (score < 20) {
    return "D";
  } else if (score < 30) {
    return "C";
  } else if (score < 50) {
    return "B";
  } else if (score < 80) {
    return "A";
  } else if (score < 100) {
    return "S";
  } else {
    return "SSS";
  }
};

export const getMMRscoreGrade = (mmr) => {
  if (mmr < 800) {
    return "F";
  } else if (mmr < 1100) {
    return "E";
  } else if (mmr < 1400) {
    return "D";
  } else if (mmr < 1700) {
    return "C";
  } else if (mmr < 2000) {
    return "B";
  } else if (mmr < 2300) {
    return "A";
  } else if (mmr < 2600) {
    return "S";
  } else {
    return "SSS";
  }
};

export const championWinRateGrade = (rate) => {
  if (rate < 0.45) {
    return "F";
  } else if (rate < 0.47) {
    return "E";
  } else if (rate < 0.49) {
    return "D";
  } else if (rate < 0.5) {
    return "C";
  } else if (rate < 0.52) {
    return "B";
  } else if (rate < 0.55) {
    return "A";
  } else if (rate < 0.6) {
    return "S";
  } else {
    return "SSS";
  }
};

export const sanitizeString = (str, _default = null) => {
  if (str == null) return _default;
  return str.length > 0 ? str : _default;
};

export const formatRate = (rate, fixed, _default = 0) => {
  if (rate == null || typeof rate != "number") return _default.toFixed(fixed);
  return (rate * 100).toFixed(fixed);
};
