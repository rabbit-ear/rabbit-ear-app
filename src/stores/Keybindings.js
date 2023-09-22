import { get } from "svelte/store";
import {
	DialogNewFile,
	TerminalTextarea,
	ShowTerminal,
} from "./App.js";
import { Tool } from "./UI.js";
import { Selection } from "./Select.js";
import { executeCommand } from "../kernel/execute.js";

let altCameraToolSwap;

// bit-key lookup
// compute from: shift << 0 | ctrl || cmd << 1 | alt << 2
// 0: none
// 1: shift
// 2: ctrl/cmd
// 3: shift + ctrl/cmd
// 4: alt
// 5: shift + alt
// 6: ctrl/cmd + alt
// 7: shift + ctrl/cmd + alt
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
				executeCommand("deleteActiveFrame");
			} else {
				// otherwise, the graph is selected. delete any selected components.
				executeCommand("deleteComponents", get(Selection));
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
			executeCommand("setTool", "camera");
		},
	},
	// esc
	27: {
		0: (event) => {
			executeCommand("resetApp");
			executeCommand("resetTool");
			// executeCommand("resetRulers");
		},
	},
	// 1 - 7
	49: {
		0: (event) => executeCommand("setTool", "axiom1"),
	},
	50: {
		0: (event) => executeCommand("setTool", "axiom2"),
	},
	51: {
		0: (event) => executeCommand("setTool", "axiom3"),
	},
	52: {
		0: (event) => executeCommand("setTool", "axiom4"),
	},
	53: {
		0: (event) => executeCommand("setTool", "axiom5"),
	},
	54: {
		0: (event) => executeCommand("setTool", "axiom6"),
	},
	55: {
		0: (event) => executeCommand("setTool", "axiom7"),
	},
	// "a"
	65: {
		0: (event) => executeCommand("setTool", "assignment"),
		2: (event) => executeCommand("selectAll"),
	},
	// "b"
	66: {
		0: (event) => executeCommand("setToolAssignment", "B"),
	},
	// "c"
	67: {
		0: (event) => executeCommand("setToolAssignment", "C"),
	},
	// "d"
	68: {
		0: (event) => executeCommand("setTool", "deleteTool"),
		1: (event) => {
			executeCommand("duplicate");
			executeCommand("setTool", "translate");
		},
		2: (event) => executeCommand("deselectAll"),
	},
	// "e"
	69: {
		0: (event) => executeCommand("setTool", "edge"),
	},
	// "f"
	70: {
		0: (event) => executeCommand("setToolAssignment", "F"),
	},
	// "k"
	75: {
		0: (event) => executeCommand("setTool", "kawasaki"),
	},
	// "m"
	77: {
		0: (event) => executeCommand("setToolAssignment", "M"),
	},
	// "n"
	78: {
		2: (event) => get(DialogNewFile).showModal(),
	},
	// "s"
	83: {
		0: (event) => executeCommand("setTool", "select"),
		// 0: (event) => executeCommand("setTool", "edge"),
	},
	// "t"
	84: {
		0: (event) => executeCommand("setTool", "translate"),
	},
	// "u"
	85: {
		0: (event) => executeCommand("setToolAssignment", "U"),
	},
	// "v"
	86: {
		0: (event) => executeCommand("setToolAssignment", "V"),
	},
	// "z"
	90: {
		2: (event) => executeCommand("undo"),
		3: (event) => executeCommand("redo"),
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
			executeCommand("setTool", altCameraToolSwap);
			altCameraToolSwap = undefined;
		},
	},
};
