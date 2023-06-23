/**
 * Created by amandaghassaei on 2/25/17.
 */

import * as THREE from "three";
import FOLD from "fold";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import {
	borderFilter,
	mountainFilter,
	valleyFilter,
	cutFilter,
	triangulationFilter,
	hingeFilter
} from "./EdgeFilter";

import {
	parsePath,
	parseLine,
	parseRect,
	parsePolygon,
	parsePolyline,
} from "./parse";

import removeRedundantVertices from "./removeRedundantVertices";

import processFold from "./prepareFOLD";

const SVGloader = new SVGLoader();

const makeVector2 = v => new THREE.Vector2(v[0], v[1]);
const makeVector3 = v => new THREE.Vector3(v[0], v[1], v[2]);
const makeVector = v => (v.length === 2)
	? makeVector2(v)
	: makeVector3(v);

const emptyFOLD = () => ({
	vertices_coords: [],
	edges_vertices: [],
	// B = boundary, M = mountain, V = valley, C = cut, F = facet, U = hinge
	edges_assignment: [],
	edges_foldAngle: [], // target angles
});

function colorForAssignment(assignment) {
	if (assignment === "B") return "#000"; // border
	if (assignment === "M") return "#f00"; // mountain
	if (assignment === "V") return "#00f"; // valley
	if (assignment === "C") return "#0f0"; // cut
	if (assignment === "F") return "#ff0"; // facet
	if (assignment === "U") return "#f0f"; // hinge
	return "#0ff";
}

function opacityForAngle(angle, assignment) {
	if (angle === null || assignment === "F") return 1;
	return Math.abs(angle) / 180;
}

function getDistFromEnd(t, length, tol) {
	const dist = t * length;
	if (dist < -tol) return null;
	if (dist > length + tol) return null;
	return dist;
}

function edgesVerticesToVerticesEdges(fold) {
	const verticesEdges = [];
	for (let i = 0; i < fold.vertices_coords.length; i += 1) {
		verticesEdges.push([]);
	}
	for (let i = 0; i < fold.edges_vertices.length; i += 1) {
		const edge = fold.edges_vertices[i];
		verticesEdges[edge[0]].push(i);
		verticesEdges[edge[1]].push(i);
	}
	fold.vertices_edges = verticesEdges;
	return fold;
}

function reverseFaceOrder(fold) {
	for (let i = 0; i < fold.faces_vertices.length; i += 1) {
		fold.faces_vertices[i].reverse();
	}
	return fold;
}

function removeBorderFaces(fold) {
	for (let i = fold.faces_vertices.length - 1; i >= 0; i -= 1) {
		const face = fold.faces_vertices[i];
		let allBorder = true;

		for (let j = 0; j < face.length; j += 1) {
			const vertexIndex = face[j];
			let nextIndex = j + 1;
			if (nextIndex >= face.length) nextIndex = 0;
			const nextVertexIndex = face[nextIndex];
			let connectingEdgeFound = false;
			for (let k = 0; k < fold.vertices_edges[vertexIndex].length; k += 1) {
				const edgeIndex = fold.vertices_edges[vertexIndex][k];
				const edge = fold.edges_vertices[edgeIndex];
				if ((edge[0] === vertexIndex && edge[1] === nextVertexIndex)
					|| (edge[1] === vertexIndex && edge[0] === nextVertexIndex)) {
					connectingEdgeFound = true;
					const assignment = fold.edges_assignment[edgeIndex];
					if (assignment !== "B") {
						allBorder = false;
						break;
					}
				}
			}
			if (!connectingEdgeFound) console.warn("no connecting edge found on face");
			if (!allBorder) break;
		}
		if (allBorder) fold.faces_vertices.splice(i, 1);
	}
	return fold;
}

function removeStrayVertices(fold) {
	if (!fold.vertices_vertices) {
		console.warn("compute vertices_vertices first");
		fold = FOLD.convert.edges_vertices_to_vertices_vertices_unsorted(fold);
	}
	let numStrays = 0;
	const old2new = [];
	let newIndex = 0;
	for (let i = 0; i < fold.vertices_vertices.length; i += 1) {
		if (fold.vertices_vertices[i] === undefined || fold.vertices_vertices[i].length === 0) {
			numStrays++;
			old2new.push(null);
		} else old2new.push(newIndex++);
	}
	if (numStrays === 0) return fold;
	console.warn(`${numStrays} stray vertices found`);
	return FOLD.filter.remapField(fold, "vertices", old2new);
}

