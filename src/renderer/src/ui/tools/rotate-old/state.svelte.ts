import { distance2, subtract2 } from "rabbit-ear/math/vector.js";
import { clockwiseAngle2 } from "rabbit-ear/math/radial.js";
import type { StateManagerType } from "../../types.ts";
import { snapPoint } from "../../state/snap.temp.svelte.ts";
// import { renderer } from "../../stores/renderer.svelte.ts";

const Effectify = (func: () => void) =>
	$effect.root(() => {
		$effect(func);
		return () => {};
	});

const equivalent = (point1: [number, number], point2: [number, number]) =>
	// todo
	// distance2(point1, point2) < renderer.uiEpsilon * 3
	distance2(point1, point2) < 1e-2;

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

class FixedPoint {
	touches: Touches;

	origin: [number, number] = $state([0, 0]);
	selected: boolean = $state(false);
	highlighted: boolean = $derived.by(() => {
		if (this.touches.snapDrag) {
			return equivalent(this.origin, this.touches.snapDrag);
		}
		if (this.touches.snapMove) {
			return equivalent(this.origin, this.touches.snapMove);
		}
		return false;
	});

	reset() {
		this.selected = false;
		this.touches.reset();
	}

	// set this object's "selected" state.
	// - false: if presses is empty, or, the press was far from the fixed point
	// - true: if presses is not empty and the press was near to the fixed point
	#updateSelected() {
		if (this.selected) {
			if (!this.touches.snapDrag) {
				// console.log("fixed point selected: false");
				this.selected = false;
			}
		} else {
			if (this.touches.snapPress) {
				// console.log("fixed point selected:", equivalent(this.origin, this.touches.snapPress));
				this.selected = equivalent(this.origin, this.touches.snapPress);
			}
		}
	}

	// set this object's "origin" position, only if:
	// "selected" is true if releases or drag is not undefined
	#updatePosition() {
		if (this.selected && this.touches.snapDrag) {
			// console.log("setting origin");
			this.origin = this.touches.snapDrag;
		}
	}

	update() {
		this.#updateSelected();
		this.#updatePosition();
	}

	constructor(touches: Touches) {
		this.touches = touches;
	}
}

class ToolState {
	touches: Touches;
	fixedPoint: FixedPoint;

	// startVector: [number, number] | undefined = $derived.by(() =>
	// 	this.touches.snapPress && !this.fixedPoint.selected
	// 		? subtract2(this.touches.snapPress, this.fixedPoint.origin)
	// 		: undefined);
	startVector: [number, number] | undefined = $derived.by(() =>
		this.touches.snapPress && !this.fixedPoint.selected
			? subtract2(this.touches.snapPress, this.fixedPoint.origin)
			: undefined,
	);

	endVector: [number, number] | undefined = $derived.by(() => {
		if (this.fixedPoint.selected) {
			return undefined;
		}
		if (this.touches.snapRelease) {
			return subtract2(this.touches.snapRelease, this.fixedPoint.origin);
		}
		if (this.touches.snapDrag) {
			return subtract2(this.touches.snapDrag, this.fixedPoint.origin);
		}
		return undefined;
	});

	angle: number = $derived(
		this.startVector && this.endVector
			? clockwiseAngle2(this.startVector, this.endVector)
			: 0,
	);

	showAngleIndicator: boolean = $derived.by(
		() => this.touches.snapPress !== undefined && this.touches.snapRelease === undefined,
	);

	reset() {
		this.fixedPoint.reset();
		this.touches.reset();
	}

	update() {
		const wasSelected = this.fixedPoint.selected;
		this.fixedPoint.update();

		if (
			this.touches.snapPress &&
			this.touches.snapRelease &&
			!wasSelected &&
			!this.fixedPoint.selected
		) {
			console.log("rotate model by", this.angle);
			this.reset();
		}
	}

	constructor(touches: Touches, fixedPoint: FixedPoint) {
		this.touches = touches;
		this.fixedPoint = fixedPoint;
	}
}

class StateWrapper implements StateManagerType {
	touches: Touches | undefined;
	fixedPoint: FixedPoint | undefined;
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.touches = new Touches();
		this.fixedPoint = new FixedPoint(this.touches);
		this.tool = new ToolState(this.touches, this.fixedPoint);
		this.unsub.push(Effectify(() => this.tool?.update()));
	}

	unsubscribe() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
		this.touches = undefined;
		this.fixedPoint = undefined;
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	}
}

export default new StateWrapper();
