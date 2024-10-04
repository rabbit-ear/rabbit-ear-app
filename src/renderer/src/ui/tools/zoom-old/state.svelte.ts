import { subtract2 } from "rabbit-ear/math/vector.js";
import type { StateManagerType } from "../../types.ts";
import type { SVGViewport } from "../../stores/viewport.svelte.ts";
import { panCameraMatrix } from "./matrix.ts";

class ToolState {
	press: [number, number] | undefined = $state();
	// release: [number, number] | undefined = $state();
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	viewport: SVGViewport | undefined = $state();

	dragVector: [number, number] = $derived(!this.drag || !this.press
		? [0, 0]
		: subtract2(this.drag, this.press));

	reset() {
		this.move = undefined;
		this.drag = undefined;
		this.press = undefined;
		// this.release = undefined;
		this.viewport = undefined;
	}

	doPan() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.dragVector) { return; }
				const translation: [number, number] = [
					this.dragVector[0],
					this.dragVector[1] * (this.viewport?.view.verticalUp ? -1 : 1),
				];
				if (this.viewport) {
					this.viewport.view.camera = panCameraMatrix(this.viewport.view.camera, translation);
				}
			});
			return () => { };
		});
	}
};

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.doPan());
	}

	unsubscribe() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	};
};

export default (new StateManager());
