import "./css/reset.css"
import "./css/app.css"
import "./css/svg.css"
import Main from "./components/Main.svelte"
import "./interface.js";

const app = new Main({
	target: document.getElementById("app"),
});

export default app
