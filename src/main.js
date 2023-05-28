import "./css/reset.css"
import "./css/app.css"
import "./css/svg.css"
import App from "./components/App.svelte"

const app = new App({
  target: document.getElementById("app"),
});

export default app
