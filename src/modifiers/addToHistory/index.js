import { get } from "svelte/store";
import { AddToHistoryMethods } from "./stores.js";
import { callIfNotIncluded } from "../general.js";
import { FileHistory } from "../../stores/History.js";

export const addToHistory = (commands = []) => {
	if (callIfNotIncluded(commands, get(AddToHistoryMethods))) {
		FileHistory.cache();
	}
};
