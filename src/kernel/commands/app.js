import { get } from "svelte/store";
import {
	DialogNewFile,
	DialogNewFrame,
} from "../../stores/App.js";

export const resetApp = () => {
	get(DialogNewFile).close();
	get(DialogNewFrame).close();
};
