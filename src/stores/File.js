import objToFold from "rabbit-ear/convert/objToFold/index.js";
import opxToFold from "rabbit-ear/convert/opxToFold/index.js";
import svgToFold from "rabbit-ear/convert/svgToFold/index.js";
import svgSegments from "rabbit-ear/convert/svgToFold/svgSegments.js";
import { rgbToAssignment } from "rabbit-ear/fold/colors.js";
import { parseColorToRgb } from "rabbit-ear/svg/colors/parseColor.js";
import { boundingBox } from "rabbit-ear/graph/boundary.js";
import { xmlStringToElement } from "rabbit-ear/svg/general/dom.js";
import { appWindow } from "@tauri-apps/api/window";
import { exists } from "@tauri-apps/api/fs";
import {
	get,
	writable,
	derived,
} from "svelte/store";
import {
	Frames,
	FileMetadata,
	SetNewModel,
} from "./Model.js";
import { getFilenameParts } from "../js/file.js";
import { shortestEdgeLength } from "../js/graph.js";
import {
	APP_NAME,
	DialogImportFile,
} from "./App.js";

// import { invoke } from "@tauri-apps/api/tauri";
const UNTITLED_FILE = "untitled.fold";
/**
 * @description The currently opened filename as a full path, including
 * the directory prefix.
 * @value {string}
 */
export const FilePath = writable(UNTITLED_FILE);
/**
 * @description Does "FilePath" point to an existing file?
 * For example, if so, "save" will work, otherwise it defers to "save as".
 * @value {boolean}
 */
export const FileExists = derived(
	FilePath,
	async ($FilePath, set) => {
		try {
			await exists($FilePath).then(exists => set(exists));
		} catch (error) {
			// console.warn("FileExists", error);
			set(false);
		}
	},
	false,
);
/**
 * @description Watch "FilePath" for any changes, update the window title
 * to include the currently opened filename.
 */
const OnFileNameChange = derived(
	FilePath,
	async $FilePath => {
		const displayName = $FilePath === undefined ? UNTITLED_FILE : $FilePath;
		await appWindow.setTitle(`${APP_NAME} - ${displayName}`);
	},
	undefined,
);

// todo: top level subscribe has no unsubscribe call.
OnFileNameChange.subscribe(() => {});

/**
 * @description When the user imports a file (svg/obj/etc...), the file
 * and its metadata sits here during the intermediary step when the user
 * is able to adjust settings, before the final import.
 * @value {object} object with key/value:
 * - filename {string}
 * - name {string}
 * - extension {string}
 * - contents {string}
 */
export const ImportedFile = writable({});

const makeAssignments = (segments) => {
	const edgesStroke = segments.map(el => el.stroke);
	const strokes = Array.from(new Set(edgesStroke))
		.filter(el => typeof el === "string");
	const assignments = {};
	strokes.forEach(stroke => {
		assignments[stroke] = rgbToAssignment(...parseColorToRgb(stroke))
	});
	return assignments;
};
/**
 * @description When the user imports a file they are given the ability
 * to customize the way it gets imported, this object contains those options.
 * @value {object} an object with key/value:
 * - epsilon {number}
 * - boundingBox {object}
 * - assignments {object}
 * - invertVertical {boolean}
 */
export const ImportedFileOptions = writable({});
/**
 * @description The default object to be saved in ImportedFileOptions
 * and ImportedFileDefaultOptions
 */
const DEFAULT_OPTIONS = () => ({
	epsilon: 0.01,
	boundingBox: { min: [0, 0], max: [0, 0], span: [0, 0] },
	assignments: {},
	invertVertical: false,
});
/**
 * @description An immutable copy of ImportedFileOptions, when the user
 * is customizing the import of the file, this object serves as a reference
 * for the initial import (suggested) settings.
 * This will be set when the ImportedFile is loaded, which causes the
 * ImportedFileOptions to be set ONCE at the same time this is initially set.
 */
