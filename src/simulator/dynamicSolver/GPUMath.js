/**
 * Created by ghassaei on 2/24/16.
 */

// import GLBoilerPlate from "./GLBoilerplate";
import {
	createProgramFromSource,
	loadVertexData,
	makeTexture,
} from "./GLBoilerplate.js";

const initialize = (canvas) => {
	// const gl2 = canvas.getContext("webgl2", { antialias: false });
	// if (gl2) { return { gl: gl2, version: 2 }; }
	const gl1 = canvas.getContext("webgl", { antialias: false });
	if (gl1) { return { gl: gl1, version: 1 }; }
	return { gl: undefined, version: undefined };
	// const gl = canvas.getContext("webgl", { antialias: false })
	// 	|| canvas.getContext("experimental-webgl", { antialias: false });
};

function notSupported() {
	console.warn("floating point textures are not supported on your system");
}

function initGPUMath() {
	// const glBoilerplate = GLBoilerPlate();

	const canvas = window.document.createElement("canvas");
	canvas.setAttribute("style", "display:none;");
	canvas.setAttribute("class", "gpuMathCanvas");
	window.document.body.appendChild(canvas);
	const { gl, version } = initialize(canvas);
	console.log(`initializing webgl version ${version}`);
	if (version === 1) {
		if (!gl.getExtension("OES_texture_float")) { notSupported(); }
	}

	gl.disable(gl.DEPTH_TEST);

	// const maxTexturesInFragmentShader = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	// console.log(`${maxTexturesInFragmentShader} textures max`);

	function GPUMath() {
		this.programs = {};
		this.frameBuffers = {};
		this.textures = {};
		this.index = 0;
	}

	GPUMath.prototype.createProgram = function (programName, vertexShader, fragmentShader) {
		const programs = this.programs;
		let program = programs[programName];
		if (program) {
			gl.useProgram(program.program);
			// console.warn("already a program with the name " + programName);
			return;
		}
		program = createProgramFromSource(gl, vertexShader, fragmentShader);
		gl.useProgram(program);
		loadVertexData(gl, program);
		programs[programName] = {
			program,
			uniforms: {},
		};
	};

	GPUMath.prototype.initTextureFromData = function (
		name,
		width,
		height,
		typeName,
		data,
		shouldReplace,
	) {
		let texture = this.textures[name];

		if (texture) {
			if (!shouldReplace) {
				console.warn(`already a texture with the name ${name}`);
				return;
			}
			gl.deleteTexture(texture);
		}
		texture = makeTexture(gl, width, height, gl[typeName], data);
		this.textures[name] = texture;
	};

	GPUMath.prototype.initFrameBufferForTexture = function (textureName, shouldReplace) {
		let framebuffer = this.frameBuffers[textureName];
		if (framebuffer) {
			if (!shouldReplace) {
				console.warn(`framebuffer already exists for texture ${textureName}`);
				return;
			}
			gl.deleteFramebuffer(framebuffer);
		}
		const texture = this.textures[textureName];
		if (!texture) {
			console.warn(`texture ${textureName} does not exist`);
			return;
		}

		framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

		// not sure what to do with this line, but it suppresses a
		// warning having to do with checkFramebufferStatus
		gl.getExtension("WEBGL_color_buffer_float");
		const check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (check !== gl.FRAMEBUFFER_COMPLETE) {
			notSupported();
		}

		this.frameBuffers[textureName] = framebuffer;
	};

	GPUMath.prototype.setUniformForProgram = function (programName, name, val, type) {
		if (!this.programs[programName]) {
			console.log(programName, this.programs, this.programs[programName]);
			console.warn(`no program with name ${programName}`);
			return;
		}
		const uniforms = this.programs[programName].uniforms;
		let location = uniforms[name];
		if (!location) {
			location = gl.getUniformLocation(this.programs[programName].program, name);
			uniforms[name] = location;
		}
		if (type === "1f") gl.uniform1f(location, val);
		else if (type === "2f") gl.uniform2f(location, val[0], val[1]);
		else if (type === "3f") gl.uniform3f(location, val[0], val[1], val[2]);
		else if (type === "1i") gl.uniform1i(location, val);
		else {
			console.warn(`no uniform for type ${type}`);
		}
	};

	GPUMath.prototype.setSize = function (width, height) {
		gl.viewport(0, 0, width, height);
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
	};

	GPUMath.prototype.setProgram = function (programName) {
		const program = this.programs[programName];
		if (program) gl.useProgram(program.program);
	};

	GPUMath.prototype.step = function (programName, inputTextures, outputTexture, time) {
		gl.useProgram(this.programs[programName].program);
		if (time) this.setUniformForProgram(programName, "u_time", time, "1f");
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[outputTexture]);
		for (let i = 0; i < inputTextures.length; i += 1) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, this.textures[inputTextures[i]]);
		}
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw to framebuffer
	};

	GPUMath.prototype.swapTextures = function (texture1Name, texture2Name) {
		let temp = this.textures[texture1Name];
		this.textures[texture1Name] = this.textures[texture2Name];
		this.textures[texture2Name] = temp;
		temp = this.frameBuffers[texture1Name];
		this.frameBuffers[texture1Name] = this.frameBuffers[texture2Name];
		this.frameBuffers[texture2Name] = temp;
	};

	GPUMath.prototype.swap3Textures = function (texture1Name, texture2Name, texture3Name) {
		let temp = this.textures[texture3Name];
		this.textures[texture3Name] = this.textures[texture2Name];
		this.textures[texture2Name] = this.textures[texture1Name];
		this.textures[texture1Name] = temp;
		temp = this.frameBuffers[texture3Name];
		this.frameBuffers[texture3Name] = this.frameBuffers[texture2Name];
		this.frameBuffers[texture2Name] = this.frameBuffers[texture1Name];
		this.frameBuffers[texture1Name] = temp;
	};

	GPUMath.prototype.readyToRead = function () {
		return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
	};

	GPUMath.prototype.readPixels = function (xMin, yMin, width, height, array) {
		gl.readPixels(xMin, yMin, width, height, gl.RGBA, gl.UNSIGNED_BYTE, array);
	};

	GPUMath.prototype.dealloc = function () {
		Object.values(this.programs).map(el => el.program).forEach(prog => gl.deleteProgram(prog));
		Object.values(this.frameBuffers).forEach(buf => gl.deleteFramebuffer(buf));
		Object.values(this.textures).forEach(texture => gl.deleteTexture(texture));
		this.programs = {};
		this.frameBuffers = {};
		this.textures = {};
		this.setSize(1, 1);
		window.document.body.removeChild(canvas);

		// var buf = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		// var numAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
		// for (var attrib = 0; attrib < numAttributes; ++attrib) {
		//   gl.vertexAttribPointer(attrib, 1, gl.FLOAT, false, 0, 0);
		// }
	};

	return new GPUMath();
}

export default initGPUMath;
