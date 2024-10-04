import type { StateManagerType } from "../../types.ts";
import { model } from "../../stores/model.svelte.ts";

const makePathD = (points: [number, number][]): string => {
	const start = points[0];
	if (!start) { return ""; }
	const startString = `M${start[0].toFixed(4)} ${start[1].toFixed(4)}`;
	if (points.length < 2) { return startString; }
	return startString + Array.from(Array(points.length - 1))
		.map((_, i) => i + 1)
		.map(i => `L${points[i][0].toFixed(4)} ${points[i][1].toFixed(4)}`)
		.join("");
};

class ToolState {
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	move: [number, number] | undefined = $state();
	drags: [number, number][] = $state([]);

	pathD: string = $derived.by(() => {
		const points: [number, number][] = $state.snapshot(this.drags)
			.map(([p0, p1]) => [p0, p1]);
		return makePathD(points);
	});

	reset() {
		this.move = undefined;
		this.presses = [];
		this.releases = [];
		this.drags = [];
	}

	addToModel() {
		const points: [number, number][] = $state.snapshot(this.drags)
			.map(([p0, p1]) => [p0, p1]);
		// console.log("adding path to model", makePathD(points));
		model.addPath({ d: makePathD(points) });
		this.reset();
	}
};

class StateWrapper implements StateManagerType {
	tool: ToolState | undefined;

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
	}

	unsubscribe() {
		this.reset();
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	};
};

export default (new StateWrapper());
