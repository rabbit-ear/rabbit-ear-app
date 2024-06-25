import { clampLine, clampRay, clampSegment } from "rabbit-ear/math/line.js";
import { pointsToLine } from "rabbit-ear/math/convert.js";
import { includeL, includeR, includeS } from "rabbit-ear/math/compare.js";
import { RulersCP, RulersFolded } from "../../stores/Ruler.js";
import {
	GhostGraphCP,
	GhostGraphFolded,
	GuideLinesCP,
	GuideLinesFolded,
} from "../../stores/UI.js";

export const setGhostGraphCP = (graph) => GhostGraphCP.set(graph);

export const setGhostGraphFolded = (graph) => GhostGraphFolded.set(graph);

export const setRulersCP = (lines = []) =>
	RulersCP.set(
		lines
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampLine, domain: includeL })),
	);
export const setRulerRaysCP = (lines = []) =>
	RulersCP.set(
		lines
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampRay, domain: includeR })),
	);
export const setRulerSegmentsCP = (lines = []) =>
	RulersCP.set(
		lines
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampSegment, domain: includeS })),
	);

export const setRulersFolded = (lines = []) =>
	RulersFolded.set(
		lines
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampLine, domain: includeL })),
	);
export const setRulerRaysFolded = (lines = []) =>
	RulersFolded.set(
		lines
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampRay, domain: includeR })),
	);
export const setRulerSegmentsFolded = (lines = []) =>
	RulersFolded.set(
		lines
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampSegment, domain: includeS })),
	);

export const setGuideLinesCP = (lines = []) =>
	GuideLinesCP.set(
		lines
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampLine, domain: includeL })),
	);
export const setGuideRaysCP = (rays = []) =>
	GuideLinesCP.set(
		rays
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampRay, domain: includeR })),
	);
export const setGuideSegmentsCP = (segments = []) =>
	GuideLinesCP.set(
		segments
			.filter((a) => a !== undefined && a.length === 2)
			.map((seg) => pointsToLine(seg[1], seg[0]))
			.map((line) => ({ line, clamp: clampSegment, domain: includeS })),
	);

export const setGuideLinesFolded = (lines = []) =>
	GuideLinesFolded.set(
		lines
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampLine, domain: includeL })),
	);
export const setGuideRaysFolded = (rays = []) =>
	GuideLinesFolded.set(
		rays
			.filter((a) => a !== undefined)
			.map((line) => ({ line, clamp: clampRay, domain: includeR })),
	);
export const setGuideSegmentsFolded = (segments = []) =>
	GuideLinesFolded.set(
		segments
			.filter((a) => a !== undefined && a.length === 2)
			.map((seg) => pointsToLine(seg[1], seg[0]))
			.map((line) => ({ line, clamp: clampSegment, domain: includeS })),
	);