// http://paulbourke.net/geometry/pointlineplane/
function line_intersect(v1, v2, v3, v4) {
	const x1 = v1.x;
	const y1 = v1.y;
	const x2 = v2.x;
	const y2 = v2.y;
	const x3 = v3.x;
	const y3 = v3.y;
	const x4 = v4.x;
	const y4 = v4.y;
	const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	if (denom === 0) {
		return null;
	}
	const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
	const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
	return {
		intersection: new THREE.Vector2(x1 + ua * (x2 - x1), y1 + ua * (y2 - y1)),
		t1: ua,
		t2: ub
	};
}

function findIntersections(fold, tol) {
	const vertices = fold.vertices_coords;
	const edges = fold.edges_vertices;
	const foldAngles = fold.edges_foldAngle;
	const assignments = fold.edges_assignment;
	for (let i = edges.length - 1; i >= 0; i -= 1) {
		for (let j = i - 1; j >= 0; j -= 1) {
			const v1 = makeVector2(vertices[edges[i][0]]);
			const v2 = makeVector2(vertices[edges[i][1]]);
			const v3 = makeVector2(vertices[edges[j][0]]);
			const v4 = makeVector2(vertices[edges[j][1]]);
			const data = line_intersect(v1, v2, v3, v4);
			if (data) {
				const length1 = (v2.clone().sub(v1)).length();
				const length2 = (v4.clone().sub(v3)).length();
				const d1 = getDistFromEnd(data.t1, length1, tol);
				const d2 = getDistFromEnd(data.t2, length2, tol);
				if (d1 === null || d2 === null) continue; // no crossing

				const seg1Int = d1 > tol && d1 < length1 - tol;
				const seg2Int = d2 > tol && d2 < length2 - tol;
				if (!seg1Int && !seg2Int) continue; // intersects at endpoints only

				let vertIndex;
				if (seg1Int && seg2Int) {
					vertIndex = vertices.length;
					vertices.push([data.intersection.x, data.intersection.y]);
				} else if (seg1Int) {
					if (d2 <= tol) vertIndex = edges[j][0];
					else vertIndex = edges[j][1];
				} else {
					if (d1 <= tol) vertIndex = edges[i][0];
					else vertIndex = edges[i][1];
				}

				if (seg1Int) {
					let foldAngle = foldAngles[i];
					let assignment = assignments[i];
					edges.splice(i, 1, [vertIndex, edges[i][0]], [vertIndex, edges[i][1]]);
					foldAngles.splice(i, 1, foldAngle, foldAngle);
					assignments.splice(i, 1, assignment, assignment);
					i += 1;
				}
				if (seg2Int) {
					let foldAngle = foldAngles[j];
					let assignment = assignments[j];
					edges.splice(j, 1, [vertIndex, edges[j][0]], [vertIndex, edges[j][1]]);
					foldAngles.splice(j, 1, foldAngle, foldAngle);
					assignments.splice(j, 1, assignment, assignment);
					j += 1;
					i += 1;
				}
			}
		}
	}
	return fold;
}


