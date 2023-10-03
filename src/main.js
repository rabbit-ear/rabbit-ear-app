import "./css/reset.css"
import "./css/app.css"
import "./css/svg.css"
import Main from "./components/Main.svelte"
import {
	execute,
	executeCommand,
} from "./kernel/execute.js";

// bind kernel execution methods to the window,
// this is how we call Javascript from Tauri/Rust.
window.execute = execute;
window.executeCommand = executeCommand;

const app = new Main({
	target: document.getElementById("app"),
});

export default app
