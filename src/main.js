import App from "./App.svelte";
import "./styles/reset.scss";
import "./styles/global.scss";
import "./styles/variables.scss";

const app = new App({
  target: document.body,
});

export default app;
