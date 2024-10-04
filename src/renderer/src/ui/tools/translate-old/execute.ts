import { model } from "../../stores/model.svelte.ts";

export default (vector: [number, number]) => {
	model.shapes.forEach((shape) => {
		if (shape.name === "circle") {
			shape.params.cx += vector[0];
			shape.params.cy += vector[1];
		}
	});
};
