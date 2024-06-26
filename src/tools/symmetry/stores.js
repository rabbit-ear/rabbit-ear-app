import { writable, derived } from "svelte/store";
import { subtract2 } from "rabbit-ear/math/vector.js";
import { snapOldToPoint, snapOldToRulerLine } from "../../js/snapOld.js";
import { Keyboard } from "../../stores/UI.js";
import { RadialSnapDegrees, RadialSnapOffset } from "../../stores/Snap.js";
import { RulersCP, RulersFolded, RadialRays } from "../../stores/Ruler.js";

export const ReflectionLines = writable([]);

// ReflectionLines.add = (line) => ReflectionLines
// 	.update(lines => [...lines, line]);

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drag = writable(undefined);
export const Release = writable(undefined);

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

const ReleaseCoords = derived(
	[Keyboard, Release],
	([$Keyboard, $Release]) =>
		$Keyboard[16] // shift key
			? snapOldToRulerLine($Release).coords
			: snapOldToPoint($Release),
	undefined,
);

export const PointerLine = derived(
	[PressCoords, DragCoords],
	([$PressCoords, $DragCoords]) =>
		$PressCoords !== undefined && $DragCoords !== undefined
			? {
					vector: subtract2($DragCoords, $PressCoords),
					origin: $PressCoords,
				}
			: undefined,
	undefined,
);

const MakeNewLine = derived(
	[PressCoords, ReleaseCoords],
	([$PressCoords, $ReleaseCoords]) => {
		if ($ReleaseCoords === undefined || $PressCoords === undefined) {
			return;
		}
		ReflectionLines.set([
			{
				vector: subtract2($ReleaseCoords, $PressCoords),
				origin: $PressCoords,
			},
		]);
		// ReflectionLines.update(lines => {
		// 	lines[lines.length - 1] = line;
		// 	return lines;
		// });
		reset();
	},
	undefined,
);

const ShiftRulers = derived(
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

export const reset = () => {
	Move.set(undefined);
	Press.set(undefined);
	Drag.set(undefined);
	Release.set(undefined);
};

let unsub0;
let unsub1;

export const subscribe = () => {
	unsub0 = ShiftRulers.subscribe(() => {});
	unsub1 = MakeNewLine.subscribe(() => {});
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
