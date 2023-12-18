import axios from "axios";

const ServerHost = `http://${APP_SERVER_HOST}:${APP_SERVER_PORT}/v1`;

const instance = axios.create({
  baseURL: ServerHost,
  timeout: 3000,
  withCredentials: true,
});

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

export const getSummonerInfo = async (gameName = null, tagLine = null) => {
  const encodedGameName = encodeURIComponent(gameName);
  const encodedTagLine = encodeURIComponent(tagLine);
  const response = await instance.get(`/summoner?gameName=${encodedGameName}&tagLine=${encodedTagLine}`);
  return response.data;
};

export const renewSummonerInfo = async (puuid) => {
  const response = await instance.post(`/renewSummoner`, {
    puuid: puuid,
  });
  return response.data;
};

export const loadMoreMatches = async (puuid, before) => {
  const response = await instance.post(`/loadMatches`, {
    puuid: puuid,
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
  return `${ServerHost}/icon/item?id=${itemId}`;
};

export const perkStyleIconUrl = (perkStyleId) => {
  return `${ServerHost}/icon/perkStyle?id=${perkStyleId}`;
};
