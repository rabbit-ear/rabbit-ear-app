import { mount } from "svelte";

// every css file from ui/css/ directory
import "./ui/css/reset.css";
import "./ui/css/colors.css";
import "./ui/css/app.css";
import "./ui/css/form.css";
import "./ui/css/svg.css";

// all interface methods between main and renderer (back and front end)
import "./interface/index.ts";

// the default entrypoint for Svelte
import App from "./ui/components/App.svelte";

const app = mount(App, { target: document.getElementById("app")! });

export default app;
