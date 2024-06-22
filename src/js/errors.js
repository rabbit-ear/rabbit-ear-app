import { distance2 } from "rabbit-ear/math/vector.js";
/**
 * @description compare every vertex against each other to find
 * the nearest two vertices. n^2 algorithm.
 */
export const nearestTwoVertices = ({ vertices_coords }) => {
	const nearest = [0, 1];
	let distance = Infinity;
	if (vertices_coords.length < 2) {
		return undefined;
	}
	for (let i = 0; i < vertices_coords.length - 1; i += 1) {
		for (let j = i + 1; j < vertices_coords.length; j += 1) {
			const dist = distance2(vertices_coords[i], vertices_coords[j]);
			if (dist < distance) {
				distance = dist;
				nearest[0] = i;
				nearest[1] = j;
			}
		}
	}
	return nearest;
};
