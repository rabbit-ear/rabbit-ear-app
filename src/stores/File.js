import objToFold from "rabbit-ear/convert/objToFold/index.js";
import opxToFold from "rabbit-ear/convert/opxToFold/index.js";
import svgToFold from "rabbit-ear/convert/svgToFold/index.js";
import svgSegments from "rabbit-ear/convert/svgToFold/svgSegments.js";
import { rgbToAssignment } from "rabbit-ear/fold/colors.js";
import { parseColorToRgb } from "rabbit-ear/svg/colors/parseColor.js";
import { boundingBox } from "rabbit-ear/graph/boundary.js";
import { xmlStringToElement } from "rabbit-ear/svg/general/dom.js";
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
import { DialogImportFile } from "./App.js";

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
};
/**
 *
 */
export const ImportFileOptions = writable({});

const makeAssignments = (segments) => {
	const edgesStroke = segments.map(el => el.stroke);
	const strokes = Array.from(new Set(edgesStroke))
		.filter(el => typeof el === "string");
	// console.log("strokes", strokes);
	const assignments = {};
	strokes.forEach(stroke => {
		assignments[stroke] = rgbToAssignment(...parseColorToRgb(stroke))
	});
	return assignments;
};

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
			case "opx": {
				fold = opxToFold($ImportFileContents);
				const epsilon = shortestEdgeLength(fold) / 24;
				ImportFileOptions.set({
					epsilon,
					suggestedEpsilon: epsilon,
					boundingBox: boundingBox(fold),
					invertVertical: false,
				});
			}
				break;
			case "obj":
				fold = objToFold($ImportFileContents);
				break;
			case "svg": {
				fold = svgToFold($ImportFileContents);
				const epsilon = shortestEdgeLength(fold) / 24;
				const svg = xmlStringToElement($ImportFileContents, "image/svg+xml");
				const segments = svgSegments(svg);
				const assignments = makeAssignments(segments);
				// console.log("epsilon", epsilon);
				// console.log("svg", svg);
				// console.log("segments", segments);
				// console.log("assignments", assignments);
				ImportFileOptions.set({
					epsilon,
					suggestedEpsilon: epsilon,
					boundingBox: boundingBox(fold),
					assignments,
					invertVertical: false,
				});
			}
				break;
			default:
				fold = {};
				break;
			}
		} catch (error) {}
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
export const GetCurrentFOLDFile = () => {
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
	switch (extension.toLowerCase()) {
	case "fold": return LoadFOLDFile(contents, filePath);
	default:
		ImportFileMetadata.set({ filename, name, extension });
		ImportFileContents.set(contents);
		get(DialogImportFile).showModal();
		break;
	}
};
/**
 *
 */
export const finishImport = () => {
	const metadata = get(ImportFileMetadata);
	const contents = get(ImportFileContents);
	const options = get(ImportFileOptions);
	// const preview = get(ImportFilePreview);
	let fold = {};
	try {
		switch (metadata.extension) {
		// case "fold": fold = JSON.parse($ImportFileContents);
		case "opx": fold = opxToFold(contents, options); break;
		case "obj": fold = objToFold(contents, options); break;
		case "svg": fold = svgToFold(contents, options); break;
		default: fold = {}; break;
		}
	} catch (error) {}
	LoadFOLDFile(fold);
};

// todo: top level subscribe has no unsubscribe call.
OnFileNameChange.subscribe(() => {});
