import type { StateManagerType } from "../../types.ts";
import { snapPoint } from "../../state/snap.temp.svelte.ts";
import { model } from "../../stores/model.svelte.ts";

class Touches {
	#move: [number, number] | undefined = $state();
	#drag: [number, number] | undefined = $state();
	#press: [number, number] | undefined = $state();
	#release: [number, number] | undefined = $state();

	snapMove: [number, number] | undefined = $state();
	snapDrag: [number, number] | undefined = $state();
	snapPress: [number, number] | undefined = $state();
	snapRelease: [number, number] | undefined = $state();

	get move() {
		return this.#move;
	}
	get drag() {
		return this.#drag;
	}
	get press() {
		return this.#press;
	}
	get release() {
		return this.#release;
	}
	set move(v: [number, number] | undefined) {
		this.#move = v;
		this.snapMove = snapPoint(this.#move).coords;
	}
	set drag(v: [number, number] | undefined) {
		this.#drag = v;
		this.snapDrag = snapPoint(this.#drag).coords;
	}
	set press(v: [number, number] | undefined) {
		this.#press = v;
		this.snapPress = snapPoint(this.#press).coords;
	}
	set release(v: [number, number] | undefined) {
		this.#release = v;
		this.snapRelease = snapPoint(this.#release).coords;
	}

	reset() {
		this.move = undefined;
		this.drag = undefined;
		this.press = undefined;
		this.release = undefined;
	}
}

class ToolState {
	touches: Touches;

	segment: [[number, number], [number, number]] | undefined = $derived.by(() => {
		if (this.touches.snapPress && this.touches.snapRelease) {
			return [this.touches.snapPress, this.touches.snapRelease];
		}
		if (this.touches.snapPress && this.touches.snapDrag) {
			return [this.touches.snapPress, this.touches.snapDrag];
		}
		return undefined;
	});

	svgSegment: { x1: number; y1: number; x2: number; y2: number } | undefined = $derived(
		!this.segment
			? undefined
			: {
					x1: this.segment[0][0],
					y1: this.segment[0][1],
					x2: this.segment[1][0],
					y2: this.segment[1][1],
				},
	);

	reset() {
		this.touches.reset();
	}

	makeSegment() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.touches.snapPress || !this.touches.snapRelease || !this.segment) {
					return;
				}
				const [[x1, y1], [x2, y2]] = this.segment;
				model.addLine(x1, y1, x2, y2);
				this.reset();
			});
			return () => {};
		});
	}

	constructor(touches: Touches) {
		this.touches = touches;
	}
}

class StateWrapper implements StateManagerType {
	touches: Touches | undefined;
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.touches = new Touches();
		this.tool = new ToolState(this.touches);
		this.unsub.push(this.tool.makeSegment());
	}

	unsubscribe() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
		this.touches = undefined;
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	}
}

export default new StateWrapper();
