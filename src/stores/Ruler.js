import { writable, get } from "svelte/store";
import { RulersAutoClear } from "./App.js";

const { subscribe, set, update } = writable([]);

export const Rulers = writable([]);

Rulers.add = (newRulers) => Rulers.update((r) => get(RulersAutoClear)
	? [...newRulers]
	: [...r, ...newRulers]);

export const RulerPreviews = writable([]);

RulerPreviews.add = (newRulers) => RulerPreviews.update((r) => [...r, ...newRulers]);
