import { writable, derived } from "svelte/store";
import { ViewBox } from "./ViewBox.js";
// import { LayerCPTools } from "./App.js";
/**
 * @description Stroke-width is zoom-level dependent, this is the factor
 * (out of 1) which is scaled to the viewbox to get the stroke width.
 */
const StrokeWidthFactor = (1 / 300);

export const StrokeWidth = derived(
	ViewBox,
	($ViewBox) => Math.max($ViewBox[2], $ViewBox[3]) * StrokeWidthFactor,
	StrokeWidthFactor,
);

export const StrokeDashLength = derived(
	StrokeWidth,
	($StrokeWidth) => $StrokeWidth * 3,
	StrokeWidthFactor * 3,
);
/**
 * @description Some SVG styles are zoom-level dependent, and require
 * being updated when the ViewBox changes. Of course, these attributes could
 * be set in Javascript, but some things are much easier to do in CSS,
 * for example, animations like a selection box's dasharray animation.
 */
// export const CSSViewboxVariables = derived(
// 	[ViewBox, LayerCPTools],
// 	([$ViewBox, $LayerCPTools]) => {
// 		// console.log("CSSViewboxVariables");
// 		const max = Math.max($ViewBox[2], $ViewBox[3]);
// 		if ($LayerCPTools) {
// 			// console.log("stroke-dash-length", max * 0.01, $LayerCPTools.style);
// 			// $LayerCPTools.style.setProperty("--stroke-dash-length", max * 0.01);
// 			// $LayerCPTools.style.setProperty("--stroke-width", max * 0.01);
// 			$LayerCPTools.style.setProperty("--viewbox-vmax", max);
// 		}
// 		// document.documentElement.style.setProperty("--viewbox-vmax", max);
// 		// document.documentElement.style.setProperty("--stroke-dash-length", max * 0.01);
// 		// document.documentElement.style.setProperty("--anim-stroke-dash-max", max * 5);
// 	},
// 	undefined,
// );
// export const CSSViewboxVariables = derived(
// 	[ViewBox],
// 	([$ViewBox]) => {
// 		const max = Math.max($ViewBox[2], $ViewBox[3]);
// 		console.log("CSSViewboxVariables", max);
// 		// document.documentElement.style.setProperty("--stroke-dash-length", max * 0.01);
// 		// document.documentElement.style.setProperty("--stroke-width", max * 0.01);
// 		document.documentElement.style.setProperty("--viewbox-vmax", max);
// 		// document.documentElement.style.setProperty("--stroke-dash-length", max * 0.01);
// 		// document.documentElement.style.setProperty("--anim-stroke-dash-max", max * 5);
// 	},
// 	undefined,
// );
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
