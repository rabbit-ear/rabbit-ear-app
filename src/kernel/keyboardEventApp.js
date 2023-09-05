import { get } from "svelte/store";
import {
	TOOL_SELECT,
	TOOL_DELETE,
	TOOL_CAMERA,
	TOOL_VERTEX,
	TOOL_EDGE,
	TOOL_AXIOM_1,
	TOOL_AXIOM_2,
	TOOL_AXIOM_3,
	TOOL_AXIOM_4,
	TOOL_AXIOM_5,
	TOOL_AXIOM_6,
	TOOL_AXIOM_7,
	TOOL_FOLD_LINE,
	TOOL_KAWASAKI,
	TOOL_PLEAT,
	TOOL_SCRIBBLE,
	TOOL_SYMMETRY,
	TOOL_SPLIT_EDGE,
	TOOL_TRANSLATE,
	TOOL_SCALE,
	TOOL_ASSIGN,
	TOOL_FOLD_ANGLE,
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../app/keys.js";
// import { keyboardEventEdge } from "./keyboardEventEdge.js";
// import { keyboardEventFoldLine } from "./keyboardEventFoldLine.js";
// import { keyboardEventDelete } from "./keyboardEventDelete.js";
// import { keyboardEventTerminal } from "./keyboardEventTerminal.js";
import {
	Tool,
	AssignType,
} from "../stores/Tool.js";
import {
	DialogNewFile,
	TerminalTextarea,
	ShowTerminal,
} from "../stores/App.js";
import { execute } from "./app.js";
import { ResetUI } from "../stores/UI.js";
import { RulerLines, RulerRays } from "../stores/Ruler.js";
import { Selection } from "../stores/Select.js";

let altCameraToolSwap;

//
// shift: 1
// ctrl/meta: 2
// alt: 4
//
// ctrl + shift: 3
//
const keybindingsDown = {
	// delete
	8: {
		0: (event) => {
			// currently selected a frame from the frame item panel.
			// user would like to delete this frame.
			if (document.activeElement
				&& document.activeElement.classList
				&& document.activeElement.classList.contains("button-frame-item")) {
				execute("deleteActiveFrame");
			} else {
				// delete selected components
				execute("deleteComponents", get(Selection));
			}
		},
	},
	// shift
	16: {

	},
	// alt
	18: {
		4: (event) => {
			altCameraToolSwap = get(Tool);
			Tool.set(TOOL_CAMERA);
		},
	},
	// esc
	27: {
		0: (event) => {
			ResetUI();
			RulerLines.set([]);
			RulerRays.set([]);
		},
	},
	// 1 - 7
	49: {
		0: (event) => Tool.set(TOOL_AXIOM_1),
	},
	50: {
		0: (event) => Tool.set(TOOL_AXIOM_2),
	},
	51: {
		0: (event) => Tool.set(TOOL_AXIOM_3),
	},
	52: {
		0: (event) => Tool.set(TOOL_AXIOM_4),
	},
	53: {
		0: (event) => Tool.set(TOOL_AXIOM_5),
	},
	54: {
		0: (event) => Tool.set(TOOL_AXIOM_6),
	},
	55: {
		0: (event) => Tool.set(TOOL_AXIOM_7),
	},
	// "a"
	65: {
		2: (event) => execute("selectAll"),
	},
	// "b"
	66: {
		0: (event) => {
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_BOUNDARY);
		},
	},
	// "c"
	67: {
		0: (event) => {
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_CUT);
		},
	},
	// "d"
	68: {
		0: (event) => Tool.set(TOOL_DELETE),
	},
	// "e"
	69: {
		0: (event) => Tool.set(TOOL_EDGE),
	},
	// "f"
	70: {
		0: (event) => {
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_FLAT);
		},
	},
	// "k"
	75: {
		0: (event) => Tool.set(TOOL_KAWASAKI),
	},
	// "m"
	77: {
		0: (event) => {
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_SWAP);
		},
	},
	// "n"
	78: {
		2: (event) => get(DialogNewFile).showModal(),
	},
	// "s"
	83: {
		2: (event) => Tool.set(TOOL_SELECT),
	},
	// "t"
	84: {
		2: (event) => Tool.set(TOOL_TRANSLATE),
	},
	// "u"
	85: {
		0: (event) => {
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_UNASSIGNED);
		},
	},
	// "v"
	86: {
		0: (event) => {
			Tool.set(TOOL_ASSIGN);
			AssignType.set(ASSIGN_SWAP);
		},
	},
	// "z"
	90: {
		2: (event) => execute("undo"),
		3: (event) => console.log("redo"),
	},
	// forward slash
	191: {
		0: (event) => {
			if (!get(ShowTerminal)) {
				ShowTerminal.set(true);
			} else {
				get(TerminalTextarea).focus();
			}
		}
	}
};

const keybindingsUp = {
	// alt
	18: {
		0: (event) => {
			Tool.set(altCameraToolSwap || TOOL_EDGE);
			altCameraToolSwap = undefined;
		},
	},
};

export const keyboardEventApp = (eventType, event) => {
	const { altKey, ctrlKey, metaKey, shiftKey } = event;
	const modifier = (shiftKey << 0) | ((ctrlKey || metaKey) << 1) | (altKey << 2);
	let match;
	switch (eventType) {
	case "down":
		match = keybindingsDown[event.keyCode]
			? keybindingsDown[event.keyCode][modifier]
			: undefined;
		break;
	case "up":
		match = keybindingsUp[event.keyCode]
			? keybindingsUp[event.keyCode][modifier]
			: undefined;
		break;
	}
	if (match === undefined) { return false; }
	event.preventDefault();
	match(event);
	return true;
};
