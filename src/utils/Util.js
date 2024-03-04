export const moveToPlayerPage = (summonerName, summonerTag) => {
  window.location.href = `#/player/${summonerName}/${summonerTag}`;
};

export const moveToPlayerPageByPuuid = (puuid) => {
  window.location.href = `#/player/${puuid}`;
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

export const formatStd = (num) => {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const calculateGGscore = (
  {
    kills,
    deaths,
    assists,
    totalDamageDealtToChampions,
    totalHealsOnTeammates,
    totalDamageTaken,
    damageDealtToBuildings,
    damageDealtToObjectives,
    damageDealtToTurrets,
    damageSelfMitigated,
    totalTimeCCDealt,
    visionScore,
  },
  gameDuration
) => {
  const kdaScore = deaths == 0 ? 30 : (kills + assists) / deaths;
  const killScore = kills;
  const damageScore = totalDamageDealtToChampions;
  const healScore = totalHealsOnTeammates;
  const objectDealtScore = damageDealtToBuildings + damageDealtToTurrets;
  const tankerScore = totalDamageTaken * 0.5 + damageSelfMitigated;
  const wardScore = visionScore;
  const ccScore = totalTimeCCDealt;

  const kdaCut = 30;
  const killsCut = 30;
  const damageCut = 80000;
  const healCut = 50000;
  const objectCut = 30000;
  const tankerCut = 150000;
  const wardCut = 120;
  const ccCut = 2400;

  const gameDurationFactor = 3600 / gameDuration;

  const kdaPart = kdaScore / kdaCut;
  const killPart = killScore / killsCut;
  const damagePart = damageScore / damageCut;
  const healPart = healScore / healCut;
  const objectPart = objectDealtScore / objectCut;
  const tankerPart = tankerScore / tankerCut;
  const wardPart = wardScore / wardCut;
  const ccPart = ccScore / ccCut;

  const parts = [kdaPart, killPart, damagePart, healPart, objectPart, tankerPart, wardPart, ccPart];

  const totalScore = parts.reduce((acc, cur) => acc + cur, 0);
  const finalScore = (totalScore * gameDurationFactor) / parts.length;

  // return `${parts.map((part) => (part * 100).toFixed(0)).join(",")} ${finalScore.toFixed(2)}`;
  return finalScore * 100;
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
