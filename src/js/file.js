import execute from "../kernel/execute.js";
/**
 * this can be expanded to include different file types.
 */
export const tryLoadFile = (contents, filename, options) => {
	// const { name, extension } = getFilenameParts(contents, filename);
	execute("load", JSON.parse(contents));
};
/**
 *
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
