import { distance2 } from "rabbit-ear/math/vector.js";
import type { StateManagerType } from "../../types.ts";
import { snapPoint } from "../../state/snap.temp.svelte.ts";
import { model } from "../../stores/model.svelte.ts";

const makeCircle = (
	p0: [number, number],
	p1: [number, number],
): { cx: number; cy: number; r: number } => {
	const [cx, cy] = p0;
	const r = distance2(p0, p1);
	return { cx, cy, r };
};

class ToolState {
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);

	// the above, but snapped to grid
	snapMove = $derived(snapPoint(this.move).coords);
	snapDrag = $derived(snapPoint(this.drag).coords);
	snapPresses = $derived(
		this.presses
			.map(snapPoint)
			.map((el) => el.coords)
			.filter((a) => a !== undefined),
	);
	snapReleases = $derived(
		this.releases
			.map(snapPoint)
			.map((el) => el.coords)
			.filter((a) => a !== undefined),
	);

	circle: { cx: number; cy: number; r: number } | undefined = $derived.by(() => {
		if (this.snapPresses.length && this.snapReleases.length) {
			return makeCircle(this.snapPresses[0], this.snapReleases[0]);
		}
		if (this.snapPresses.length && this.snapDrag) {
			return makeCircle(this.snapPresses[0], this.snapDrag);
		}
		return undefined;
	});

	reset() {
		// console.log("circle reset");
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) {
			this.presses.pop();
		}
		while (this.releases.length) {
			this.releases.pop();
		}
	}

	makeCircle() {
		return $effect.root(() => {
			$effect(() => {
				// console.log("circle (press, release)", this.presses.length, this.releases.length);
				if (!this.snapPresses.length || !this.snapReleases.length || !this.circle) {
					return;
				}
				model.addCircle(this.circle.cx, this.circle.cy, this.circle.r);
				this.reset();
				// setTimeout(this.reset, 10);
			});
			return () => {};
		});
	}
}

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.makeCircle());
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
