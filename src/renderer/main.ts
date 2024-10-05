import { mount } from "svelte";
import "./css/reset.css";
import "./css/app.css";
import "./interface/index.ts";
import App from "./components/App.svelte";

const app = mount(App, { target: document.getElementById("app")! });

export default app;
