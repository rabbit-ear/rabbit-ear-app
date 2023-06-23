/**
 * Created by amandaghassaei on 2/25/17.
 */

import * as THREE from "three";
// import numeric from "numeric";

const multiply_vector2_matrix2 = function (vector, matrix) {
	return [
		vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
		vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5],
	];
};

function applyTransformation(vertex, transformations) {
	if (transformations === undefined) { return; }
	transformations = transformations.baseVal;
	for (let i = 0; i < transformations.length; i += 1) {
		const t = transformations[i];
		// const M = [[t.matrix.a, t.matrix.c, t.matrix.e],
		//   [t.matrix.b, t.matrix.d, t.matrix.f], [0, 0, 1]];
		// const out = numeric.dot(M, [vertex.x, vertex.z, 1]);
		// vertex.x = out[0];
		// vertex.z = out[1];
		const m = t.matrix;
		const out = multiply_vector2_matrix2(
			[vertex.x, vertex.z],
			[m.a, m.b, m.c, m.d, m.e, m.f]
		);
		[vertex.x, vertex.z] = out;
	}
}


// function applyTransformation(vertex, transformations) {
//   if (transformations == undefined) return;
//   transformations = transformations.baseVal;
//   for (let i = 0; i < transformations.length; i += 1) {
//     const t = transformations[i];
//     const M = [[t.matrix.a, t.matrix.c, t.matrix.e], [t.matrix.b, t.matrix.d, t.matrix.f], [0,0,1]];
//     const out = numeric.dot(M, [vertex.x, vertex.z, 1]);
//     vertex.x = out[0];
//     vertex.z = out[1];
//   }
// }


function parsePath(_verticesRaw, _segmentsRaw, $elements) {
	for (let i = 0; i < $elements.length; i += 1) {
		let path = $elements[i];
		let pathVertices = [];
		if (path === undefined || path.getPathData === undefined) {//mobile problem
			// let elm = '<div id="coverImg" ' +
			//   'style="background: url(assets/doc/crane.gif) no-repeat center center fixed;' +
			//   '-webkit-background-size: cover;' +
			//   '-moz-background-size: cover;' +
			//   '-o-background-size: cover;' +
			//   'background-size: cover;">'+
			//   '</div>';
			// $(elm).appendTo($("body"));
			// $("#noSupportModal").modal("show");
			console.warn("path parser not supported");
			return;
		}
		const segments = path.getPathData();
		for (let j = 0; j < segments.length; j += 1) {
			const segment = segments[j];
			const { type } = segment;
			let vertex;
			switch (type) {
			case "m": // dx, dy
				if (j === 0) { //problem with inkscape files
					vertex = new THREE.Vector3(segment.values[0], 0, segment.values[1]);
				} else {
					vertex = _verticesRaw[_verticesRaw.length-1].clone();
					vertex.x += segment.values[0];
					vertex.z += segment.values[1];
				}
				_verticesRaw.push(vertex);
				pathVertices.push(vertex);
				break;

			case "l": // dx, dy
				_segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length]);
				if (path.targetAngle && _segmentsRaw.length>0) _segmentsRaw[_segmentsRaw.length-1].push(path.targetAngle);
				vertex = _verticesRaw[_verticesRaw.length-1].clone();
				vertex.x += segment.values[0];
				vertex.z += segment.values[1];
				_verticesRaw.push(vertex);
				pathVertices.push(vertex);
				break;

			case "v": // dy
				_segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length]);
				if (path.targetAngle && _segmentsRaw.length>0) _segmentsRaw[_segmentsRaw.length-1].push(path.targetAngle);
				vertex = _verticesRaw[_verticesRaw.length-1].clone();
				vertex.z += segment.values[0];
				_verticesRaw.push(vertex);
				pathVertices.push(vertex);
				break;

			case "h": // dx
				_segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length]);
				if (path.targetAngle && _segmentsRaw.length>0) _segmentsRaw[_segmentsRaw.length-1].push(path.targetAngle);
				vertex = _verticesRaw[_verticesRaw.length-1].clone();
				vertex.x += segment.values[0];
				_verticesRaw.push(vertex);
				pathVertices.push(vertex);
				break;

			case "M": // x, y
				vertex = new THREE.Vector3(segment.values[0], 0, segment.values[1]);
				_verticesRaw.push(vertex);
				pathVertices.push(vertex);
				break;

			case "L": // x, y
				_segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length]);
				if (path.targetAngle && _segmentsRaw.length>0) _segmentsRaw[_segmentsRaw.length-1].push(path.targetAngle);
				_verticesRaw.push(new THREE.Vector3(segment.values[0], 0, segment.values[1]));
				pathVertices.push(vertex);
				break;

			case "V": // y
				_segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length]);
				if (path.targetAngle && _segmentsRaw.length>0) _segmentsRaw[_segmentsRaw.length-1].push(path.targetAngle);
				vertex = _verticesRaw[_verticesRaw.length-1].clone();
				vertex.z = segment.values[0];
				_verticesRaw.push(vertex);
				pathVertices.push(vertex);
				break;

			case "H": // x
				_segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length]);
				if (path.targetAngle && _segmentsRaw.length>0) _segmentsRaw[_segmentsRaw.length-1].push(path.targetAngle);
				vertex = _verticesRaw[_verticesRaw.length-1].clone();
				vertex.x = segment.values[0];
				_verticesRaw.push(vertex);
				pathVertices.push(vertex);
				break;
			default: break;
			}
		}
		for (var j=0;j<pathVertices.length;j++) {
			applyTransformation(pathVertices[j], path.transform);
		}
	}
}

