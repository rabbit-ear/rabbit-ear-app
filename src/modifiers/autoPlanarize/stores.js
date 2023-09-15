import { writable } from "svelte/store";

export const PlanarizeMethods = writable({
	"snapAllVertices": true,
	"segment": true,
	"translate": true,
	"translateVertices": true,
	"deleteComponents": true,
	"foldedLine": true,
});
