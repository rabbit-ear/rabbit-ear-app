import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import state from "./state.svelte.ts";
import * as events from "./events.ts";

export default <Tool>{
	key: "zoom",
	name: "zoom",
	icon,
	state,
	SVGLayer: undefined,
	panel: undefined,
	...events,
};
