import {
	writable,
	derived,
} from "svelte/store";
import {
	ViewportCP,
	ViewportFolded,
} from "./ViewBox.js";
/**
 * @description Buggy Safari SVG graphics led to this ability to artificially
 * scale up the canvas without the user knowing about it, especially in the
 * case of 1x1 graphs. Safari has a hard limit of 0.001 for stroke width for
 * example, the viewBox has a zoom limit. This is a work around for that.
 */
export const ArtificialScale = 1;
/**
 * @description Stroke-width will use this value and multiply it against
 * the viewport to get the absolute stroke-width value.
 */
const StrokeWidthFactor = (1 / 300);
/**
 * @description On Safari only, no matter the viewBox size,
 * if a stroke width is below 0.001 it disappears, even if the viewBox
 * is highly zoomed-in and 0.001 is a very thick line, it still disappears.
 * It feels like a bug. But, we have to work around it.
 */
const StrokeWidthMin = 0.001;
/**
 * @description Stroke-width is zoom-level dependent, styles everywhere
 * can reference this value to use inside the app. Because this gets
 * recalculated 120fps when the user zooms or pans, it's best to set
 * this property as low in the DOM heirarchy, nearest to the elements
 * as possible; as it turns out, browsers have a habbit of re-calculating
 * styles on every child element, causing a redraw, causing a huge slow down
 * if this is placed on a root element with many children.
 */
export const StrokeWidthCreasePattern = derived(
	ViewportCP,
	($ViewportCP) => (
		Math.max(
			StrokeWidthMin,
			Math.max($ViewportCP[2], $ViewportCP[3]) * StrokeWidthFactor,
		) / ArtificialScale
	),
	StrokeWidthFactor,
);
export const StrokeWidthFoldedForm = derived(
	ViewportFolded,
	($ViewportFolded) => (
		Math.max(
			StrokeWidthMin,
			Math.max($ViewportFolded[2], $ViewportFolded[3]) * StrokeWidthFactor,
		) / ArtificialScale
	),
	StrokeWidthFactor,
);
/**
 * @description Stroke-dasharray is zoom-level dependent, styles everywhere
 * can reference this value to use inside the app. Because this gets
 * recalculated 120fps when the user zooms or pans, it's best to set
 * this property as low in the DOM heirarchy, nearest to the elements
 * as possible; as it turns out, browsers have a habbit of re-calculating
 * styles on every child element, causing a redraw, causing a huge slow down
 * if this is placed on a root element with many children.
 */
export const StrokeDashLengthCreasePattern = derived(
	StrokeWidthCreasePattern,
	($StrokeWidthCreasePattern) => ($StrokeWidthCreasePattern * 3) / ArtificialScale,
	StrokeWidthFactor * 3,
);
export const StrokeDashLengthFoldedForm = derived(
	StrokeWidthFoldedForm,
	($StrokeWidthFoldedForm) => ($StrokeWidthFoldedForm * 3) / ArtificialScale,
	StrokeWidthFactor * 3,
);
/**
 * @description vertex radius is is dynamic according to the zoom level
 * this number is a scale of the size of the viewbox.
 */
export const VertexRadiusFactor = writable(0.00666);

/**
 * @description SVG circle elements use this for their radius value.
 */
export const VertexRadius = derived(
	[ViewportCP, VertexRadiusFactor],
	([$ViewportCP, $VertexRadiusFactor]) => (
		Math.max($ViewportCP[2], $ViewportCP[3]) * $VertexRadiusFactor
	) / ArtificialScale,
	0.00666,
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
// Styles for origami simulator
//

// the background of the WebGL canvas
export const BackgroundColor = writable("#231f1f");

// front and back are the mesh faces
export const FrontColor = writable("#272222");
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
