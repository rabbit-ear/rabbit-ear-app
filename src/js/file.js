import { get } from "svelte/store";
import { executeCommand } from "../kernel/execute.js";
import { ExportModel } from "../stores/Simulator.js";
import {
	xmlStringToElement,
	flattenDomTreeWithStyle,
} from "rabbit-ear/svg/general/dom.js";
import svgToFold from "rabbit-ear/convert/svgToFold/index.js";
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
 * @param {string} contents the file contents as a string
 * @param {string} filename the name of the file hopefully with an extension
 * @param {object}
 */
// export const tryLoadFile = (contents, filePath, options) => {
// 	const { filename, name, extension } = getFilenameParts(filePath);
// 	console.log("filename", filename);
// 	console.log("name", name);
// 	console.log("extension", extension);
// 	return;
// 	let fold, edgeGraph;
// 	switch (extension.toLowerCase()) {
// 	case "fold":
// 		// fold = JSON.parse(contents);
// 		// uploadData.set({ contents, name, extension, fold });
// 		// FOLD.set(fold);
// 		// frameIndex.set(0);
// 		// fileCanDownload.set(false);
// 		break;
// 	case "obj":
// 		fold = objToFold(contents);
// 		uploadData.set({ contents, name, extension, fold });
// 		FOLD.set(fold);
// 		frameIndex.set(0);
// 		fileCanDownload.set(true);
// 		return {
// 			filename,
// 			name,
// 			extension,
// 		}
// 		break;
// 	case "svg":
// 		const svg = xmlStringToElement(contents, "image/svg+xml");
// 		const segments = svgToFold.svgSegments(svg);
// 		edgeGraph = svgToFold.svgEdgeGraph(svg);
// 		uploadData.set({
// 			contents,
// 			name,
// 			extension,
// 			fold: undefined,
// 			edgeGraph,
// 			boundingBox: boundingBox(edgeGraph),
// 			svg,
// 			options: {
// 				epsilon: shortestEdgeLength(edgeGraph) / 24,
// 				// epsilon: getNthPercentileEdgeLength(edgeGraph, 0.05) * 0.1,
// 				boundary: true,
// 				assignments: makeAssignments(segments),
// 				yFlip: false,
// 			},
// 		});
// 		break;
// 	case "opx":
// 		edgeGraph = opxToFold.opxEdgeGraph(contents);
// 		uploadData.set({
// 			contents,
// 			name,
// 			extension,
// 			fold: undefined,
// 			edgeGraph,
// 			boundingBox: boundingBox(edgeGraph),
// 			options: {
// 				// epsilon: getNthPercentileEdgeLength(edgeGraph, 0.05) * 0.1,
// 				epsilon: shortestEdgeLength(edgeGraph) / 24,
// 				yFlip: false,
// 			},
// 		});
// 		break;
// 	case "":
// 		console.warn("unknown file type");
// 		break;
// 	default: break;
// 	}
// };

/**
 * this can be expanded to include different file types.
 */
export const tryLoadFile = (contents, filename, options) => {
	// const { name, extension } = getFilenameParts(contents, filename);
	try {
		executeCommand("newFile", JSON.parse(contents));
	} catch (error) {
		console.warn(error);
	}
};
/**
 * @description Bind this method to the <input type="file"> element.
 */
export const loadFileDialog = (event) => {
	let filename = "";
	event.stopPropagation();
	event.preventDefault();
	// file reader and its callbacks
	const reader = new FileReader();
	reader.onerror = error => console.warn("FileReader error", error);
	reader.onabort = abort => console.warn("FileReader abort", abort);
	reader.onload = (e) => {
		try {
			// todo: does "filename" contain the path as well? it should.
			tryLoadFile(e.target.result, filename);
		} catch (error) {
			console.error(error);
		}
	};
	if (event.target.files.length) {
		// cache "filename" so it can be used later inside the onload function
		filename = event.target.files[0].name;
		return reader.readAsText(event.target.files[0]);
	}
	console.warn("FileReader no file selected");
};
/**
 * @description Capture the current state of the simulator
 * and store it..... TODO.
 */
export const saveSimulatorToFoldFile = () => {
	const FOLD = get(ExportModel)();
	const a = document.createElement("a");
	a.style = "display: none";
	document.body.appendChild(a);
	const blob = new Blob([JSON.stringify(FOLD)], { type: "octet/stream" });
	const url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = "origami.fold";
	a.click();
	window.URL.revokeObjectURL(url);
};
