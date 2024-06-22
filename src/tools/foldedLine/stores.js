import { writable, derived } from "svelte/store";
import { snapOldToPoint, snapOldToRulerLine } from "../../js/snapOld.js";
import { Keyboard, GhostGraphCP } from "../../stores/UI.js";
import { RadialSnapDegrees, RadialSnapOffset } from "../../stores/Snap.js";
import { RulersCP, RulersFolded, RadialRays } from "../../stores/Ruler.js";
import { executeCommand } from "../../kernel/execute.js";

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drag = writable(undefined);

export const MoveCoords = derived(
	Move,
	($Move) => snapOldToPoint($Move),
	undefined,
);

export const PressCoords = derived(
	Press,
	($Press) => snapOldToPoint($Press),
	undefined,
);

export const DragCoords = derived(
	[Keyboard, Drag],
	([$Keyboard, $Drag]) =>
		$Keyboard[16] // shift key
			? snapOldToRulerLine($Drag).coords
			: snapOldToPoint($Drag),
	undefined,
);

export const ShiftRulers = derived(
	[Keyboard, PressCoords, RadialSnapDegrees, RadialSnapOffset],
	([$Keyboard, $PressCoords, $RadialSnapDegrees, $RadialSnapOffset]) => {
		if ($Keyboard[16] && $PressCoords) {
			RulersCP.set(
				RadialRays($PressCoords, $RadialSnapDegrees, $RadialSnapOffset),
			);
		} else {
			RulersCP.set([]);
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
			// todo: does this need to be here?
			GhostGraphCP.set({});
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
	if (unsub0) {
		unsub0();
	}
	if (unsub1) {
		unsub1();
	}
	reset();
};
