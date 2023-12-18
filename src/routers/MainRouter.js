import Home from "../pages/Home.svelte";
import CustomGame from "../pages/CustomGame.svelte";
import CustomGameConfig from "../pages/CustomGameConfig.svelte";
import Player from "../pages/Player.svelte";
import Login from "../pages/Login.svelte";
import Signup from "../pages/Signup.svelte";
import NotFound from "../pages/NotFound.svelte";

const routes = {
  "/": Home,
  "/custom-game": CustomGame,
  "/custom-game/:id": CustomGameConfig,
  "/player/:summonerName/:summonerTag/:menu?": Player,
  "/login": Login,
  "/signup": Signup,
  "*": NotFound,
};

export default routes;
