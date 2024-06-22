import { executeCommand } from "../kernel/execute.js";
// import { ExportModel } from "../stores/Simulator.js";
/**
 * @description Bind this method to the <input type="file"> element.
 */
export const loadFileDialog = (event) => {
	let filename = "";
	event.stopPropagation();
	event.preventDefault();
	// file reader and its callbacks
	const reader = new FileReader();
	reader.onerror = (error) => console.warn("FileReader error", error);
	reader.onabort = (abort) => console.warn("FileReader abort", abort);
	reader.onload = (e) => {
		try {
			// todo: does "filename" contain the path as well? it should.
			executeCommand("newFile", JSON.parse(e.target.result));
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
export const saveSimulatorToFoldFile = (graph) => {
	// const FOLD = get(ExportModel)();
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