function parseSVG(rawData, options) {
	const _verticesRaw = rawData.vertices;
	const _bordersRaw = rawData.edges.border;
	const _mountainsRaw = rawData.edges.mountain;
	const _valleysRaw = rawData.edges.valley;
	const _triangulationsRaw = rawData.edges.cut;
	const _hingesRaw = rawData.edges.triangulation;
	const _cutsRaw = rawData.edges.hinge;

	let foldData = emptyFOLD();

	_verticesRaw.forEach((vertex) => {
		foldData.vertices_coords.push([vertex.x, vertex.z]);
	});
	_bordersRaw.forEach((edge) => {
		foldData.edges_vertices.push([edge[0], edge[1]]);
		foldData.edges_assignment.push("B");
		foldData.edges_foldAngle.push(null);
	});
	_mountainsRaw.forEach((edge) => {
		foldData.edges_vertices.push([edge[0], edge[1]]);
		foldData.edges_assignment.push("M");
		foldData.edges_foldAngle.push(edge[2]);
	});
	_valleysRaw.forEach((edge) => {
		foldData.edges_vertices.push([edge[0], edge[1]]);
		foldData.edges_assignment.push("V");
		foldData.edges_foldAngle.push(edge[2]);
	});
	_triangulationsRaw.forEach((edge) => {
		foldData.edges_vertices.push([edge[0], edge[1]]);
		foldData.edges_assignment.push("F");
		foldData.edges_foldAngle.push(0);
	});
	_hingesRaw.forEach((edge) => {
		foldData.edges_vertices.push([edge[0], edge[1]]);
		foldData.edges_assignment.push("U");
		foldData.edges_foldAngle.push(null);
	});
	_cutsRaw.forEach((edge) => {
		foldData.edges_vertices.push([edge[0], edge[1]]);
		foldData.edges_assignment.push("C");
		foldData.edges_foldAngle.push(null);
	});

	if (foldData.vertices_coords.length === 0 || foldData.edges_vertices.length === 0) {
		// globals.warn("No valid geometry found in SVG, be sure to ungroup all and remove all clipping masks.");
		// return false;
		return undefined;
	}

	foldData = FOLD.filter.collapseNearbyVertices(foldData, options.vertTol);
	// foldData = FOLD.filter.removeLoopEdges(foldData); // remove edges that points to same vertex
	FOLD.filter.removeLoopEdges(foldData); // remove edges that points to same vertex
	// foldData = FOLD.filter.removeDuplicateEdges_vertices(foldData); // remove duplicate edges
	// foldData = FOLD.filter.subdivideCrossingEdges_vertices(foldData, options.vertTol);
	// find intersections and add vertices/edges
	FOLD.filter.subdivideCrossingEdges_vertices(foldData, options.vertTol);
	foldData = findIntersections(foldData, options.vertTol);
	 // cleanup after intersection operation
	foldData = FOLD.filter.collapseNearbyVertices(foldData, options.vertTol);
	// foldData = FOLD.filter.removeLoopEdges(foldData); // remove edges that points to same vertex
	FOLD.filter.removeLoopEdges(foldData); // remove edges that points to same vertex
	// foldData = FOLD.filter.removeDuplicateEdges_vertices(foldData); // remove duplicate edges
	FOLD.filter.removeDuplicateEdges_vertices(foldData); // remove duplicate edges
	foldData = FOLD.convert.edges_vertices_to_vertices_vertices_unsorted(foldData);
	foldData = removeStrayVertices(foldData); // delete stray anchors
	foldData = removeRedundantVertices(foldData, 0.01); // remove vertices that split edge
	FOLD.convert.sort_vertices_vertices(foldData);
	foldData = FOLD.convert.vertices_vertices_to_faces_vertices(foldData);
	foldData = edgesVerticesToVerticesEdges(foldData);
	foldData = removeBorderFaces(foldData); // expose holes surrounded by all border edges
	foldData = reverseFaceOrder(foldData); // set faces to counter clockwise
	return processFold(foldData);
}


function findType(_verticesRaw, _segmentsRaw, filter, $paths, $lines, $rects, $polygons, $polylines) {
	parsePath(_verticesRaw, _segmentsRaw, $paths.filter(filter));
	parseLine(_verticesRaw, _segmentsRaw, $lines.filter(filter));
	parseRect(_verticesRaw, _segmentsRaw, $rects.filter(filter));
	parsePolygon(_verticesRaw, _segmentsRaw, $polygons.filter(filter));
	parsePolyline(_verticesRaw, _segmentsRaw, $polylines.filter(filter));
}

