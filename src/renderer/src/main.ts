import { mount } from "svelte";
import "./ui/css/app.css";
import "./ui/css/colors.css";
import "./ui/css/svg.css";
import "./interface/index.ts";
import App from "./ui/components/App.svelte";

const app = mount(App, { target: document.getElementById("app")! });

export default app;
