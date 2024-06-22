import { appWindow } from "@tauri-apps/api/window";
import { open, save as tauriSave } from "@tauri-apps/api/dialog";
import {
	readTextFile,
	writeTextFile as tauriWriteTextFile,
	writeBinaryFile as tauriWriteBinaryFile,
} from "@tauri-apps/api/fs";
import {
	FilePath,
	LoadFile,
	LoadFOLDFile,
	FileModified,
} from "../stores/File.js";
import { dialogError } from "./dialog.js";
import {
	basename,
	dirname,
	extname,
	join,
	homeDir,
	resolve,
	// normalize,
} from "@tauri-apps/api/path";
/**
 * @description Given a filename (name + extension), without a path
 * directory, prefix the OS User's document directory to the file
 * and return the full path.
 */
export const homeDirectoryFile = async (name) =>
	await join(await homeDir(), name);
/**
 * @description Pick apart a file path into useful parts
 * @returns {object} object with all string values:
 * - "directory": "/Users/Maya/Origami/"
 * - "base": "dog-3.fold"
 * - "name": "dog-3"
 * - "extension": "fold"
 */
export const getFilenameParts = async (filePath) => {
	// compute everything inside of individual try catches.
	// for example if the file has no extension, the extname() function
	// will throw an error, in which case, we still want to get the other data.
	let directory = "";
	let base = "";
	let name = "";
	let extension = "";
	// resolve the user's "filePath" into an absolute path
	try {
		filePath = await resolve(filePath);
		// filePath = await normalize(filePath);
	} catch (e) {}
	// get the directory containing the file
	try {
		directory = await dirname(filePath);
	} catch (e) {}
	// get the basename of the file (name + extension), and for now,
	// set the "name" entry to be this, in the case that the file has no
	// extension, the following calls might not work.
	try {
		base = await basename(filePath);
		name = base;
	} catch (e) {}
	// get the extension of the file, the portion after the final "."
	try {
		extension = await extname(filePath);
	} catch (e) {}
	// parse the base and get the name of the file excluding the . and extension
	try {
		const basematch = base.match(/(.*)\.[^.]+$/);
		name = basematch[1];
	} catch (e) {}
	return { directory, base, name, extension };
};
/**
 * @description Convert a file name (name + extension) into a sequence of
 * filenames that take the form of name-0000N.ext where 000N is a number
 * that counts up from 0 to "count" - 1, and 000N will have the minimum
 * number of preceding zeros to pad all numbers to be the same length.
 */
const makeNumberedFilenames = (count, name, extension) => {
	const places = count.toString().length;
	const zeros = Array(places).fill(0).join("");
	return Array.from(Array(count))
		.map((_, i) => `${zeros}${i}`)
		.map((str) => str.slice(str.length - places, str.length))
		.map((num) => `${name}-${num}.${extension}`);
};
/**
 *
 */
export const writeTextFile = async (string, ext = "svg") => {
	const filePath = await tauriSave({
		filters: [
			{
				name: "image",
				extensions: [ext],
			},
		],
	});
	if (filePath == null) {
		return;
	}
	const { directory, name } = await getFilenameParts(filePath);
	const joined = await join(directory, `${name}.${ext}`);
	tauriWriteTextFile(joined, string);
};
/**
 *
 */
export const writeBinaryFile = async (binaryFile, ext = "png") => {
	const filePath = await tauriSave({
		filters: [
			{
				name: "image",
				extensions: [ext],
			},
		],
	});
	if (filePath == null) {
		return;
	}
	const { directory, name } = await getFilenameParts(filePath);
	const joined = await join(directory, `${name}.${ext}`);
	tauriWriteBinaryFile(joined, binaryFile);
};
/**
 *
 */
export const writeTextFiles = async (textStrings = [], ext = "svg") => {
	const filePath = await tauriSave({
		filters: [
			{
				name: "image",
				extensions: [ext],
			},
		],
	});
	if (filePath == null) {
		return;
	}
	const { directory, name, extension } = await getFilenameParts(filePath);
	makeNumberedFilenames(textStrings.length, name, extension).map(
		async (numberedName, i) => {
			const outPath = await join(directory, numberedName);
			tauriWriteTextFile(outPath, textStrings[i]);
		},
	);
};
/**
 *
 */
export const writeBinaryFiles = async (binaryFiles = [], ext = "png") => {
	const filePath = await tauriSave({
		filters: [
			{
				name: "image",
				extensions: [ext],
			},
		],
	});
	if (filePath == null) {
		return;
	}
	const { directory, name, extension } = await getFilenameParts(filePath);
	makeNumberedFilenames(binaryFiles.length, name, extension).map(
		async (numberedName, i) => {
			const outPath = await join(directory, numberedName);
			tauriWriteBinaryFile(outPath, binaryFiles[i]);
		},
	);
};
/**
 *
 */
export const openFile = async () => {
	const selected = await open({
		multiple: false,
		filters: [
			{
				name: "FOLD",
				extensions: ["fold"],
			},
		],
	});
	if (selected == null) {
		return;
	}
	// todo: hardcoded ignoring more than 1 file
	const filePath = Array.isArray(selected) ? selected[0] : selected;
	// console.log("filePath", filePath);
	const contents = await readTextFile(filePath);
	try {
		LoadFOLDFile(JSON.parse(contents), filePath);
	} catch (error) {
		console.warn(error);
	}
};
/**
 *
 */
export const save = async (contents, filePath) => {
	// this does not check if the file exists.
	// if file does not yet exist, you should call "SaveAs"
	await tauriWriteTextFile(filePath, contents);
	FileModified.set(false);
};
/**
 *
 */
export const saveAs = async (contents, targetFilePath) => {
	const { directory: defaultPath } = await getFilenameParts(targetFilePath);
	const filters = [
		{
			name: "FOLD",
			extensions: ["fold"],
		},
	];
	const options =
		!targetFilePath || !defaultPath || defaultPath === ""
			? { filters }
			: { filters, defaultPath };
	const filePath = await tauriSave(options);
	if (filePath == null) {
		return;
	}
	await tauriWriteTextFile(filePath, contents);
	FilePath.set(filePath);
	FileModified.set(false);
};
/**
 *
 */
export const importFile = async () => {
	// Open a selection dialog for image files
	const selected = await open({
		multiple: false,
		filters: [
			{
				name: "image",
				extensions: ["svg", "obj", "opx", "cp"],
			},
		],
	});
	if (selected == null) {
		return;
	}
	// todo: hardcoded ignoring more than 1 file
	const filePath = Array.isArray(selected) ? selected[0] : selected;
	const contents = await readTextFile(filePath);
	LoadFile(contents, filePath);
};
/**
 * @description Drag and drop to load file. Works with FOLD and import-formats
 */
appWindow.onFileDropEvent(async (event) => {
	if (event.payload.type === "hover") {
	} else if (event.payload.type === "drop") {
		if (!event.payload.paths.length) {
			return;
		}
		const filePath = event.payload.paths[0];
		try {
			// todo: hardcoded ignoring more than 1 file
			const contents = await readTextFile(filePath);
			LoadFile(contents, filePath);
		} catch (error) {
			const { name, extension } = await getFilenameParts(filePath);
			// alert();
			dialogError(`Can't load ${extension} files`);
		}
	} else {
		// File drop cancelled
	}
});
