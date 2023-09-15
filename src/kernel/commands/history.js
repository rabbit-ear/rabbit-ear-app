import { FileHistory } from "../../stores/History.js";
/**
 *
 */
export const undo = () => FileHistory.undo();
/**
 *
 */
export const redo = () => FileHistory.redo();
