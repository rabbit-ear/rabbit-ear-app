/**
 * Created by amandaghassaei on 5/6/17.
 */
// const getTriangulatedFold = () => {
// 	const useTriangulated = globals.triangulateFOLDexport;
// 	const fold = globals.pattern.getFoldData(!useTriangulated);
// 	json.edges_vertices = fold.edges_vertices;
// 	const assignment = [];
// 	for (let i = 0; i < fold.edges_assignment.length; i += 1) {
// 		if (fold.edges_assignment[i] === "C") assignment.push("B");
// 		else assignment.push(fold.edges_assignment[i]);
// 	}
// 	json.edges_assignment = assignment;
// 	json.faces_vertices = fold.faces_vertices;
// };
/**
 * @description Merge the new computed vertices coordinates back into
 * the original FOLD graph, update the edges_foldAngle to their current
 * fold angle as well, and if the user chooses, replace the faces with
 * their triangulated counterparts, creating additional "J" (join) edges.
 * @param {object} fold a FOLD object, the original one loaded into the app.
 * @param {object} model the OrigamiSimulator Model object
 */
const exportFold = (model, foldUnmodified, foldTriangulated, { triangulated, angles } = {}) => {
	const verticesMatch = foldUnmodified.length === model.positions.length / 3;
	if (!verticesMatch) {
		triangulated = true;
		console.warn("vertex count mismatch. reverting to triangulated model");
	}
	// shallow copy is good enough for this purpose
	const FOLD = triangulated ? { ...foldTriangulated } : { ...foldUnmodified };
	FOLD.file_creator = "Origami Simulator: http://git.amandaghassaei.com/OrigamiSimulator/";
	FOLD.file_classes = ["singleModel"];
	FOLD.frame_classes = ["foldedForm"];
	FOLD.frame_attributes = ["3D"];
	FOLD.vertices_coords = FOLD.vertices_coords.map((_, i) => [
		model.positions[i * 3 + 0],
		model.positions[i * 3 + 1],
		model.positions[i * 3 + 2],
	]);
	// if (globals.exportFoldAngle) {
	// 	json.edges_foldAngle = fold.edges_foldAngle;
	// }
	return FOLD;
};

export default exportFold;
