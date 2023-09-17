import {
	writable,
	derived,
} from "svelte/store";
import {
	snapToPoint,
	snapToRulerLine,
} from "../../js/snap.js";
import {
	Keyboard,
	UIGraph,
} from "../../stores/UI.js";
import {
	RadialSnapDegrees,
	RadialSnapOffset,
} from "../../stores/Snap.js";
import {
	RulerLines,
	RulerRays,
} from "../../stores/Ruler.js";
import { executeCommand } from "../../kernel/execute.js";

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drag = writable(undefined);

export const MoveCoords = derived(
	Move,
	($Move) => snapToPoint($Move),
	undefined,
);

export const PressCoords = derived(
	Press,
	($Press) => snapToPoint($Press),
	undefined,
);

export const DragCoords = derived(
	[Keyboard, Drag],
	([$Keyboard, $Drag]) => $Keyboard[16] // shift key
		? snapToRulerLine($Drag).coords
		: snapToPoint($Drag),
	undefined,
);

export const ShiftRulers = derived(
	[Keyboard, PressCoords, RadialSnapDegrees, RadialSnapOffset],
	([$Keyboard, $PressCoords, $RadialSnapDegrees, $RadialSnapOffset]) => {
		if ($Keyboard[16] && $PressCoords) {
			executeCommand("radialRulers",
				$PressCoords,
				$RadialSnapDegrees,
				$RadialSnapOffset,
			)
		} else {
			RulerLines.set([]);
			RulerRays.set([]);
		}
	},
	undefined,
);

export const FoldedLinePreviews = derived(
	[PressCoords, DragCoords],
	([$PressCoords, $DragCoords]) => {
		if ($PressCoords !== undefined && $DragCoords !== undefined) {
			executeCommand("foldedLinePreview", $PressCoords, $DragCoords);
		} else {
			UIGraph.set({});
		}
	},
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Press.set(undefined);
	Drag.set(undefined);
};

let unsub0;
let unsub1;

export const subscribe = () => {
	unsub0 = ShiftRulers.subscribe(() => {});
	unsub1 = FoldedLinePreviews.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub0) { unsub0(); }
	if (unsub1) { unsub1(); }
	reset();
};
