import {
	writable,
	derived,
} from "svelte/store";

// export const Presses = [
// 	writable(undefined),
// 	writable(undefined),
// 	writable(undefined),
// ];
// export const Releases = [
// 	writable(undefined),
// 	writable(undefined),
// 	writable(undefined),
// ];

// export const Point1 = derived(
// 	Presses[0],
// 	($Press) => snapToPoint(point, false),
// 	[]
// );

// export const DrawGraph = derived(
// 	[Point1],
// 	([$coords]) => {
// 		if (coords !== undefined) {
// 			UIGraph.set({ vertices_coords: [coords] });
// 		}
// 	}
// );

// const Preview = derived(
// 	[Presses[0], Presses[1], Releases[0], Releases[1]],
// 	([]) => {

// 	},
// 	undefined,
// );

// export const ToolStep = derived(
// 	[Presses, Releases],
// 	([$Presses, $Releases]) => {
// 		const pressesCount = $Presses.length;
// 		const releasesCount = $Releases.length;
// 		if (pressesCount === 0) { return 0; }
// 		if (pressesCount === 1 && releasesCount === 0) { return 1; }
// 		if (pressesCount === 1 && releasesCount === 1) { return 2; }
// 		if (pressesCount === 2 && releasesCount === 1) { return 3; }
// 		if (pressesCount === 2 && releasesCount === 2) { return 4; }
// 		if (pressesCount === 3 && releasesCount === 2) { return 5; }
// 		if (pressesCount === 3 && releasesCount === 3) { return 6; }
// 		return Infinity;
// 	},
// 	0,
// );


export const Presses = writable([]);

export const Releases = writable([]);

export const ToolStep = derived(
	[Presses, Releases],
	([$Presses, $Releases]) => {
		const pressesCount = $Presses.length;
		const releasesCount = $Releases.length;
		if (pressesCount === 0) { return 0; }
		if (pressesCount === 1 && releasesCount === 0) { return 1; }
		if (pressesCount === 1 && releasesCount === 1) { return 2; }
		if (pressesCount === 2 && releasesCount === 1) { return 3; }
		if (pressesCount === 2 && releasesCount === 2) { return 4; }
		if (pressesCount === 3 && releasesCount === 2) { return 5; }
		if (pressesCount === 3 && releasesCount === 3) { return 6; }
		return Infinity;
	},
	0,
);
