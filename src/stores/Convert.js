import {
	get,
	writable,
	derived,
} from "svelte/store";
import {
	Frames,
	IsolatedFrame,
	IsolatedFrames,
} from "./Model.js";
import foldToSvg from "rabbit-ear/convert/foldToSvg/index.js";
import {
	save,
} from "@tauri-apps/api/dialog";
import {
	getFilenameParts,
	makeNumberedFilenames,
} from "../js/file.js";
import {
	readTextFile,
	writeTextFile,
	writeBinaryFile,
	BaseDirectory,
} from "@tauri-apps/api/fs";
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
/**
 *
 */
export const WriteTextFile = async (string, ext = "svg") => {
	const filePath = await save({
		filters: [{
			name: "image",
			extensions: [ext],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	writeTextFile(`${noExtension}.${ext}`, string);
};
/**
 *
 */
export const WriteBinaryFile = async (binaryFile, ext = "png") => {
	const filePath = await save({
		filters: [{
			name: "image",
			extensions: [ext],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	writeBinaryFile(`${noExtension}.${ext}`, binaryFile);
};
/**
 *
 */
export const WriteTextFiles = async (textStrings = [], ext = "svg") => {
	const filePath = await save({
		filters: [{
			name: "image",
			extensions: [ext],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	makeNumberedFilenames(textStrings.length, noExtension, extension)
		.map((outPath, i) => writeTextFile(outPath, textStrings[i]));
};
/**
 *
 */
export const WriteBinaryFiles = async (binaryFiles = [], ext = "png") => {
	const filePath = await save({
		filters: [{
			name: "image",
			extensions: [ext],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	makeNumberedFilenames(binaryFiles.length, noExtension, extension)
		.map((outPath, i) => writeBinaryFile(outPath, binaryFiles[i]));
};
