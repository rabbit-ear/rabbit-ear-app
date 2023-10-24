import { get } from "svelte/store";
import { isFrameElementSelected } from "../js/dom.js";
import { TerminalTextarea } from "./App.js";
import { Tool } from "./UI.js";
import {
	execute,
	executeCommand,
} from "../kernel/execute.js";
/**
 * @description holding "alt" temporarily turns the pointer device
 * into a camera, allowing the user to pan. Store in here which tool
 * the user was using before pressing "alt", and we will switch back when done.
 */
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
const KeybindingsDown = {
	// delete
	8: {
		0: (event) => isFrameElementSelected()
			? executeCommand("deleteActiveFrame")
			: execute("deleteComponents(getSelected())"),
		// : executeCommand("deleteComponents", get(Selection)),
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
	// 27: {
	// 	0: (event) => {
	// 		executeCommand("resetApp"); // close all dialogs. not available anymore
	// 		executeCommand("resetTool");
	// 		// executeCommand("resetRulers");
	// 		document.activeElement.blur();
	// 	},
	// },
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
		// 2: (event) => executeCommand("selectAll"),
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
		// 1: (event) => {
		// 	if (isFrameElementSelected()) {
		// 		executeCommand("duplicateActiveFrame");
		// 	} else {
		// 		executeCommand("duplicate");
		// 		executeCommand("setTool", "translate");
		// 	}
		// },
		// 2: (event) => executeCommand("deselectAll"),
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
		// 2: (event) => get(DialogNewFile).showModal(),
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
	// 90: {
	// 	2: (event) => executeCommand("undo"),
	// 	3: (event) => executeCommand("redo"),
	// },
	// forward slash
	191: {
		0: (event) => get(TerminalTextarea).focus(),
	},
};

const KeybindingsUp = {
	// alt
	18: {
		0: (event) => {
			executeCommand("setTool", altCameraToolSwap);
			altCameraToolSwap = undefined;
		},
	},
};

export default {
	down: KeybindingsDown,
	up: KeybindingsUp,
};
