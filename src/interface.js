import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import {
	ask,
	open,
	save,
} from "@tauri-apps/api/dialog";
import {
	readTextFile,
	writeTextFile,
	BaseDirectory,
} from "@tauri-apps/api/fs";
import { get } from "svelte/store";
import {
	execute,
	executeCommand,
} from "./kernel/execute.js";
import {
	VerticalUp,
	ShowGrid,
	ShowAxes,
	ShowIndices,
	ShowFlatFoldableIssues,
	ShowCodeEditor,
	ShowFrames,
	ShowStaticOrSimulator,
	DialogNewFile,
	DialogNewFrame,
	DialogExportAs,
} from "./stores/App.js";
import {
	FileName,
	LoadFile,
	LoadFOLDFile,
	GetCurrentFOLDFile,
} from "./stores/File.js";

// bind kernel execution methods to the window,
// this is how we call Javascript from Tauri/Rust.
window.execute = execute;
window.executeCommand = executeCommand;
window.dialog = {};
window.store = {};
window.fs = {};
/**
 * @description Communicate from Rust to Javascript.
 * Rust would like to update a store variable and set it's value.
 */
window.store.set = (name, value) => {
	console.log("setting", name, value);
	switch (name) {
	case "NewEdgeAssignment": NewEdgeAssignment.set(value); break;
	default: break;
	}
}
/**
 * @description Communicate from Rust to Javascript.
 * Rust would like to update a store variable, specifically, a boolean store,
 * specifically, toggle the boolean value.
 */
window.store.toggle = (name) => {
	let store;
	switch (name) {
	case "ShowFrames": store = ShowFrames; break;
	case "ShowIndices": store = ShowIndices; break;
	case "VerticalUp": store = VerticalUp; break;
	case "ShowGrid": store = ShowGrid; break;
	case "ShowAxes": store = ShowAxes; break;
	case "ShowIndices": store = ShowIndices; break;
	case "ShowFlatFoldableIssues": store = ShowFlatFoldableIssues; break;
	case "ShowCodeEditor": store = ShowCodeEditor; break;
	case "ShowFrames": store = ShowFrames; break;
	case "ShowStaticOrSimulator": store = ShowStaticOrSimulator; break;
	default: console.log("store not found"); return false;
	}
	// console.log("toggle", name, store);
	const value = !get(store);
	store.set(value);
	invoke("store_boolean_update", { name, value });
	return value;
}
/**
 * @description Communicate from Rust to Javascript.
 * A new file dialog request has been made, open in-app new file dialog.
 */
window.dialog.newFile = async () => {
	// const yes = await ask("Are you sure?", "Tauri");
	const confirmNewFile = await ask("This will erase all current progress", {
		title: "Start a new file?",
		type: "warning",
		okLabel: "New File",
		cancelLabel: "Cancel",
	});
	if (confirmNewFile) {
		executeCommand("newFile");
		get(DialogNewFrame).showModal();
	}
};
/**
 * @description Communicate from Rust to Javascript.
 * A new file dialog request has been made, open in-app new file dialog.
 */
window.dialog.newFrame = async () => {
	get(DialogNewFrame).showModal();
};
/**
 * @description Communicate from Rust to Javascript.
 * A file open dialog request has been made, open file picker.
 */
window.fs.open = async () => {
	// Open a selection dialog for image files
	const selected = await open({
		multiple: false,
		filters: [{
			name: "origami",
			extensions: ["fold"]
		}]
	});
	if (selected == null) { return; }
	// todo: hardcoded ignoring more than 1 file
	const filePath = Array.isArray(selected)
		? selected[0]
		: selected;
	// console.log("filePath", filePath);
	const contents = await readTextFile(filePath);
	try {
		LoadFOLDFile(JSON.parse(contents), filePath);
	} catch (error) {
		console.warn(error);
	}
};
/**
 * @description Communicate from Rust to Javascript.
 * A file save dialog request has been made, open file picker to save file.
 */
window.fs.save = async () => {
	const filePath = get(FileName);
	if (filePath == null) {
		// file does not yet exist. Trigger "SaveAs"
		return window.fs.saveAs();
	}
	await writeTextFile(filePath, JSON.stringify(GetCurrentFOLDFile()));
};
/**
 * @description Communicate from Rust to Javascript.
 * A file save dialog request has been made, open file picker to save file.
 */
window.fs.saveAs = async () => {
	const filePath = await save({
		filters: [{
			name: "origami",
			extensions: ["fold"],
		}]
	});
	if (filePath == null) { return; }
	await writeTextFile(filePath, JSON.stringify(GetCurrentFOLDFile()));
	FileName.set(filePath);
};
/**
 * @description Communicate from Rust to Javascript.
 * A new file dialog request has been made, open in-app new file dialog.
 */
window.dialog.exportAs = async () => {
	get(DialogExportAs).showModal();
};
/**
 * @description Communicate from Rust to Javascript.
 * A new file dialog request has been made, open in-app new file dialog.
 */
window.dialog.importFile = async () => {
	// Open a selection dialog for image files
	const selected = await open({
		multiple: false,
		filters: [{
			name: "image",
			extensions: ["svg", "obj", "opx", "cp"],
		}]
	});
	if (selected == null) { return; }
	// todo: hardcoded ignoring more than 1 file
	const filePath = Array.isArray(selected)
		? selected[0]
		: selected;
	const contents = await readTextFile(filePath);
	LoadFile(contents, filePath);
};
/**
 * @description Drag and drop to load file. Works with FOLD and import-formats
 */
appWindow.onFileDropEvent(async (event) => {
	if (event.payload.type === "hover") {

	} else if (event.payload.type === "drop") {
		if (!event.payload.paths.length) { return; }
		// todo: hardcoded ignoring more than 1 file
		const filePath = event.payload.paths[0];
		const contents = await readTextFile(filePath);
		LoadFile(contents, filePath);
	} else {
		// File drop cancelled
	}
});
