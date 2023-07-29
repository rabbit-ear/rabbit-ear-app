import { writable, derived } from "svelte/store";
import { ViewBox } from "./ViewBox.js";

// size

export const StrokeWidth = derived(
	ViewBox,
	($ViewBox) => Math.max($ViewBox[2], $ViewBox[3]) * 0.00333,
	0.00333,
);

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