function loadSVG(url) {
	SVGloader.load(url, (svg) => {
		// var _$svg = $(svg);
		const _$svg = svg.xml;


		const verticesRaw = [];
		// refs to vertex indices
		const mountainsRaw = [];
		const valleysRaw = [];
		const bordersRaw = [];
		const cutsRaw = [];
		const triangulationsRaw = [];
		const hingesRaw = [];

		let badColors = [];// store any bad colors in svg file to show user

		const mountains = [];
		const valleys = [];
		const borders = [];
		const hinges = [];
		const triangulations = [];


		// warn of global styling
		const $style = Array.from(_$svg.childNodes).filter(n => n.tagName === "style");
		if ($style.length > 0) {
			// globals.warn(`Global styling found on SVG, this is currently ignored by the app.  This may cause some lines to be styled incorrectly and missed during import.  Please find a way to save this file without using global style tags.<br/><br/>Global styling:<br/><br/><b>${$style.html()}</b>`);
		}

		// warn of groups
		// var $groups = _$svg.children("g");
		// if ($groups.length>0) {
		//     globals.warn("Grouped elements found in SVG, these are currently ignored by the app.  " +
		//         "Please ungroup all elements before importing.");
		// }

		// format all appropriate svg elements
		const $paths = Array.from(_$svg.getElementsByTagName("path"));
		const $lines = Array.from(_$svg.getElementsByTagName("line"));
		const $rects = Array.from(_$svg.getElementsByTagName("rect"));
		const $polygons = Array.from(_$svg.getElementsByTagName("polygon"));
		const $polylines = Array.from(_$svg.getElementsByTagName("polyline"));

		// var $paths = _$svg.find("path");
		// var $lines = _$svg.find("line");
		// var $rects = _$svg.find("rect");
		// var $polygons = _$svg.find("polygon");
		// var $polylines = _$svg.find("polyline");
		const wipe = a => a.setAttribute("style", "fill: none; stroke-dasharray: none;");
		$paths.forEach(a => wipe(a));
		$lines.forEach(a => wipe(a));
		$rects.forEach(a => wipe(a));
		$polygons.forEach(a => wipe(a));
		$polylines.forEach(a => wipe(a));
		// $paths.css({fill:"none", 'stroke-dasharray':"none"});
		// $lines.css({fill:"none", 'stroke-dasharray':"none"});
		// $rects.css({fill:"none", 'stroke-dasharray':"none"});
		// $polygons.css({fill:"none", 'stroke-dasharray':"none"});
		// $polylines.css({fill:"none", 'stroke-dasharray':"none"});

		findType(verticesRaw, bordersRaw, borderFilter, $paths, $lines, $rects, $polygons, $polylines);
		findType(verticesRaw, mountainsRaw, mountainFilter, $paths, $lines, $rects, $polygons, $polylines);
		findType(verticesRaw, valleysRaw, valleyFilter, $paths, $lines, $rects, $polygons, $polylines);
		findType(verticesRaw, cutsRaw, cutFilter, $paths, $lines, $rects, $polygons, $polylines);
		findType(verticesRaw, triangulationsRaw, triangulationFilter, $paths, $lines, $rects, $polygons, $polylines);
		findType(verticesRaw, hingesRaw, hingeFilter, $paths, $lines, $rects, $polygons, $polylines);

		if (badColors.length > 0) {
			// badColors = _.uniq(badColors);
			const badColorHash = {};
			badColors.forEach((c) => { badColorHash[c] = true; });
			badColors = Object.keys(badColorHash);
			let string = "Some objects found with the following stroke colors:<br/><br/>";
			badColors.forEach(function (color) {
				string += "<span style='background:" + color + "' class='colorSwatch'></span>" + color + "<br/>";
			});
			string +=  "<br/>These objects were ignored.<br/>  Please check that your file is set up correctly, <br/>" +
				"see <b>File > File Import Tips</b> for more information.";
			// globals.warn(string);
		}

		const rawData = {
			vertices: verticesRaw,
			edges: {
				border: bordersRaw,
				mountain: mountainsRaw,
				valley: valleysRaw,
				cut: cutsRaw,
				triangulation: triangulationsRaw,
				hinge: hingesRaw
			}
		};
		// todo: hook this back up into the globals system
		const options = {
			vertTol: 0.001
		};
		// todo revert back to old pattern if bad import
		const rawFold = parseSVG(rawData, options);
		if (!rawFold) {
			return;
		}

		// find max and min vertices
		const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
		const min = new THREE.Vector3(Infinity, Infinity, Infinity);
		for (let i = 0; i < rawFold.vertices_coords.length; i += 1) {
			const vertex = new THREE.Vector3(
				rawFold.vertices_coords[i][0],
				rawFold.vertices_coords[i][1],
				rawFold.vertices_coords[i][2]
			);
			max.max(vertex);
			min.min(vertex);
		}
		if (min.x === Infinity) {
			if (badColors.length === 0) {
				// globals.warn("no geometry found in file");
			}
			return;
		}
		max.sub(min);
		const border = new THREE.Vector3(0.1, 0, 0.1);
		const scale = (max.z < max.x)
			? max.z
			: max.x;
		if (scale === 0) return;

		const strokeWidth = scale / 300;
		border.multiplyScalar(scale);
		min.sub(border);
		max.add(border.multiplyScalar(2));
		const viewBoxTxt = [min.x, min.z, max.x, max.z].join(" ");

		const ns = "http://www.w3.org/2000/svg";
		const newSVG = window.document.createElementNS(ns, "svg");
		newSVG.setAttribute("viewBox", viewBoxTxt);
		for (let i = 0; i < rawFold.edges_vertices.length; i += 1) {
			const line = window.document.createElementNS(ns, "line");
			const edge = rawFold.edges_vertices[i];
			let vertex = rawFold.vertices_coords[edge[0]];
			line.setAttribute("stroke", colorForAssignment(rawFold.edges_assignment[i]));
			line.setAttribute("opacity", opacityForAngle(rawFold.edges_foldAngle[i], rawFold.edges_assignment[i]));
			line.setAttribute("x1", vertex[0]);
			line.setAttribute("y1", vertex[2]);
			vertex = rawFold.vertices_coords[edge[1]];
			line.setAttribute("x2", vertex[0]);
			line.setAttribute("y2", vertex[2]);
			line.setAttribute("stroke-width", strokeWidth);
			newSVG.appendChild(line);
		}
		// $("#svgViewer").html(svg);

		},
		function() {},
		function(error) {
			// globals.warn("Error loading SVG " + url + " : " + error);
			console.warn(error);
	});
}

export default loadSVG;
