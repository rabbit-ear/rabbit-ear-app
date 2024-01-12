import {
	writable,
	derived,
} from "svelte/store";
import {
	ViewportCP,
	ViewportFolded,
	ModelViewMatrixFolded,
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
		)
	),
	StrokeWidthFactor,
);
export const StrokeWidthFoldedForm = derived(
	ViewportFolded,
	($ViewportFolded) => (
		Math.max(
			StrokeWidthMin,
			Math.max($ViewportFolded[2], $ViewportFolded[3]) * StrokeWidthFactor,
		)
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
	($StrokeWidthCreasePattern) => ($StrokeWidthCreasePattern * 3),
	StrokeWidthFactor * 3,
);
export const StrokeDashLengthFoldedForm = derived(
	StrokeWidthFoldedForm,
	($StrokeWidthFoldedForm) => ($StrokeWidthFoldedForm * 3),
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
export const VertexRadiusCP = derived(
	[ViewportCP, VertexRadiusFactor],
	([$ViewportCP, $VertexRadiusFactor]) => (
		Math.max($ViewportCP[2], $ViewportCP[3]) * $VertexRadiusFactor
	),
	0.00666,
);
export const VertexRadiusFolded = derived(
	[ViewportFolded, VertexRadiusFactor],
	([$ViewportFolded, $VertexRadiusFactor]) => (
		Math.max($ViewportFolded[2], $ViewportFolded[3]) * $VertexRadiusFactor
	),
	0.00666,
);
/**
 *
 */
export const LayerGap = writable(0.001);
/**
 *
 */
export const LayerGapScaled = derived(
	[LayerGap, ModelViewMatrixFolded],
	([$LayerGap, $ModelViewMatrixFolded]) => {
		const inferredScale = $ModelViewMatrixFolded[0];
		const value = inferredScale * $LayerGap;
		return !isNaN(value) && isFinite(value) ? value : 0.001;
	},
	0.001,
);

const Defaults = {
	FoldedBackColor: "#bbbbbb",
	FoldedFrontColor: "#1177FF",
	CPColor: "#272222",
	SimulatorFrontColor: "#272222",
	SimulatorBackColor: "#1177FF",
	BoundaryColor: "#888888",
	ValleyColor: "#0088ff",
	MountainColor: "#ee5533",
	FlatColor: "#555555",
	JoinColor: "#ff8800",
	CutColor: "#88ff00",
	UnassignedColor: "#8800ff",
};

//
// colors
//

// the background of the WebGL canvas
export const BackgroundColor = writable("#231f1f");
export const LineOpacity = writable(1);

// front and back are the mesh faces
export const FoldedFrontColor = writable(
	localStorage.getItem("FoldedFrontColor") || Defaults.FoldedFrontColor);
export const FoldedBackColor = writable(
	localStorage.getItem("FoldedBackColor") || Defaults.FoldedBackColor);
export const CPColor = writable(
	localStorage.getItem("CPColor") || Defaults.CPColor);
export const SimulatorFrontColor = writable(
	localStorage.getItem("SimulatorFrontColor") || Defaults.SimulatorFrontColor);
export const SimulatorBackColor = writable(
	localStorage.getItem("SimulatorBackColor") || Defaults.SimulatorBackColor);

// line color by assignment
export const BoundaryColor = writable(
	localStorage.getItem("BoundaryColor") || Defaults.BoundaryColor);
export const ValleyColor = writable(
	localStorage.getItem("ValleyColor") || Defaults.ValleyColor);
export const MountainColor = writable(
	localStorage.getItem("MountainColor") || Defaults.MountainColor);
export const FlatColor = writable(
	localStorage.getItem("FlatColor") || Defaults.FlatColor);
export const JoinColor = writable(
	localStorage.getItem("JoinColor") || Defaults.JoinColor);
export const CutColor = writable(
	localStorage.getItem("CutColor") || Defaults.CutColor);
export const UnassignedColor = writable(
	localStorage.getItem("UnassignedColor") || Defaults.UnassignedColor);

FoldedFrontColor.subscribe(value => localStorage
	.setItem("FoldedFrontColor", value));
FoldedBackColor.subscribe(value => localStorage
	.setItem("FoldedBackColor", value));
CPColor.subscribe(value => localStorage
	.setItem("CPColor", value));
SimulatorFrontColor.subscribe(value => localStorage
	.setItem("SimulatorFrontColor", value));
SimulatorBackColor.subscribe(value => localStorage
	.setItem("SimulatorBackColor", value));

BoundaryColor.subscribe(value => localStorage
	.setItem("BoundaryColor", value));
ValleyColor.subscribe(value => localStorage
	.setItem("ValleyColor", value));
MountainColor.subscribe(value => localStorage
	.setItem("MountainColor", value));
FlatColor.subscribe(value => localStorage
	.setItem("FlatColor", value));
JoinColor.subscribe(value => localStorage
	.setItem("JoinColor", value));
CutColor.subscribe(value => localStorage
	.setItem("CutColor", value));
UnassignedColor.subscribe(value => localStorage
	.setItem("UnassignedColor", value));

//

FoldedFrontColor.subscribe(color => document.documentElement.style
	.setProperty("--front-color", color));
FoldedBackColor.subscribe(color => document.documentElement.style
	.setProperty("--back-color", color));
CPColor.subscribe(color => document.documentElement.style
	.setProperty("--cp-color", color));

BoundaryColor.subscribe(color => document.documentElement.style
	.setProperty("--boundary-color", color));
ValleyColor.subscribe(color => document.documentElement.style
	.setProperty("--valley-color", color));
MountainColor.subscribe(color => document.documentElement.style
	.setProperty("--mountain-color", color));
FlatColor.subscribe(color => document.documentElement.style
	.setProperty("--flat-color", color));
JoinColor.subscribe(color => document.documentElement.style
	.setProperty("--join-color", color));
CutColor.subscribe(color => document.documentElement.style
	.setProperty("--cut-color", color));
UnassignedColor.subscribe(color => document.documentElement.style
	.setProperty("--unassigned-color", color));


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

/**
 *
 */
export const ResetStyleDefaults = () => {
	FoldedFrontColor.set(Defaults.FoldedFrontColor);
	FoldedBackColor.set(Defaults.FoldedBackColor);
	CPColor.set(Defaults.CPColor);
	SimulatorFrontColor.set(Defaults.SimulatorFrontColor);
	SimulatorBackColor.set(Defaults.SimulatorBackColor);
	BoundaryColor.set(Defaults.BoundaryColor);
	ValleyColor.set(Defaults.ValleyColor);
	MountainColor.set(Defaults.MountainColor);
	FlatColor.set(Defaults.FlatColor);
	JoinColor.set(Defaults.JoinColor);
	CutColor.set(Defaults.CutColor);
	UnassignedColor.set(Defaults.UnassignedColor);
};

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
