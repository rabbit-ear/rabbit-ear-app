import { get } from "svelte/store";
import { UndoHistoryAvoidCommands } from "./stores.js";
import { callIfNotIncluded } from "../general.js";
import { FileHistory } from "../../stores/History.js";

export const undoHistory = (commands = []) => {
	if (callIfNotIncluded(commands, get(UndoHistoryAvoidCommands))) {
		FileHistory.cache();
	}
};
