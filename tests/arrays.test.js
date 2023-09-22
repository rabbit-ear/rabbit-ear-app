import { expect, test } from "vitest";
import {
	assignLists,
	zipArrays,
} from "./src/js/arrays.js";

test("assignLists", () => {
	const res = assignLists([4, 5, 6], [0, 2, 4, 6, 8]);
	expect(res.length).toBe(6);
	expect(res[0]).toBe(4);
	expect(res[1]).toBe(5);
	expect(res[2]).toBe(6);
	expect(res[3]).toBe(0);
	expect(res[4]).toBe(2);
	expect(res[5]).toBe(8);
});

test("zipArrays 1", () => {
	const a = [4, 5];
	const b = [0, 2, 6, 8];
	const zip = zipArrays(a, b);
	expect(zip.length).toBe(6);
	expect(zip[0]).toBe(4);
	expect(zip[1]).toBe(0);
	expect(zip[2]).toBe(5);
	expect(zip[3]).toBe(2);
	expect(zip[4]).toBe(6);
	expect(zip[5]).toBe(8);
});

test("zipArrays 2", () => {
	const a = [0, 2, 6, 8];
	const b = [4, 5];
	const zip = zipArrays(a, b);
	expect(zip.length).toBe(6);
	expect(zip[0]).toBe(0);
	expect(zip[1]).toBe(4);
	expect(zip[2]).toBe(2);
	expect(zip[3]).toBe(5);
	expect(zip[4]).toBe(6);
	expect(zip[5]).toBe(8);
});

test("zipArrays 3", () => {
	const a = [4, 5];
	const b = [0, 2, 6, 8];
	delete b[0];
	delete b[1];
	const zip = zipArrays(a, b);
	expect(zip.length).toBe(4);
	expect(zip[0]).toBe(4);
	expect(zip[1]).toBe(5);
	expect(zip[2]).toBe(6);
	expect(zip[3]).toBe(8);
});
