import { message } from "@tauri-apps/api/dialog";

// title: <string>
// okLabel: <string>
// type: "info" | "warning" | "error"

export const dialogMessage = async (text, title, okLabel) => {
	const options = { type: "info" };
	if (title) {
		options.title = title;
	}
	if (okLabel) {
		options.okLabel = okLabel;
	}
	await message(text, options);
};

export const dialogWarning = async (text, title, okLabel) => {
	const options = { type: "warning" };
	if (title) {
		options.title = title;
	}
	if (okLabel) {
		options.okLabel = okLabel;
	}
	await message(text, options);
};

export const dialogError = async (text, title, okLabel) => {
	const options = { type: "error" };
	if (title) {
		options.title = title;
	}
	if (okLabel) {
		options.okLabel = okLabel;
	}
	await message(text, options);
};
