import { get } from "svelte/store";
import {
	DialogNewFile,
	DialogNewFrame,
} from "../../stores/App.js";

export const resetApp = () => {
	[get(DialogNewFile), get(DialogNewFrame)]
		.filter(a => a !== undefined)
		.forEach(dialog => dialog.close());
};
