import {
	get,
	writable,
	derived,
} from "svelte/store";
import {
	Frames,
	IsolatedFrames,
} from "./Model.js";
import foldToSvg from "rabbit-ear/convert/foldToSvg/index.js";
import {
	save,
} from "@tauri-apps/api/dialog";
import {
	getFilenameParts,
} from "../js/file.js";
import {
	readTextFile,
	writeTextFile,
	BaseDirectory,
} from "@tauri-apps/api/fs";

/**
 *
 */
export const FramesToSVGs = () => {
	const options = { string: true };
	const frames = get(IsolatedFrames);
	return frames.map(fold => foldToSvg(fold, options));
};

export const FramesToPNGs = () => {

};

export const FramesToJPGs = () => {

};

export const WriteSVGFiles = async (svgStrings = []) => {
	const ext = "svg";
	const filePath = await save({
		filters: [{
			name: "image",
			extensions: ["svg"],
		}]
	});
	if (filePath == null) { return; }
	const { filename, name, extension, noExtension } = getFilenameParts(filePath);
	svgStrings
		.map((_, i) => `0000${i}`)
		.map(str => str.slice(str.length - 4, str.length))
		.map(n => `${noExtension}-${n}.${ext}`)
		.map((outPath, i) => writeTextFile(outPath, svgStrings[i]));
	// console.log("filePath", filePath);
};
