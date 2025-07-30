import { mount } from "svelte";
import "./system/menu.ts";
import "./interface/drag.svelte.ts";
import "./interface/keyboard.svelte.ts";
import App from "./ui/components/App.svelte";

const app = mount(App, { target: document.getElementById("app")! });

export default app;
