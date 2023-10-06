import {
	get,
	writable,
	derived,
} from "svelte/store";
import { appWindow } from "@tauri-apps/api/window";
import {
	Frames,
	FileMetadata,
	SetNewModel,
} from "./Model.js";
// import { invoke } from "@tauri-apps/api/tauri";
/**
 * @description Basically, when this is false "Save" is disabled but "Save as"
 * is available. Once this is true, we have knowledge about where the file
 * is we are currently editing, meaning, "FileName" and "FilePath" relate to
 * an existing file, and "Save" menu will be enabled.
 */
export const FileExists = writable(false);
/**
 * @description The currently opened filename
 */
export const FileName = writable("untitled.fold");
/**
 * @description The working directory containing the currently opened file
 */
// export const FilePath = writable("~/Desktop/");
/**
 * @description Load a new file. Unbind any currently opened file, reset the
 * path, disable "Save" by setting FileExists to false.
 */
export const NewFile = (FOLD = {}) => {
	SetNewModel(FOLD);
	FileName.set("untitled.fold");
	FileExists.set(false);
};
/**
 * @description Load a FOLD file and bind the app to be "editing" this
 * current file, keeping track of the filename/path.
 */
export const LoadFile = (FOLD, filename = "untitled.fold") => {
	SetNewModel(FOLD);
	FileName.set(filename);
	FileExists.set(true);
};
/**
 *
 */
export const GetFile = () => {
	const frames = get(Frames);
	const FOLD = { ...get(FileMetadata), ...frames[0] };
	if (frames.length > 1) {
		FOLD.file_frames = frames.slice(1);
	}
	return FOLD;
};

const OnFileNameChange = derived(
	FileName,
	async $FileName => {
		await appWindow.setTitle(`Rabbit Ear - ${$FileName}`);
	},
	undefined,
);

// todo: top level subscribe has no unsubscribe call.
OnFileNameChange.subscribe(() => {});
