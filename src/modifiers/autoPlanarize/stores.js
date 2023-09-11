import { writable } from "svelte/store";

export const PlanarizeMethods = writable({
	"snapAllVertices": true,
	"addEdge": true,
	"translate": true,
	"translateVertices": true,
	"deleteComponents": true,
	"repeatFoldLine": true,
});
