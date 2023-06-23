import * as THREE from "three";
/**
 * @description Get the center of the bounding box of the model.
 */
const modelCenter = (model) => {
	model.geometry.computeBoundingBox();
	const center = new THREE.Vector3();
	model.geometry.boundingBox.getCenter(center);
	return center;
};
/**
 * @description Get the average of all points, not the
 * center of the bounding box.
 */
// const modelCenter = (model) => {
// 	const avg = [0, 0, 0];
// 	for (let i = 0; i < model.positions.length; i += 3) {
// 		avg[0] += model.positions[i + 0];
// 		avg[1] += model.positions[i + 1];
// 		avg[2] += model.positions[i + 2];
// 	}
// 	const avgPosition = new THREE.Vector3(...avg);
// 	avgPosition.multiplyScalar(3 / model.positions.length);
// 	return avgPosition;
// };

export default modelCenter;