function parseLine(_verticesRaw, _segmentsRaw, $elements) {
	for (var i=0;i<$elements.length;i++) {
		var element = $elements[i];
		_verticesRaw.push(new THREE.Vector3(element.x1.baseVal.value, 0, element.y1.baseVal.value));
		_verticesRaw.push(new THREE.Vector3(element.x2.baseVal.value, 0, element.y2.baseVal.value));
		_segmentsRaw.push([_verticesRaw.length-2, _verticesRaw.length-1]);
		if (element.targetAngle) _segmentsRaw[_segmentsRaw.length-1].push(element.targetAngle);
		applyTransformation(_verticesRaw[_verticesRaw.length-2], element.transform);
		applyTransformation(_verticesRaw[_verticesRaw.length-1], element.transform);
	}
}

function parseRect(_verticesRaw, _segmentsRaw, $elements) {
	for (var i=0;i<$elements.length;i++) {
		var element = $elements[i];
		var x = element.x.baseVal.value;
		var y = element.y.baseVal.value;
		var width = element.width.baseVal.value;
		var height = element.height.baseVal.value;
		_verticesRaw.push(new THREE.Vector3(x, 0, y));
		_verticesRaw.push(new THREE.Vector3(x+width, 0, y));
		_verticesRaw.push(new THREE.Vector3(x+width, 0, y+height));
		_verticesRaw.push(new THREE.Vector3(x, 0, y+height));
		_segmentsRaw.push([_verticesRaw.length-4, _verticesRaw.length-3]);
		_segmentsRaw.push([_verticesRaw.length-3, _verticesRaw.length-2]);
		_segmentsRaw.push([_verticesRaw.length-2, _verticesRaw.length-1]);
		_segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length-4]);
		for (var j=1;j<=4;j++) {
			if (element.targetAngle) _segmentsRaw[_segmentsRaw.length-j].push(element.targetAngle);
			applyTransformation(_verticesRaw[_verticesRaw.length-j], element.transform);
		}
	}
}

function parsePolygon(_verticesRaw, _segmentsRaw, $elements) {
	for (var i=0;i<$elements.length;i++) {
		var element = $elements[i];
		for (var j=0;j<element.points.length;j++) {
			_verticesRaw.push(new THREE.Vector3(element.points[j].x, 0, element.points[j].y));
			applyTransformation(_verticesRaw[_verticesRaw.length-1], element.transform);

			if (j<element.points.length-1) _segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length]);
			else _segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length-element.points.length]);

			if (element.targetAngle) _segmentsRaw[_segmentsRaw.length-1].push(element.targetAngle);
		}
	}
}

function parsePolyline(_verticesRaw, _segmentsRaw, $elements) {
	for (var i=0;i<$elements.length;i++) {
		var element = $elements[i];
		for (var j=0;j<element.points.length;j++) {
			_verticesRaw.push(new THREE.Vector3(element.points[j].x, 0, element.points[j].y));
			applyTransformation(_verticesRaw[_verticesRaw.length-1], element.transform);
			if (j>0) _segmentsRaw.push([_verticesRaw.length-1, _verticesRaw.length-2]);
			if (element.targetAngle) _segmentsRaw[_segmentsRaw.length-1].push(element.targetAngle);
		}
	}
}

export {
	parsePath,
	parseLine,
	parseRect,
	parsePolygon,
	parsePolyline,
};
