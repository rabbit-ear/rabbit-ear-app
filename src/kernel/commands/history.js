import { CommandHistory } from "../../stores/History.js";
/**
 * @description Perhaps the strangest commands of all.
 * the undoHistory is not a core part of the app, rather,
 * a modifier. The undoHistory modifier watches the terminal
 * feed for the presence of an "undo()" or "redo()" string,
 * hence, all we need is to print these to the terminal and
 * the modifier will run the logic. These methods don't need
 * to contain any logic themselves.
 * Hopefully, this is a rare exception which never really happens
 * because most modifiers are optional, and will not make their
 * way into the the core functionality (ie: not be called by execute()).
 */
export const undo = () => {};
// todo: print: "end of history"

export const redo = () => {};

export const clearHistory = () => CommandHistory.set([]);
