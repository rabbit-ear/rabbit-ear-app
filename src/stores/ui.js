import { writable } from "svelte/store";

// data stores
// prefer if you do not write to these directly, use event handlers below.

// a hash lookup of every keyboard key currently being pressed
// where the dictionary keys are the ______ (key characters?)
export const keyboard = writable({});

// every touch input
export const presses = writable([]); // {number[][]} array of points
export const moves = writable([]); // {number[][]} array of points
export const releases = writable([]); // {number[][]} array of points
export const current = writable(undefined); // {number[]} point

// event handlers
// these should be called, these will modify the data stores above.

// touchpad or mouse
export const onPress = (e) => {};
export const onRelease = (e) => {};
export const onMove = (e) => {};

// keyboard
export const onKeyDown = (e) => {
	switch (e.keyCode) {
	// return key
	case 13: exec(e.target.value); break;
	default: break;
	}
};

export const onKeyUp = (e) => {};
