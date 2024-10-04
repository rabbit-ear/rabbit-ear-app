import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { StateManagerType } from "../../types.ts";
import { model } from "../../stores/model.svelte.ts";
import { snapPoint } from "../../state/snap.temp.svelte.ts";

type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

const makeRect = (p0: [number, number], p1: [number, number]): Rect | undefined => {
	const box = boundingBox([p0, p1]);
	if (!box || !box.span) {
		return undefined;
	}
	const { span, min } = box;
	return { x: min[0], y: min[1], width: span[0], height: span[1] };
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

	rect: Rect | undefined = $derived.by(() => {
		if (this.snapPresses.length && this.snapReleases.length) {
			return makeRect(this.snapPresses[0], this.snapReleases[0]);
		}
		if (this.snapPresses.length && this.snapDrag) {
			return makeRect(this.snapPresses[0], this.snapDrag);
		}
		return undefined;
	});

	reset() {
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

	makeRect() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.snapPresses.length || !this.snapReleases.length || !this.rect) {
					return;
				}
				model.addRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
				this.reset();
				// setTimeout(this.reset, 0);
			});
			return () => {};
		});
	}
}

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	constructor() {}

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.makeRect());
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
