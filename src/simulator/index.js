/**
 * Created by ghassaei on 2/22/17.
 */
import Model from "./model/index.js";
import DynamicSolver from "./dynamicSolver/index.js";
/**
 * @description Origami Simulator by Amanda Ghassaei.
 * refactored so that:
 * - encapsulate global variables to allow for multiple simultaneous instances
 * - ability to dealloc() and reinitialize, memory will properly free itself.
 * - rewrite in ES6 module format to work in popular JS frameworks.
 *
 * This will create an instance of an Origami Simulator, which is meant to
 * be created just after you create a ThreeJS canvas, so that this can
 * bind itself to the ThreeJS instance.
 * @param {object} props provide a pre-initialized three.js scene (THREE.Scene)
 */
const OrigamiSimulator = ({ scene, onCompute } = {}) => {
	const model = new Model({ scene });
	const solver = DynamicSolver();
	// the error from strain in the folding
	let error = 0;
	/**
	 * @description Fold the origami, between 0.0 and 1.0.
	 */
	let foldAmount = 0.0;
	const setFoldAmount = (value) => {
		const number = parseFloat(value);
		foldAmount = !Number.isNaN(number) ? number : 0.0;
		solver.setCreasePercent(foldAmount);
	};
	/**
	 * @description Override the material with the strain forces visualization.
	 */
	let strain = false;
	const setStrain = (value) => {
		strain = !!value;
		model.setStrain(strain);
	};
	/**
	 * @description Activate three.js shadows on the materials.
	 */
	let shadows = false;
	const setShadows = (newShadows) => {
		shadows = newShadows;
		model.frontMesh.castShadow = shadows;
		model.frontMesh.receiveShadow = shadows;
		// model.backMesh.castShadow = shadows;
		model.backMesh.receiveShadow = shadows;
	};
	/**
	 * @description When the user pulls on a node, call this method, it will
	 * relay the information to the solver
	 */
	const nodeDidMove = () => solver.nodeDidMove();
	/**
	 * @description One call to origami simulator's solver
	 */
	const compute = () => {
		// error is the global error in the folding of the model
		// not a computational error.
		error = solver.solve(100, { axialStrain: strain });
		model.needsUpdate();
		// reset single loop variables
	};
	/**
	 * @description Start a loop with window.requestAnimationFrame
	 * which will call the compute method on every frame.
	 */
	let computeLoopID;
	const computeLoop = () => {
		computeLoopID = window.requestAnimationFrame(computeLoop);
		compute();
		if (onCompute) { onCompute({ error }); }
	};
	/**
	 * @description Activate origami simulator's compute loop.
	 */
	let active = false;
	const setActive = (isActive) => {
		// no matter the new state, ensure that no loop is (already) running
		if (computeLoopID) {
			window.cancelAnimationFrame(computeLoopID);
			computeLoopID = undefined;
		}
		active = isActive;
		if (active) { computeLoop(); }
	};
	/**
	 * @description this load method can throw an error. wrap it in a try catch
	 * and deliver the error to the end user.
	 */
	const load = (fold) => {
		model.load(fold);
		solver.setModel(model, { creasePercent: foldAmount });
	};
	/**
	 * @description various solver settings
	 */
	const setIntegration = (value) => {
		solver.setIntegration(value);
	};
	const setAxialStiffness = (value) => {
		solver.setAxialStiffness(value);
		model.setAxialStiffness(value);
		solver.update();
	};
	const setFaceStiffness = (value) => {
		solver.setFaceStiffness(value);
		solver.update();
	};
	const setJoinStiffness = (value) => {
		model.setJoinStiffness(value);
		solver.update();
	};
	const setCreaseStiffness = (value) => {
		model.setCreaseStiffness(value);
		solver.update();
	};
	const setDampingRatio = (value) => {
		model.setDampingRatio(value);
		solver.update();
	};
	/**
	 * @description Reset the vertices of the model to their original position
	 */
	const reset = () => solver.reset();
	/**
	 * @description Stop the compute loop and free all associated memory
	 */
	const dealloc = () => {
		setActive(false);
		model.dealloc();
		solver.dealloc();
	};
	/**
	 * @description Origami Simulator
	 */
	const app = {
		load,
		export: () => model.export(),
		model,
		reset,
		setScene: (newScene) => model.setScene(newScene),
		setOnCompute: (handler) => { onCompute = handler; },
		dealloc,
		nodeDidMove,
		// solver settings
		setActive,
		setFoldAmount,
		setIntegration,
		setAxialStiffness,
		setFaceStiffness,
		setJoinStiffness,
		setCreaseStiffness,
		setDampingRatio,
		// style
		setStrain,
		setShadows,
		// materials
		getModel: () => model,
		getMaterials: () => model.materials,
		getLines: () => model.lines,
		setFrontColor: (color) => model.materials.front.color.set(color),
		setBackColor: (color) => model.materials.back.color.set(color),
		// set all line assignments to one color
		setLineColor: (...args) => model.setLineColor(...args),
		// line colors by assignment type
		setBoundaryColor: (...args) => model.setBoundaryColor(...args),
		setMountainColor: (...args) => model.setMountainColor(...args),
		setValleyColor: (...args) => model.setValleyColor(...args),
		setFlatColor: (...args) => model.setFlatColor(...args),
		setJoinColor: (...args) => model.setJoinColor(...args),
		setUnassignedColor: (...args) => model.setUnassignedColor(...args),
		// set the materials directly
		setMaterialFront: (material) => model.setMaterialFront(material),
		setMaterialBack: (material) => model.setMaterialBack(material),
		setMaterialStrain: (material) => model.setMaterialStrain(material),
		setMaterialLine: (material, assignments) => (
			model.setMaterialLine(material, assignments)
		),
	};
	// getters and setters
	Object.defineProperty(app, "active", { get: () => active, set: setActive });
	Object.defineProperty(app, "foldAmount", { get: () => foldAmount, set: setFoldAmount });
	Object.defineProperty(app, "strain", { get: () => strain, set: setStrain });
	Object.defineProperty(app, "shadows", { get: () => shadows, set: setShadows });
	Object.defineProperty(app, "materials", { get: () => model.materials });
	return app;
};

export default OrigamiSimulator;
