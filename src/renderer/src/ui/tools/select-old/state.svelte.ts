import { boundingBox } from "rabbit-ear/math/polygon.js";
import { type Box } from "rabbit-ear/types.js";
import type { StateManagerType } from "../../types.ts";
import { model } from "../../stores/model.svelte.ts";

class ToolState {
	press: [number, number] | undefined = $state();
	release: [number, number] | undefined = $state();
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	box: Box | undefined = $derived.by(() => {
		if (!this.press || !this.drag) { return undefined; }
		const points = [
			$state.snapshot(this.press),
			$state.snapshot(this.drag),
		];
		return boundingBox(points);
	});

	rect: any = $derived(this.box && this.box.span
		? {
			x: this.box.min[0],
			y: this.box.min[1],
			width: this.box.span[0],
			height: this.box.span[1],
		} : undefined);

	reset() {
		this.move = undefined;
		this.drag = undefined;
		this.press = undefined;
		this.release = undefined;
	}

	doSelection() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.press || !this.release) { return; }
				const points = [
					$state.snapshot(this.press),
					$state.snapshot(this.release),
				];
				model.selectedInsideRect(this.box);
				console.log("make selection", ...points);
				this.reset();
			});
			return () => { };
		});
	}
};

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	constructor() {}

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.doSelection());
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
