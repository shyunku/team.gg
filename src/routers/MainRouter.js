import Home from "../pages/Home.svelte";
import Player from "../pages/Player.svelte";
import NotFound from "../pages/NotFound.svelte";

const routes = {
  "/": Home,
  "/player": Player,
  "*": NotFound,
};

export default routes;
