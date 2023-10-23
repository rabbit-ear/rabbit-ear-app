import { appWindow } from "@tauri-apps/api/window";
import {
	open,
	save as tauriSave,
} from "@tauri-apps/api/dialog";
import {
	readTextFile,
	writeTextFile as tauriWriteTextFile,
	writeBinaryFile as tauriWriteBinaryFile,
} from "@tauri-apps/api/fs";
import {
	FilePath,
	LoadFile,
	LoadFOLDFile,
} from "../stores/File.js";
/**
 *
 */
export const getFilenameParts = (filePath) => {
	let filename = filePath;
	try {
		filename = filePath.match(/[^/]*$/)[0];
	} catch (error) {}
	try {
		const [_, noExtension] = filePath.match(/(.*)\.[^.]+$/);
		const [__, extension] = filename.match(/[^\\]*\.(\w+)$/);
		const [___, name] = filename.match(/(.*)\.[^.]+$/);
		return { filename, name, extension, noExtension };
	} catch (error) {}
	return { filename, name: filename, extension: "", noExtension: filename };
};
/**
 *
 */
const makeNumberedFilenames = (count, noExtension, extension) => Array
	.from(Array(count))
	.map((_, i) => `0000${i}`)
	.map(str => str.slice(str.length - 4, str.length))
	.map(n => `${noExtension}-${n}.${extension}`);
/**
 *
 */
export const writeTextFile = async (string, ext = "svg") => {
	const filePath = await tauriSave({
		filters: [{
			name: "image",
			extensions: [ext],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	tauriWriteTextFile(`${noExtension}.${ext}`, string);
};
/**
 *
 */
export const writeBinaryFile = async (binaryFile, ext = "png") => {
	const filePath = await tauriSave({
		filters: [{
			name: "image",
			extensions: [ext],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	tauriWriteBinaryFile(`${noExtension}.${ext}`, binaryFile);
};
/**
 *
 */
export const writeTextFiles = async (textStrings = [], ext = "svg") => {
	const filePath = await tauriSave({
		filters: [{
			name: "image",
			extensions: [ext],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	makeNumberedFilenames(textStrings.length, noExtension, extension)
		.map((outPath, i) => tauriWriteTextFile(outPath, textStrings[i]));
};
/**
 *
 */
export const writeBinaryFiles = async (binaryFiles = [], ext = "png") => {
	const filePath = await tauriSave({
		filters: [{
			name: "image",
			extensions: [ext],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	makeNumberedFilenames(binaryFiles.length, noExtension, extension)
		.map((outPath, i) => tauriWriteBinaryFile(outPath, binaryFiles[i]));
};
/**
 *
 */
export const openFile = async () => {
	const selected = await open({
		multiple: false,
		filters: [{
			name: "FOLD",
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
 *
 */
export const save = async (contents, filePath) => {
	// this does not check if the file exists.
	// if file does not yet exist, you should call "SaveAs"
	await tauriWriteTextFile(filePath, contents);
};
/**
 *
 */
export const saveAs = async (contents, defaultPath) => {
	const filePath = await tauriSave({
		defaultPath,
		filters: [{
			name: "FOLD",
			extensions: ["fold"],
		}]
	});
	if (filePath == null) { return; }
	await tauriWriteTextFile(filePath, contents);
	FilePath.set(filePath);
};
/**
 *
 */
export const importFile = async () => {
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
