import { subtract2 } from "rabbit-ear/math/vector.js";
import type { StateManagerType } from "../../types.ts";
import { snapPoint } from "../../state/snap.temp.svelte.ts";
import execute from "./execute.ts";

class ToolState {
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	// the above, but snapped to grid
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
	snapMove = $derived(snapPoint(this.move).coords);
	snapDrag = $derived(snapPoint(this.drag).coords);

	vector: [number, number] | undefined = $derived.by(() => {
		if (this.presses.length && this.releases.length) {
			return subtract2(this.releases[0], this.presses[0]);
		}
		if (this.presses.length && this.drag) {
			return subtract2(this.drag, this.presses[0]);
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

	doTransform() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.snapPresses.length || !this.snapReleases.length) {
					return;
				}
				if (this.vector) {
					execute(this.vector);
				}
				this.reset();
			});
			return () => {};
		});
	}
}

class StateWrapper implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.doTransform());
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

export default new StateWrapper();
