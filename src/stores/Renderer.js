import {
	writable,
	derived,
} from "svelte/store";
import {
	FoldAnglesAreFlat,
} from "./ModelCP.js";

// Would the user like to render the folded form using origami simulator?
// false: static (svg/webgl), true: simulator
export const FoldedStaticOrSimulator = writable(false);

// flat foldable folded forms will render in SVG by default.
export const FoldedPrefer3D = writable(false);
/**
 * @description Which renderer should we use to render the folded form?
 * The result depends on some properties of the graph as well as requests
 * by the user, for example, a valid 2D folding can be rendered in either
 * "svg" or "webgl" so the user is allowed to request which. As opposed to
 * a 3D folded model which can only be rendered using webgl.
 * @returns one of 3 strings: "svg", "webgl", "simulator"
 */
export const FoldedRenderer = derived(
	[FoldedPrefer3D, FoldedStaticOrSimulator, FoldAnglesAreFlat],
	([$FoldedPrefer3D, $FoldedStaticOrSimulator, $FoldAnglesAreFlat]) => {
		if ($FoldedStaticOrSimulator) { return "simulator"; }
		if ($FoldedPrefer3D) { return "webgl"; }
		if (!$FoldAnglesAreFlat) { return "webgl"; }
		return "svg";
	},
	"svg",
);
