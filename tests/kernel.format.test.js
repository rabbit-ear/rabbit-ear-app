import { expect, test } from "vitest";
import {
  stringifyArgs,
  //formatJavascript,
  //formatCommandResult,
  //matchFromArray,
} from "../src/renderer/kernel/format.ts";

test("stringifyArgs, empty", () => {
  expect(stringifyArgs()).toBe("");
});

test("stringifyArgs, primitives", () => {
  expect(stringifyArgs(true)).toBe("true");
  expect(stringifyArgs(true, false)).toBe("true, false");
  expect(stringifyArgs(3, 5)).toBe("3, 5");
});

// note, difference between space
test("stringifyArgs, array", () => {
  expect(stringifyArgs([1, 2, 3])).toBe("[1,2,3]");
  expect(stringifyArgs(1, 2, 3)).toBe("1, 2, 3");
  expect(stringifyArgs(["hi", "bye"])).toBe("[\"hi\",\"bye\"]");
  expect(stringifyArgs("hi", "bye")).toBe("\"hi\", \"bye\"");
});

//test("formatJavascript", () => { });
//test("formatCommandResult", () => { });
//test("matchFromArray", () => { });
