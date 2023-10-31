import { invoke } from "@tauri-apps/api/tauri";
import { ask } from "@tauri-apps/api/dialog";
import { exists } from "@tauri-apps/api/fs";
import { get } from "svelte/store";
import {
	execute,
	executeCommand,
} from "./kernel/execute.js";
import {
	openFile,
	save,
	saveAs,
	importFile,
} from "./js/file.js";
import {
	VerticalUp,
	ShowGrid,
	ShowAxes,
	ShowIndices,
	ShowFlatFoldableIssues,
	ShowCodeEditor,
	ShowFrames,
	DialogNewFrame,
	DialogExportAs,
} from "./stores/App.js";
import {
	FoldedStaticOrSimulator,
} from "./stores/Renderer.js";
import {
	NewFile,
	FilePath,
	// FileExists,
	GetCurrentFOLDFile,
} from "./stores/File.js";

/**
 * @description Communicate from Rust to Javascript.
 */

// bind kernel execution methods to the window,
// this is how we call Javascript from Tauri/Rust.
window.execute = execute;
window.executeCommand = executeCommand;
window.dialog = {};
window.store = {};
window.fs = {};

// Rust would like to update a store variable and set it's value.

window.store.set = (name, value) => {
	console.log("setting", name, value);
	switch (name) {
	case "NewEdgeAssignment": NewEdgeAssignment.set(value); break;
	default: break;
	}
}

// Rust would like to update a store variable, specifically, a boolean store,
// specifically, toggle the boolean value.

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
	case "FoldedStaticOrSimulator": store = FoldedStaticOrSimulator; break;
	default: console.log("store not found"); return false;
	}
	// console.log("toggle", name, store);
	const value = !get(store);
	store.set(value);
	invoke("store_boolean_update", { name, value });
	return value;
}

// Dialogs for creating new files/frames, importing/exporting files

window.dialog.newFile = async () => {
	// const yes = await ask("Are you sure?", "Tauri");
	const confirmNewFile = await ask("This will erase all current progress", {
		title: "Start a new file?",
		type: "warning",
		okLabel: "New File",
		cancelLabel: "Cancel",
	});
	if (confirmNewFile) {
		NewFile()
		get(DialogNewFrame).showModal();
	}
};

window.dialog.newFrame = async () => {
	get(DialogNewFrame).showModal();
};

window.dialog.exportAs = async () => {
	get(DialogExportAs).showModal();
};

window.dialog.importFile = importFile;

// Various native file system behavior

window.fs.open = openFile;

// This doesn't work in the way I expected, Svelte derived stores with
// async values. This one time get() will get the current value (previous),
// before the call to the async, which, in theory would trigger a refresh
// of the data, if we weren't using this one time subscribe get().
// const exists = await get(FileExists);
// window.fs.save = async () => await get(FileExists)
// 	? save(JSON.stringify(GetCurrentFOLDFile()), get(FilePath))
// 	: saveAs(JSON.stringify(GetCurrentFOLDFile()), get(FilePath));
window.fs.save = async () => {
	const filePath = get(FilePath);
	if (!filePath) {
		return saveAs(JSON.stringify(GetCurrentFOLDFile()));
	}
	return await exists(filePath)
		? save(JSON.stringify(GetCurrentFOLDFile()), filePath)
		: saveAs(JSON.stringify(GetCurrentFOLDFile()), filePath);
};

window.fs.saveAs = () => (
	saveAs(JSON.stringify(GetCurrentFOLDFile()), get(FilePath))
);
