import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import {
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
	InvertY,
	ShowGrid,
	ShowAxes,
	ShowIndices,
	ShowFlatFoldableIssues,
	ShowCodeEditor,
	ShowFrames,
	ShowStaticOrSimulator,
	DialogNewFile,
} from "./stores/App.js";
import {
	FileName,
	LoadFile,
	GetFile,
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
	case "InvertY": store = InvertY; break;
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
window.dialog.newFile = () => {
	get(DialogNewFile).showModal();
}
/**
 * @description Communicate from Rust to Javascript.
 * A file open dialog request has been made, open file picker.
 */
window.fs.open = async () => {
// Open a selection dialog for image files
	const selected = await open({
		multiple: true,
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
		LoadFile(JSON.parse(contents), filePath);
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
	await writeTextFile(filePath, JSON.stringify(GetFile()));
};
/**
 * @description Communicate from Rust to Javascript.
 * A file save dialog request has been made, open file picker to save file.
 */
window.fs.saveAs = async () => {
	const filePath = await save({
		filters: [{
			name: "origami",
			extensions: ["fold"]
		}]
	});
	if (filePath == null) { return; }
	await writeTextFile(filePath, JSON.stringify(GetFile()));
	FileName.set(filePath);
};
/**
 * @description Drag and drop to load file
 */
const unlisten = await appWindow.onFileDropEvent(async (event) => {
	// console.log("DRAG AND DROP", event);
	if (event.payload.type === "hover") {
		// console.log("User hovering", event.payload.paths);
	} else if (event.payload.type === "drop") {
		// console.log("User dropped", event.payload.paths);
		if (!event.payload.paths.length) { return; }
		// todo: hardcoded ignoring more than 1 file
		const filePath = event.payload.paths[0];
		const contents = await readTextFile(filePath);
		try {
			LoadFile(JSON.parse(contents), filePath);
		} catch (error) {
			console.warn(error);
		}
	} else {
		// console.log("File drop cancelled");
	}
});

// you need to call unlisten if your handler goes
// out of scope e.g. the component is unmounted
// unlisten();
