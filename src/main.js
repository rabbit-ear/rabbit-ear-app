import "./css/reset.css"
import "./css/app.css"
import "./css/svg.css"
import Main from "./components/Main.svelte"

const app = new Main({
  target: document.getElementById("app"),
});

export default app
