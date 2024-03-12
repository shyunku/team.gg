import Home from "../pages/Home.svelte";
import CustomGame from "../pages/CustomGame.svelte";
import CustomGameConfig from "../pages/CustomGameConfig.svelte";
import Player from "../pages/Player.svelte";
import Statistics from "../pages/Statistics.svelte";
import Community from "../pages/Community.svelte";
import InGame from "../pages/InGame.svelte";
import StatisticsChampionDetail from "../pages/StatisticsChampionDetail.svelte";
import NotImplemented from "../pages/NotImplemented.svelte";
import Login from "../pages/Login.svelte";
import Signup from "../pages/Signup.svelte";
import NotFound from "../pages/NotFound.svelte";

const routes = {
  "/": Home,
  "/custom-game": CustomGame,
  "/custom-game/:id": CustomGameConfig,
  "/player/:summonerName/:summonerTag/:menu?": Player,
  "/player/:puuid": Player,
  "/statistics/:menu?": Statistics,
  "/statistics/champion/:championId": StatisticsChampionDetail,
  "/community": NotImplemented,
  "/ingame": InGame,
  "/login": Login,
  "/signup": Signup,
  "*": NotFound,
};

export default routes;
