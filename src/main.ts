import { mount } from "svelte";
import "./system/menu.ts";
import "./system/drag.ts";
import App from "./ui/components/App.svelte";
import { defaultAppSetup } from "./app/boot.svelte.ts";

const app = mount(App, { target: document.getElementById("app")! });

// the app is agnostic to any kind of setup
// and will initialize in a kind of empty state.
// this will initialize a "default" layout
// (viewports, keybindings, etc..)
defaultAppSetup();

export default app;
