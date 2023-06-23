/**
 * @description Get an axis-aligned bounding box that encloses FOLD vertices.
 * the optional padding is used to make the bounding box inclusive / exclusive
 * by adding padding on all sides, or inset in the case of negative number.
 * (positive=inclusive boundary, negative=exclusive boundary)
 */
const boundingBox = ({ vertices_coords }, padding = 0) => {
	if (!vertices_coords || !vertices_coords.length) { return undefined; }
	const min = Array(vertices_coords[0].length).fill(Infinity);
	const max = Array(vertices_coords[0].length).fill(-Infinity);
	vertices_coords.forEach(point => point
		.forEach((c, i) => {
			if (c < min[i]) { min[i] = c - padding; }
			if (c > max[i]) { max[i] = c + padding; }
		}));
	const span = max.map((m, i) => m - min[i]);
	return { min, max, span };
};

export default boundingBox;
