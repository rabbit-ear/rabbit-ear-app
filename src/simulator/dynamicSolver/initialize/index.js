import initArrays from "./initArrays.js";
import fillArrays from "./fillArrays.js";
import initGPU from "./initGPU.js";

const calcDt = (model) => {
	let maxFreqNat = 0;
	model.edges.forEach((beam) => {
		if (beam.getNaturalFrequency() > maxFreqNat) {
			maxFreqNat = beam.getNaturalFrequency();
		}
	});
	// 0.9 of max delta t for good measure
	return (1 / (2 * Math.PI * maxFreqNat)) * 0.9;
};

const setSolveParams = (gpuMath, model) => {
	const dt = calcDt(model);
	// $("#deltaT").html(dt);
	gpuMath.setProgram("thetaCalc");
	gpuMath.setUniformForProgram("thetaCalc", "u_dt", dt, "1f");
	gpuMath.setProgram("velocityCalc");
	gpuMath.setUniformForProgram("velocityCalc", "u_dt", dt, "1f");
	gpuMath.setProgram("positionCalcVerlet");
	gpuMath.setUniformForProgram("positionCalcVerlet", "u_dt", dt, "1f");
	gpuMath.setProgram("positionCalc");
	gpuMath.setUniformForProgram("positionCalc", "u_dt", dt, "1f");
	gpuMath.setProgram("velocityCalcVerlet");
	gpuMath.setUniformForProgram("velocityCalcVerlet", "u_dt", dt, "1f");
	// options.controls.setDeltaT(dt);
};

const initialize = (gpuMath, model, options) => {
	const arrays = initArrays(gpuMath, model);
	const moreArrays = fillArrays(gpuMath, model, arrays);
	initGPU(gpuMath, arrays, options);
	setSolveParams(gpuMath, model);
	return { ...arrays, ...moreArrays };
};

export default initialize;
