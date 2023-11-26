import axios from "axios";

const ServerHost = `http://${APP_SERVER_HOST}:${APP_SERVER_PORT}/v1`;

export const getSummonerInfo = async (summonerName) => {
  const encodedSummonerName = encodeURIComponent(summonerName);
  const response = await axios.get(`${ServerHost}/summoner?summonerName=${encodedSummonerName}`);
  return response.data;
};

export const renewSummonerInfo = async (puuid) => {
  const response = await axios.post(`${ServerHost}/renewSummoner`, {
    puuid: puuid,
  });
  return response.data;
};

export const loadMoreMatches = async (puuid, before) => {
  const response = await axios.post(`${ServerHost}/loadMatches`, {
    puuid: puuid,
    before: before,
  });
  return response.data;
};

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
