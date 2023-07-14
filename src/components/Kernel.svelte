<script>
	import {
		pressEvent,
		moveEvent,
		releaseEvent,
	} from "../kernel/pointerEvent.js";
	import { scrollEvent } from "../kernel/scrollEvent.js";
	import {
		keyboardEventDown,
		keyboardEventUp,
	} from "../kernel/keyboardEvent.js";

	// mouse / touchpad
	export const press = (e) => pressEvent(e.detail);
	export const move = (e) => moveEvent(e.detail);
	export const release = (e) => releaseEvent(e.detail);
	export const scroll = (e) => scrollEvent(e.detail);

	// keyboard
	export const keydown = (e) => keyboardEventDown(e);
	export const keyup = (e) => keyboardEventUp(e);
</script>
