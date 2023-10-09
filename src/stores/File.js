import objToFold from "rabbit-ear/convert/objToFold/index.js";
import opxToFold from "rabbit-ear/convert/opxToFold/index.js";
import svgToFold from "rabbit-ear/convert/svgToFold/index.js";
import { boundingBox } from "rabbit-ear/graph/boundary.js";
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
import { getFilenameParts } from "../js/file.js";
import { shortestEdgeLength } from "../js/graph.js";
// import { invoke } from "@tauri-apps/api/tauri";
/**
 * @description The currently opened filename
 */
export const FileName = writable("untitled.fold");
/**
 * @description The working directory containing the currently opened file
 */
// export const FilePath = writable("~/Desktop/");
/**
 * @description Basically, when this is false "Save" is disabled but "Save as"
 * is available. Once this is true, we have knowledge about where the file
 * is we are currently editing, meaning, "FileName" and "FilePath" relate to
 * an existing file, and "Save" menu will be enabled.
 */
const OnFileNameChange = derived(
	FileName,
	async $FileName => {
		const displayName = $FileName === undefined ? "untitled.fold" : $FileName;
		await appWindow.setTitle(`Rabbit Ear - ${displayName}`);
	},
	undefined,
);
/**
 * @description
 */
export const ImportFileMetadata = writable({});
/**
 * @description {string} file contents
 */
export const ImportFileContents = writable({});
const ImportFileContentsSet = ImportFileContents.set;
ImportFileContents.set = (contents) => {
	// reset other stores
	return ImportFileContentsSet(contents);
}
/**
 *
 */
export const ImportFileOptions = writable({});
/**
 * @description
 */
export const ImportFilePreview = derived(
	[ImportFileContents, ImportFileMetadata],
	([$ImportFileContents, $ImportFileMetadata]) => {
		let fold = {};
		try {
			switch ($ImportFileMetadata.extension) {
			// case "fold": fold = JSON.parse($ImportFileContents);
			case "opx": fold = opxToFold($ImportFileContents); break;
			case "obj": fold = objToFold($ImportFileContents); break;
			case "svg": fold = svgToFold($ImportFileContents); break;
			default: fold = {}; break;
			}
		} catch (error) {}
		//
		const epsilon = shortestEdgeLength(fold) / 24;
		ImportFileOptions.set({
			epsilon,
			suggestedEpsilon: epsilon,
			boundingBox: boundingBox(fold),
			invertVertical: false,
		});
		return fold;
	},
	({}),
);
/**
 * @description
 */
// export const ImportFileBoundingBox = derived(
// 	ImportFilePreview,
// 	$ImportFilePreview => boundingBox($ImportFilePreview),
// 	{},
// );
/**
 * @description Load a new file. Unbind any currently opened file, reset the
 * path, disable "Save" by setting FileExists to false.
 */
export const NewFile = (FOLD) => {
	SetNewModel(FOLD);
	FileName.set(undefined);
};
/**
 *
 */
export const ExportFile = () => {
	const frames = get(Frames);
	const FOLD = { ...get(FileMetadata), ...frames[0] };
	if (frames.length > 1) {
		FOLD.file_frames = frames.slice(1);
	}
	return FOLD;
};
/**
 * @description The second-most default entry point to loading a file,
 * in the case when the file is already known to be a FOLD format.
 */
export const LoadFOLDFile = (FOLD, filename = "untitled.fold") => {
	try {
		SetNewModel(typeof FOLD === "string" ? JSON.parse(FOLD) : FOLD);
		FileName.set(filename);
	} catch (error) {
		// show warning to user. bad file.
	}
};
/**
 * @description The default entry point for loading a file. If the file is
 * a FOLD file, the file will be loaded into the app, otherwise,
 * the InportFile data will be filled to prepare for the importing
 * and conversion of another file format into FOLD.
 */
export const LoadFile = (contents, filePath) => {
	const { filename, name, extension } = getFilenameParts(filePath);
	// console.log("filePath", filePath);
	// console.log("name", name);
	// console.log("extension", extension);
	// console.log("contents", contents);
	switch (extension.toLowerCase()) {
	case "fold": return LoadFOLDFile(contents, filePath);
	default:
		ImportFileMetadata.set({ filename, name, extension });
		ImportFileContents.set(contents);
		break;
	}
};

export const finishImport = () => {

};

// todo: top level subscribe has no unsubscribe call.
OnFileNameChange.subscribe(() => {});
