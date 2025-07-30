
import { expect, test } from "vitest";

test("file", () => {
  fileController.openFileWithDialog();
  fileController.saveFile();
  expect(true).toBe(true);
});

