import {
	Frames,
	FrameIndex,
	UpdateFrame,
	IsoUpdateFrame,
	SetFrame,
	LoadFile,
	SaveFile,
} from "../../stores/Model.js";
import { makeEmptyGraph } from "../../js/graph.js";
/**
 * @param {string} contents already in a string format
 * @param {string} filename
 */
const downloadFile = (contents, filename = "origami.fold") => {
	const element = document.createElement("a");
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(contents));
	element.setAttribute("download", filename);
	element.style.display = "none";
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
};

export const load = (FOLD = {}) => LoadFile(FOLD);

export const clear = () => LoadFile(makeEmptyGraph());

export const download = (filename) => (
	downloadFile(JSON.stringify(SaveFile()), filename)
);
