import { writable, derived } from "svelte/store";
import { ViewBox } from "./ViewBox.js";

// size

const StrokeWidthFactor = (1 / 300);

export const StrokeWidth = derived(
	ViewBox,
	($ViewBox) => Math.max($ViewBox[2], $ViewBox[3]) * StrokeWidthFactor,
	StrokeWidthFactor,
);

const CSSViewboxVariables = derived(
	ViewBox,
	($ViewBox) => {
		const max = Math.max($ViewBox[2], $ViewBox[3]);
		document.documentElement.style.setProperty("--viewbox-vmax", max);
		document.documentElement.style.setProperty("--stroke-dash-length", max * 0.01);
		document.documentElement.style.setProperty("--anim-stroke-dash-max", max * 5);
	},
	undefined,
);
CSSViewboxVariables.subscribe(() => {});

// const StrokeDashAnimation = derived(
// 	ViewBox,
// 	$ViewBox => document.documentElement.style
// 		.setProperty("--stroke-dash-max", Math.max($ViewBox[2], $ViewBox[3]) * 5),
// 	undefined
// );
// StrokeDashAnimation.subscribe(() => {});

//
// show/hide things
//

// highlight vertices/faces under the cursor
export const ShowTouches = writable(false);

// turn on three.js shadows
export const ShowShadows = writable(false);

// show model faces
export const ShowFront = writable(true);
export const ShowBack = writable(true);

// show/hide lines by assignment
export const ShowBoundary = writable(true);
export const ShowMountain = writable(true);
export const ShowValley = writable(true);
export const ShowFlat = writable(true);
export const ShowJoin = writable(false);
export const ShowUnassigned = writable(true);
// cut is not used by origami simulator
export const ShowCut = writable(true);

//
// colors
//

// the background of the WebGL canvas
export const BackgroundColor = writable("#2a2a2a");

// front and back are the mesh faces
export const FrontColor = writable("#333");
export const BackColor = writable("#1133a1");

// line color by assignment
export const LineOpacity = writable(1);
export const BoundaryColor = writable("#888");
export const MountainColor = writable("#e53");
export const ValleyColor = writable("#08f");
export const FlatColor = writable("#555");
export const JoinColor = writable("#f80");
export const UnassignedColor = writable("#80f");
// cut is not used by origami simulator, used elsewhere.
export const CutColor = writable("#8f0");

export const AssignmentColor = derived(
	[BoundaryColor, MountainColor, ValleyColor, FlatColor, JoinColor, CutColor, UnassignedColor],
	([$BoundaryColor, $MountainColor, $ValleyColor, $FlatColor, $JoinColor, $CutColor, $UnassignedColor]) => ({
		B: $BoundaryColor,
		b: $BoundaryColor,
		M: $MountainColor,
		m: $MountainColor,
		V: $ValleyColor,
		v: $ValleyColor,
		F: $FlatColor,
		f: $FlatColor,
		J: $JoinColor,
		j: $JoinColor,
		C: $CutColor,
		c: $CutColor,
		U: $UnassignedColor,
		u: $UnassignedColor,
	}),
	{},
);
