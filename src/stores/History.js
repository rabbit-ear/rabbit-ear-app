import { writable } from "svelte/store";

export const TerminalHistory = writable([]);
export const GraphHistory = writable([]);

const { subscribe, set, update } = writable([]);

export const History = {};
