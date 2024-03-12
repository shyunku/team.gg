import axios from "axios";
import { authStore } from "../stores/AuthStore";
import { toasts } from "svelte-toasts";

const useHttps = APP_SECURE;
const prefix = useHttps ? "https" : "http";

export const ServerHostBase = `${prefix}://${APP_SERVER_HOST}:${APP_SERVER_PORT}`;
const ServerHost = `${ServerHostBase}/v1`;

console.log("ServerHost", ServerHost);

const instance = axios.create({
  baseURL: ServerHost,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error(error);
    // 요청 에러 직전 호출됩니다.
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (error) => {
    const status = error?.response?.status;
    switch (status) {
      case 401:
        authStore.set("authorized", false);
        toasts.warning("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "#/login";
        break;
    }
    return Promise.reject(error);
  }
);

export const login = async (id, encryptedPassword) => {
  const response = await instance.post(`/auth/login`, {
    userId: id,
    encryptedPassword: encryptedPassword,
  });
  return response.data;
};

export const signup = async (id, encryptedPassword) => {
  const response = await instance.post(`/auth/signup`, {
    userId: id,
    encryptedPassword: encryptedPassword,
  });
  return response.data;
};

export const logout = async () => {
  const response = await instance.post(`/auth/logout`);
  return response.data;
};

export const testTokenReq = async () => {
  const response = await instance.get(`/platform/tokenTest`);
  return response.data;
};

export const getSummonerInfoReq = async (gameName = null, tagLine = null) => {
  const encodedGameName = encodeURIComponent(gameName);
  const encodedTagLine = encodeURIComponent(tagLine);
  const response = await instance.get(`/summoner?gameName=${encodedGameName}&tagLine=${encodedTagLine}`);
  return response.data;
};

export const getSummonerInfoByPuuidReq = async (puuid) => {
  const response = await instance.get(`/summoner-by-puuid?puuid=${puuid}`);
  return response.data;
};

export const quickSearchSummonerReq = async (keyword) => {
  const response = await instance.get(`/quickSearch?keyword=${encodeURIComponent(keyword ?? "")}`);
  return response.data;
};

export const renewSummonerInfoReq = async (puuid) => {
  const response = await instance.post(`/renewSummoner`, {
    puuid: puuid,
  });
  return response.data;
};

export const getMatchesReq = async (puuid, queueId) => {
  const response = await instance.get(`/matches?puuid=${puuid}&queueId=${queueId}`);
  return response.data;
};

export const loadMoreMatches = async (puuid, queueId, before) => {
  const response = await instance.post(`/loadMatches`, {
    puuid: puuid,
    queueId: queueId,
    before: before,
  });
  return response.data;
};

export const getIngameInfo = async (puuid) => {
  const response = await instance.get(`/ingame?puuid=${puuid}`);
  return response.data;
};

/* ---------------------- platform ---------------------- */
export const getCustomGameConfigurations = async () => {
  const response = await instance.get(`/platform/custom-game/list`);
  return response.data;
};

export const createCustomGameConfiguration = async (config) => {
  const response = await instance.post(`/platform/custom-game/create`);
  return response.data;
};

export const getCustomGameConfigurationInfo = async (id) => {
  const response = await instance.get(`/platform/custom-game/info?id=${id}`);
  return response.data;
};

export const addCustomGameCandidateReq = async (customGameConfigId, name, tagLine) => {
  const response = await instance.put(`/platform/custom-game/candidate`, {
    customGameConfigId,
    name,
    tagLine,
  });

  return response.data;
};

export const deleteCustomGameCandidateReq = async (customGameConfigId, puuid) => {
  const response = await instance.delete(
    `/platform/custom-game/candidate?customGameConfigId=${customGameConfigId}&puuid=${puuid}`
  );

  return response.data;
};

export const arrangeCustomGameParticipantReq = async (customGameConfigId, puuid, team, position) => {
  const response = await instance.post(`/platform/custom-game/arrange`, {
    customGameConfigId,
    puuid,
    team,
    targetPosition: position,
  });

  return response.data;
};

export const unArrangeCustomGameParticipantReq = async (customGameConfigId, puuid) => {
  const response = await instance.post(`/platform/custom-game/unarrange`, {
    customGameConfigId,
    puuid,
  });

  return response.data;
};

export const setCustomGameCandidateFavorPositionReq = async (customGameConfigId, puuid, position, strength) => {
  const response = await instance.post(`/platform/custom-game/favor-position`, {
    customGameConfigId,
    puuid,
    favorPosition: position,
    strength,
  });

  return response.data;
};

export const setCustomGameCandidateCustomTierRankReq = async (customGameConfigId, puuid, tier, rank) => {
  const response = await instance.post(`/platform/custom-game/custom-tier-rank`, {
    customGameConfigId,
    puuid,
    tier,
    rank,
  });

  return response.data;
};

export const getCustomGameBalanceReq = async (customGameConfigId) => {
  const response = await instance.get(`/platform/custom-game/balance?id=${customGameConfigId}`);
  return response.data;
};

export const findMostBalancedCustomGameReq = async (customGameConfigId, data) => {
  const response = await instance.post(`/platform/custom-game/optimize`, {
    id: customGameConfigId,
    ...data,
  });
  return response.data;
};

export const arrangeAllCandidatesReq = async (customGameConfigId) => {
  const response = await instance.post(`/platform/custom-game/arrange-all`, {
    id: customGameConfigId,
  });
  return response.data;
};

export const unArrangeAllCandidatesReq = async (customGameConfigId) => {
  const response = await instance.post(`/platform/custom-game/unarrange-all`, {
    id: customGameConfigId,
  });
  return response.data;
};

export const swapCustomGameTeamReq = async (customGameConfigId, puuid) => {
  const response = await instance.post(`/platform/custom-game/swap-team`, {
    id: customGameConfigId,
    puuid,
  });
  return response.data;
};

export const shuffleCustomGameTeamReq = async (customGameConfigId) => {
  const response = await instance.post(`/platform/custom-game/shuffle`, {
    id: customGameConfigId,
  });
  return response.data;
};

export const renewCustomGameTeamRankReq = async (customGameConfigId) => {
  const response = await instance.post(`/platform/custom-game/renew-ranks`, {
    id: customGameConfigId,
  });
  return response.data;
};

export const getTierRankByRatingPointReq = async (ratingPoint) => {
  const response = await instance.get(`/platform/custom-game/tier-rank?ratingPoint=${ratingPoint}`);
  return response.data;
};

/* ---------------------- statistics ---------------------- */
export const getChampionStatisticsReq = async () => {
  const response = await instance.get(`/platform/statistics/champion`);
  return response.data;
};

export const getChampionDetailStatisticsReq = async (championId) => {
  const response = await instance.get(`/platform/statistics/champion-detail?championId=${championId}`);
  return response.data;
};

export const getTierStatisticsReq = async () => {
  const response = await instance.get(`/platform/statistics/tier`);
  return response.data;
};

export const getMasteryStatisticsReq = async () => {
  const response = await instance.get(`/platform/statistics/mastery`);
  return response.data;
};

/* ---------------------- links ---------------------- */

export const profileIconUrl = (profileIconId) => {
  return `${ServerHost}/icon/profile?id=${profileIconId}`;
};

export const championIconUrl = (championId) => {
  return `${ServerHost}/icon/champion?key=${championId}`;
};

export const summonerSpellIconUrl = (spellId) => {
  return `${ServerHost}/icon/summonerSpell?id=${spellId}`;
};

export const itemIconUrl = (itemId) => {
  if (itemId == 0) return null;
  return `${ServerHost}/icon/item?id=${itemId}`;
};

export const perkStyleIconUrl = (perkStyleId) => {
  if (perkStyleId == 0) return null;
  return `${ServerHost}/icon/perkStyle?id=${perkStyleId}`;
};
