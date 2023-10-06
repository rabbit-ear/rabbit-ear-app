import { invoke } from "@tauri-apps/api/tauri";
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
	LoadFile,
	SaveFile,
} from "./stores/Model.js";

// bind kernel execution methods to the window,
// this is how we call Javascript from Tauri/Rust.
window.execute = execute;
window.executeCommand = executeCommand;
window.dialog = {};
window.store = {};
window.fs = {};

window.store.set = (name, value) => {
	console.log("setting", name, value);
	switch (name) {
	case "NewEdgeAssignment": NewEdgeAssignment.set(value); break;
	default: break;
	}
}

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

window.dialog.newFile = () => {
	get(DialogNewFile).showModal();
}

// window.saveAs = () => {
// 	invoke("save_as", { fold: JSON.stringify(SaveFile()) });
// };

window.fs.saveAs = async () => {
	const filePath = await save({
		filters: [{
			name: "origami",
			extensions: ["fold"]
		}]
	});
	if (filePath == null) { return; }
	// console.log("filePath", filePath);
	await writeTextFile(filePath, JSON.stringify(SaveFile())); // , { dir: BaseDirectory.AppConfig });
};

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
	const filePath = Array.isArray(selected)
		? selected[0]
		: selected;
	// console.log("filePath", filePath);
	const contents = await readTextFile(filePath); // , { dir: BaseDirectory.AppConfig });
	try {
		LoadFile(JSON.parse(contents));
	} catch (error) {
		console.warn(error);
	}
};
