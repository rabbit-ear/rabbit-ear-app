import type { VecLine2 } from "rabbit-ear/types.js";
import { pointsToLine2 } from "rabbit-ear/math/convert.js";
import type { StateManagerType } from "../../types.ts";
import { snapToLine } from "../../js/snap.ts";
import { snapPoint } from "../../state/snap.temp.svelte.ts";
import { model } from "../../stores/model.svelte.ts";

class Touches {
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();
	snapMove = $derived(snapPoint(this.move).coords);
	snapDrag = $derived(snapPoint(this.drag).coords);

	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	snapPresses: [number, number][] = $state([]);
	snapReleases: [number, number][] = $state([]);

	addPress(point: [number, number]) {
		this.presses.push(point);
		this.snapPresses.push(snapPoint(point).coords);
	}

	addRelease(point: [number, number]) {
		this.releases.push(point);
		this.snapReleases.push(snapPoint(point).coords);
	}

	reset() {
		this.move = undefined;
		this.drag = undefined;
		while (this.presses.length) {
			this.presses.pop();
		}
		while (this.releases.length) {
			this.releases.pop();
		}
		while (this.snapPresses.length) {
			this.snapPresses.pop();
		}
		while (this.snapReleases.length) {
			this.snapReleases.pop();
		}
	}
}

class ToolState {
	touches: Touches;

	line: VecLine2 | undefined = $derived.by(() => {
		if (this.touches.snapPresses.length && this.touches.snapReleases.length) {
			return pointsToLine2(this.touches.snapPresses[0], this.touches.snapReleases[0]);
		}
		if (this.touches.snapPresses.length && this.touches.snapDrag) {
			return pointsToLine2(this.touches.snapPresses[0], this.touches.snapDrag);
		}
		return undefined;
	});

	segmentPoints: [number, number][] | undefined = $derived.by(() => {
		if (!this.line) {
			return undefined;
		}
		if (!this.touches.snapPresses.length || !this.touches.snapReleases.length) {
			return undefined;
		}
		const snapLines = [{ line: this.line, clamp: (a: any) => a, domain: () => true }];
		const point1 =
			this.touches.snapPresses.length >= 2
				? snapToLine(this.touches.snapPresses[1], snapLines).coords
				: snapToLine(this.touches.snapMove, snapLines).coords;
		const point2 =
			this.touches.snapReleases.length >= 2
				? snapToLine(this.touches.snapReleases[1], snapLines).coords
				: snapToLine(this.touches.snapDrag, snapLines).coords;
		const result = [];
		if (point1) {
			result.push(point1);
		}
		if (point2) {
			result.push(point2);
		}
		return result;
	});

	segment: [number, number][] | undefined = $derived(
		this.segmentPoints && this.segmentPoints.length < 2 ? undefined : this.segmentPoints,
	);

	reset() {
		this.touches.reset();
	}

	makeLine() {
		return $effect.root(() => {
			$effect(() => {
				if (
					this.touches.snapPresses.length >= 2 &&
					this.touches.snapReleases.length >= 2 &&
					this.segment
				) {
					const [[x1, y1], [x2, y2]] = this.segment;
					model.addLine(x1, y1, x2, y2);
					this.reset();
				}
			});
			return () => {};
		});
	}

	constructor(touches: Touches) {
		this.touches = touches;
	}
}

class StateManager implements StateManagerType {
	touches: Touches | undefined;
	tool: ToolState | undefined;
	unsub: Function[] = [];

	constructor() {}

	subscribe() {
		this.unsubscribe();
		this.touches = new Touches();
		this.tool = new ToolState(this.touches);
		this.unsub.push(this.tool.makeLine());
	}

	unsubscribe() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	}
}

export default new StateManager();
