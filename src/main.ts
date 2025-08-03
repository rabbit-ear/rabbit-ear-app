import { mount } from "svelte";
import "./system/menu.ts";
// import "./interface/drag.svelte.ts";
import "./interface/keyboard.svelte.ts";
import App from "./ui/components/App.svelte";
import { defaultAppSetup } from "./app/boot.svelte.ts";

const app = mount(App, { target: document.getElementById("app")! });

// all class definitions are agnostic.
// this will initialize a "default" layout
defaultAppSetup();

export default app;
