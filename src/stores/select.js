import { writable } from "svelte/store";

export const emptySelectObject = () => (
	{ vertices: [], edges: [], faces: [] }
);

export const selectionRect = writable(undefined);

const {
	subscribe: subscribeSelected,
	set: setSelected,
} = writable(emptySelectObject());

export const selected = {
	subscribe: subscribeSelected,
	set: (g) => setSelected(g),
	reset: () => setSelected(emptySelectObject()),
};
