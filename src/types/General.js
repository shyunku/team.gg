export const PlayerInfoMenu = {
  total: "종합",
  ingame: "인게임",
  mastery: "숙련도",
};

export const MultiKill = {
  penta: "펜타킬",
  quadra: "쿼드라킬",
  triple: "트리플킬",
  double: "더블킬",
};

export const QueueType = {
  400: "드래프트",
  420: "솔랭",
  430: "일반",
  440: "자랭",
  450: "칼바람",
  490: "빠른 대전",
  700: "격전",
  720: "칼바람 격전",
  900: "U.R.F.", // 올랜덤 URF
  1010: "U.R.F.", // 겨울 테마 URF
  1020: "단일모드",
  1300: "돌격 넥서스",
  1700: "아레나",
  1900: "U.R.F.", // 픽 URF
};

export const QueueTypeKey = {
  ALL: 0,
  DRAFT: 400,
  SOLO_RANK: 420,
  NORMAL: 430,
  FLEX_RANK: 440,
  HOWLING_ABYSS: 450,
  BLIND_PICK: 490,
  CLASH: 700,
  HOWLING_ABYSS_CLASH: 720,
  ALL_RANDOM_URF: 900,
  SNOW_URF: 1010,
  ONE_FOR_ALL: 1020,
  NEXUS_BLITZ: 1300,
  ARENA: 1700,
  PICK_URF: 1900,
};

export const TeamLaneType = {
  TOP: "탑",
  JUNGLE: "정글",
  MIDDLE: "미드",
  BOTTOM: "원딜",
  UTILITY: "서포터",
};

export const TeamPositionType = {
  TOP: "탑",
  JUNGLE: "정글",
  MID: "미드",
  ADC: "바텀",
  SUPPORT: "서포터",
};

export const TeamPositionKeyType = {
  TOP: "TOP",
  JUNGLE: "JUNGLE",
  MID: "MID",
  ADC: "ADC",
  SUPPORT: "SUPPORT",
};

// https://static.developer.riotgames.com/docs/lol/maps.json
export const MapType = {
  11: "소환사의 협곡",
  12: "칼바람 나락",
  21: "돌격 넥서스",
  22: "전략적 팀 전투",
  30: "아레나",
};

export const RankQueueType = {
  SOLO_RANK: "RANKED_SOLO_5x5",
  FLEX_RANK: "RANKED_FLEX_SR",
};

export const TierType = {
  UNRANKED: "언랭",
  IRON: "아이언",
  BRONZE: "브론즈",
  SILVER: "실버",
  GOLD: "골드",
  PLATINUM: "플래티넘",
  EMERALD: "에메랄드",
  DIAMOND: "다이아몬드",
  MASTER: "마스터",
  GRANDMASTER: "그랜드마스터",
  CHALLENGER: "챌린저",
};

export const ValidTierRanks = Object.freeze({
  UNRANKED: [0],
  IRON: [1, 2, 3, 4],
  BRONZE: [1, 2, 3, 4],
  SILVER: [1, 2, 3, 4],
  GOLD: [1, 2, 3, 4],
  PLATINUM: [1, 2, 3, 4],
  EMERALD: [1, 2, 3, 4],
  DIAMOND: [1, 2, 3, 4],
  MASTER: [1],
  GRANDMASTER: [1],
  CHALLENGER: [1],
});
