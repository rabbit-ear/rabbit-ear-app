import { saveFileAsDialog } from "../system/dialogs.ts";
import {
  writeTextFile,
  writeFile,
} from "../system/fs.ts";
import {
  join,
  makeNumberedFilenames,
} from "../system/path.ts";

/**
 *
 */
export const exportTextFile = async (
  data: string,
  ext = "svg",
  typename = "image",
): Promise<void> => {
  const filePath = await saveFileAsDialog({ name: typename, extensions: [ext] });
  if (!filePath) { return; }
  const { directory, root } = filePath;
  const joined = await join(directory, `${root}.${ext}`);
  writeTextFile(joined, data);
};

/**
 *
 */
export const exportBinaryFile = async (
  data: Uint8Array,
  ext = "png",
  typename = "image",
): Promise<void> => {
  const filePath = await saveFileAsDialog({ name: typename, extensions: [ext] });
  if (!filePath) { return; }
  const { directory, root } = filePath;
  const joined = await join(directory, `${root}.${ext}`);
  writeFile(joined, data);
};

/**
 * @param {string[]} data multiple file contents as strings
 */
export const exportTextFiles = async (
  data: string[] = [],
  ext = "svg",
  typename = "image",
): Promise<void> => {
  const filePath = await saveFileAsDialog({ name: typename, extensions: [ext] });
  if (!filePath) { return; }
  const { directory, root, extension } = filePath;
  makeNumberedFilenames(data.length, root, extension).map(async (numberedName, i) => {
    const outPath = await join(directory, numberedName);
    writeTextFile(outPath, data[i]);
  });
};

/**
 *
 */
export const exportBinaryFiles = async (
  binaryFiles: Uint8Array[] = [],
  ext = "png",
  typename = "image",
): Promise<void> => {
  const filePath = await saveFileAsDialog({ name: typename, extensions: [ext] });
  if (!filePath) { return; }
  const { directory, root, extension } = filePath;
  makeNumberedFilenames(binaryFiles.length, root, extension).map(
    async (numberedName, i) => {
      const outPath = await join(directory, numberedName);
      writeFile(outPath, binaryFiles[i]);
    },
  );
};
