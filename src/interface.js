import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { ask, confirm, message } from "@tauri-apps/api/dialog";
import { exists } from "@tauri-apps/api/fs";
import { exit } from "@tauri-apps/api/process";
import { get } from "svelte/store";
import { execute, executeCommand } from "./kernel/execute.js";
import { openFile, save, saveAs, importFile } from "./js/file.js";
import {
	VerticalUp,
	GridType,
	ShowGrid,
	ShowAxes,
	ShowIndices,
	ShowFlatFoldableIssues,
	ShowCodeEditor,
	ShowFrames,
	DialogNewFrame,
	DialogExportAs,
} from "./stores/App.js";
import { FoldedStaticOrSimulator } from "./stores/Renderer.js";
import {
	NewFile,
	FilePath,
	// FileExists,
	FileModified,
	GetCurrentFOLDFile,
} from "./stores/File.js";

/**
 * @description This will force the app to close if the system clock
 * is later than this timestamp date.
 * During development (especially this alpha period),
 * I think it would be nice to force-expire the app to ensure that no
 * copies exist out there which might cause people to file bug reports
 * or other various issues.
 * We must ensure that there is always a version available to download,
 * it should never be the case that this app expires and there is no
 * replacement.
 * Once the app is ready for 1.0, this feature will be removed.
 */
const timeLimitApp = async () => {
	// const date2024_06 = 1717200000; // expires June 1
	// const date2024_09 = 1725148800; // expires Sept 1
	const date2025_01_01 = 1735689600; // expires January 1, 2025

	// convert ms timestamp into seconds timestamp
	const nowDate = Date.now() / 1000;
	// expire june 1, 2024
	if (nowDate > date2025_01_01) {
		setTimeout(exit, 60000);
		await message(
			"download the latest version at:\n\nhttps://github.com/rabbit-ear/rabbit-ear/releases/\n\nDon't worry, it's still 100% free.",
			{
				title: "App Expired in 2025",
				type: "warning",
				okLabel: "Quit",
			},
		);
		exit();
	}
};

timeLimitApp();

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
window.edit = {};

// Rust would like to update a store variable and set it's value.

window.store.set = (name, value) => {
	console.log("setting", name, value);
	switch (name) {
		case "NewEdgeAssignment":
			NewEdgeAssignment.set(value);
			break;
		case "GridType":
			GridType.set(value);
			break;
		default:
			break;
	}
};

// Rust would like to update a store variable, specifically, a boolean store,
// specifically, toggle the boolean value.

window.store.toggle = (name) => {
	let store;
	switch (name) {
		case "ShowFrames":
			store = ShowFrames;
			break;
		case "ShowIndices":
			store = ShowIndices;
			break;
		case "VerticalUp":
			store = VerticalUp;
			break;
		case "ShowGrid":
			store = ShowGrid;
			break;
		case "ShowAxes":
			store = ShowAxes;
			break;
		case "ShowIndices":
			store = ShowIndices;
			break;
		case "ShowFlatFoldableIssues":
			store = ShowFlatFoldableIssues;
			break;
		case "ShowCodeEditor":
			store = ShowCodeEditor;
			break;
		case "ShowFrames":
			store = ShowFrames;
			break;
		case "FoldedStaticOrSimulator":
			store = FoldedStaticOrSimulator;
			break;
		default:
			console.log("store not found");
			return false;
	}
	// console.log("toggle", name, store);
	const value = !get(store);
	store.set(value);
	invoke("store_boolean_update", { name, value });
	return value;
};

// prevent closing before saving the file, 2 ways: "Quit menu" or red/X button

const unlisten = appWindow.onCloseRequested(async (event) => {
	if (!get(FileModified)) {
		return;
	}
	const yesQuit = await confirm("Quit without saving?", {
		title: "Rabbit Ear",
		type: "warning",
		okLabel: "Quit",
		cancelLabel: "Cancel",
	});
	if (!yesQuit) {
		event.preventDefault();
	}
});

// todo: call unlisten if multiple windows are created / component is unmounted
// unlisten();

window.dialog.quit = async () => {
	if (get(FileModified)) {
		const yesQuit = await confirm("Quit without saving?", {
			title: "Rabbit Ear",
			type: "warning",
			okLabel: "Quit",
			cancelLabel: "Cancel",
		});
		if (yesQuit) {
			await exit(0);
		}
	} else {
		await exit(0);
	}
};

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
		NewFile();
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
	return (await exists(filePath))
		? save(JSON.stringify(GetCurrentFOLDFile()), filePath)
		: saveAs(JSON.stringify(GetCurrentFOLDFile()), filePath);
};

window.fs.saveAs = () => saveAs(JSON.stringify(GetCurrentFOLDFile()), get(FilePath));

window.edit.copy = () => {
	console.log("window.edit.copy");
};

window.edit.paste = () => {
	console.log("window.edit.paste");
};
