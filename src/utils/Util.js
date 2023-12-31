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
