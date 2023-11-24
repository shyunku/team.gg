import axios from "axios";

const ServerHost = `http://${APP_SERVER_HOST}:${APP_SERVER_PORT}/v1`;

export const getSummonerInfo = async (summonerName) => {
  const encodedSummonerName = encodeURIComponent(summonerName);
  const response = await axios.get(`${ServerHost}/summoner?summonerName=${encodedSummonerName}`);
  return response.data;
};

export const profileIconUrl = (profileIconId) => {
  return `${ServerHost}/profileIcon?id=${profileIconId}`;
};
