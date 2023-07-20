import { writable } from "svelte/store";

const { subscribe, set, update } = writable([]);

export const Rulers = writable([]);

Rulers.add = (newRulers) => Rulers.update((r) => [...r, ...newRulers]);

export const RulerPreviews = writable([]);

RulerPreviews.add = (newRulers) => RulerPreviews.update((r) => [...r, ...newRulers]);