export const ImportedFileDefaultOptions = derived(
	ImportedFile,
	($ImportedFile) => {
		let options = DEFAULT_OPTIONS();
		try {
			switch ($ImportedFile.extension.toLowerCase()) {
			case "fold": break;
			case "obj": break;
			case "opx":
				opxFold = opxToFold($ImportedFile.contents);
				options = {
					epsilon: shortestEdgeLength(opxFold) / 24,
					boundingBox: boundingBox(opxFold),
					invertVertical: false,
				};
				break;
			case "svg":
				const svgFold = svgToFold($ImportedFile.contents);
				const svg = xmlStringToElement($ImportedFile.contents, "image/svg+xml");
				options = {
					epsilon: shortestEdgeLength(svgFold) / 24,
					boundingBox: boundingBox(svgFold),
					assignments: makeAssignments(svgSegments(svg)),
					invertVertical: false,
				};
				break;
			default: break;
			}
		} catch (error) {}
		ImportedFileOptions.set(structuredClone(options));
		return options;
	},
	DEFAULT_OPTIONS(),
);
/**
 * @description Would you like to preview the import of the file into
 * a FOLD format, given the current user options?
 */
export const ImportedFileShowPreview = writable(true);
/**
 * @description This is a preview (FOLD object) of the result of
 * importing the file given the current options.
 */
export const ImportedFileFOLDPreview = derived(
	[ImportedFile, ImportedFileOptions, ImportedFileShowPreview],
	([$File, $Options, $ImportedFileShowPreview]) => {
		// console.log("ImportedFileFOLDPreview");
		if (!$ImportedFileShowPreview) { return {}; }
		try {
			switch ($File.extension.toLowerCase()) {
			case "opx": return opxToFold($File.contents, $Options);
			case "obj": return objToFold($File.contents, $Options);
			case "svg": return svgToFold($File.contents, $Options);
			default: return {};
			}
		} catch (error) {}
		return {};
	},
	({}),
);
/**
 * @description This is a preview (FOLD object) using the default
 * not-customized import options. Think of this as the reference image
 * that the user can compare their customized options preview against.
 */
export const ImportedFileDefaultFOLDPreview = derived(
	[ImportedFile, ImportedFileDefaultOptions, ImportedFileShowPreview],
	([$File, $Options, $ImportedFileShowPreview]) => {
		if (!$ImportedFileShowPreview) { return {}; }
		// console.log("ImportedFileDefaultFOLDPreview");
		try {
			switch ($File.extension.toLowerCase()) {
			case "opx": return opxToFold($File.contents, $Options);
			case "obj": return objToFold($File.contents, $Options);
			case "svg": return svgToFold($File.contents, $Options);
			default: return {};
			}
		} catch (error) {}
		return {};
	},
	({}),
);
/**
 * @description Load a new file. Unbind any currently opened file, reset the
 * path, disable "Save" by setting FileExists to false.
 */
export const NewFile = (FOLD) => {
	SetNewModel(FOLD);
	FilePath.set(UNTITLED_FILE);
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
export const LoadFOLDFile = (FOLD, filename = UNTITLED_FILE) => {
	try {
		SetNewModel(typeof FOLD === "string" ? JSON.parse(FOLD) : FOLD);
		FilePath.set(filename);
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
		ImportedFile.set({ filename, name, extension, contents });
		get(DialogImportFile).showModal();
		break;
	}
};
/**
 * @description Cancel the import, reset the imported file contents.
 */
export const clearImport = () => {
	ImportedFile.set({});
};
/**
 * @description Call this to process the conversion with the current
 * user settings and load the result into the app.
 */
export const finishImport = () => {
	const { filename, name, extension } = get(ImportedFile);
	console.log("filename", filename)
	console.log("name", name)
	console.log("extension", extension)
	const newName = name && name !== "" ? `${name}.fold` : undefined
	LoadFOLDFile(get(ImportedFileFOLDPreview), newName);
	clearImport();
};
/**
 *
 */
export const CurrentFrameToSVG = () => {
	const options = { string: true };
	return foldToSvg(get(IsolatedFrame), options);
};
/**
 *
 */
export const CurrentFrameToPNG = () => {
	return new Uint8Array([]);
};
/**
 *
 */
export const CurrentFrameToJPG = () => {
	return new Uint8Array([]);
};
/**
 *
 */
export const FramesToSVGs = () => {
	const options = { string: true };
	return get(IsolatedFrames).map(fold => foldToSvg(fold, options));
};
/**
 *
 */
export const FramesToPNGs = () => {
	return get(IsolatedFrames)
		.map(fold => new Uint8Array([]));
};
/**
 *
 */
export const FramesToJPGs = () => {
	return get(IsolatedFrames)
		.map(fold => new Uint8Array([]));
};