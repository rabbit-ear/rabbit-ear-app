import { get } from "svelte/store";
import {
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../app/keys.js";
import { AssignType } from "../tools/assignment/stores.js";
import {
	DialogNewFile,
	TerminalTextarea,
	ShowTerminal,
} from "./App.js";
import { Tool } from "./UI.js";
import { Selection } from "./Select.js";
import execute from "../kernel/execute.js";
import executeUI from "../kernel/executeUI.js";

let altCameraToolSwap;

export const KeybindingsDown = {
	// delete
	8: {
		0: (event) => {
			// currently selected a frame from the frame item panel.
			// user would like to delete this frame.
			const frameSelected = document.activeElement
				&& document.activeElement.classList
				&& document.activeElement.classList.contains("button-frame-item");
			if (frameSelected) {
				// if a frame is selected, delete the frame
				execute("deleteActiveFrame");
			} else {
				// otherwise, the graph is selected. delete any selected components.
				execute("deleteComponents", get(Selection));
			}
		},
	},
	// shift
	16: {},
	// alt
	18: {
		4: (event) => {
			const tool = get(Tool);
			altCameraToolSwap = tool ? tool.key : undefined;
			executeUI("setTool", "camera");
		},
	},
	// esc
	27: {
		0: (event) => {
			executeUI("resetToolUI");
			executeUI("resetUI");
		},
	},
	// 1 - 7
	49: {
		0: (event) => executeUI("setTool", "axiom1"),
	},
	50: {
		0: (event) => executeUI("setTool", "axiom2"),
	},
	51: {
		0: (event) => executeUI("setTool", "axiom3"),
	},
	52: {
		0: (event) => executeUI("setTool", "axiom4"),
	},
	53: {
		0: (event) => executeUI("setTool", "axiom5"),
	},
	54: {
		0: (event) => executeUI("setTool", "axiom6"),
	},
	55: {
		0: (event) => executeUI("setTool", "axiom7"),
	},
	// "a"
	65: {
		2: (event) => execute("selectAll"),
	},
	// "b"
	66: {
		0: (event) => {
			executeUI("setTool", "assignment");
			AssignType.set(ASSIGN_BOUNDARY);
		},
	},
	// "c"
	67: {
		0: (event) => {
			executeUI("setTool", "assignment");
			AssignType.set(ASSIGN_CUT);
		},
	},
	// "d"
	68: {
		0: (event) => executeUI("setTool", "deleteTool"),
	},
	// "e"
	69: {
		0: (event) => executeUI("setTool", "edge"),
	},
	// "f"
	70: {
		0: (event) => {
			executeUI("setTool", "assignment");
			AssignType.set(ASSIGN_FLAT);
		},
	},
	// "k"
	75: {
		0: (event) => executeUI("setTool", "kawasaki"),
	},
	// "m"
	77: {
		0: (event) => {
			executeUI("setTool", "assignment");
			AssignType.set(ASSIGN_SWAP);
		},
	},
	// "n"
	78: {
		2: (event) => get(DialogNewFile).showModal(),
	},
	// "s"
	83: {
		0: (event) => executeUI("setTool", "select"),
	},
	// "t"
	84: {
		0: (event) => executeUI("setTool", "translate"),
	},
	// "u"
	85: {
		0: (event) => {
			executeUI("setTool", "assignment");
			AssignType.set(ASSIGN_UNASSIGNED);
		},
	},
	// "v"
	86: {
		0: (event) => {
			executeUI("setTool", "assignment");
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
		0: (event) => (!get(ShowTerminal)
			? ShowTerminal.set(true)
			: get(TerminalTextarea).focus()),
	},
};

export const KeybindingsUp = {
	// alt
	18: {
		0: (event) => {
			executeUI("setTool", altCameraToolSwap);
			altCameraToolSwap = undefined;
		},
	},
};
