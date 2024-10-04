import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import state from "./state.svelte.ts";
import * as events from "./events.ts";

export default <Tool>{
	key: "translate",
	name: "translate",
	icon,
	state,
	SVGLayer,
	panel: undefined,
	...events,
};
