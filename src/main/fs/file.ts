import { app, dialog } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";
import { EXTENSION, FILE_TYPE_NAME } from "./filetype.ts";
import { type FilePathInfo, getFilePathInfo } from "./path.ts";
import { validateFileType } from "./validate.ts";

/**
 * @description Perform an "Open File" operation, which tells the system
 * to open an open file dialog.
 */
export const openFile = async (): Promise<{ data?: string; fileInfo?: FilePathInfo }> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  if (canceled) {
    return {};
  }
  // hardcoded ignoring more than 1 file
  const filePath = filePaths[0];
  const fileInfo = await getFilePathInfo(filePath);
  if (!(await validateFileType(fileInfo))) {
    return {};
  }
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  return { fileInfo, data };
};

/**
 * @description Perform a "SaveAs" operation for the currently opened file.
 */
export const saveFileAs = async (data: string): Promise<FilePathInfo | undefined> => {
  const defaultPath = app.getPath("home");
  const filters = [
    {
      name: FILE_TYPE_NAME,
      extensions: [EXTENSION],
    },
  ];
  const options =
    !defaultPath || defaultPath === "" ? { filters } : { filters, defaultPath };
  const { canceled, filePath } = await dialog.showSaveDialog(options);
  if (canceled) {
    return undefined;
  }
  await fs.writeFile(filePath, data);
  return getFilePathInfo(filePath);
};

/**
 * @description Perform a "Save" operation for the currently opened file.
 * if the file exists it will be overwritten,
 * if the file does not exist it will be silently created then written to.
 * returns true if the write was successful
 * returns false if the write was unsuccessful, it might be customary to
 * run the "saveAs" method.
 */
export const saveFile = async (
  fileInfo: FilePathInfo,
  data: string,
): Promise<boolean> => {
  // a couple checks to REALLY make sure that the file already exists
  if (!fileInfo || !fileInfo.fullpath) {
    return false;
  }
  return fs
    .access(fileInfo.fullpath, fs.constants.F_OK)
    .catch(() => false)
    .then(async () => {
      // save file and overwrite contents
      await fs.writeFile(fileInfo.fullpath, data);
      return true;
    });
};

/**
 * @description Convert a file name (name + extension) into a sequence of
 * filenames that take the form of name-0000N.ext where 000N is a number
 * that counts up from 0 to "count" - 1, and 000N will have the minimum
 * number of preceding zeros to pad all numbers to be the same length.
 */
const makeNumberedFilenames = (
  count: number,
  name: string,
  extension: string,
): string[] => {
  const places = count.toString().length;
  const zeros = Array(places).fill(0).join("");
  return Array.from(Array(count))
    .map((_, i) => `${zeros}${i}`)
    .map((str) => str.slice(str.length - places, str.length))
    .map((num) => `${name}-${num}${extension}`);
};

const makeFileFilter = (
  name: string,
  ...extensions: string[]
): { name: string; extensions: string[] } => ({
  name,
  extensions,
});

/**
 *
 */
export const exportTextFile = async (
  data: string,
  ext = "svg",
  typename = "image",
): Promise<void> => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [makeFileFilter(typename, ext)],
  });
  if (canceled) {
    return;
  }
  const { directory, root } = await getFilePathInfo(filePath);
  const joined = path.join(directory, `${root}.${ext}`);
  fs.writeFile(joined, data);
};

/**
 *
 */
export const exportBinaryFile = async (
  data: DataView,
  ext = "png",
  typename = "image",
): Promise<void> => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [makeFileFilter(typename, ext)],
  });
  if (canceled) {
    return;
  }
  const { directory, root } = await getFilePathInfo(filePath);
  const joined = path.join(directory, `${root}.${ext}`);
  fs.writeFile(joined, data, null);
};

/**
 * @param {string[]} data multiple file contents as strings
 */
export const exportTextFiles = async (
  data: string[] = [],
  ext = "svg",
  typename = "image",
): Promise<void> => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [makeFileFilter(typename, ext)],
  });
  if (canceled) {
    return;
  }
  const { directory, root, extension } = await getFilePathInfo(filePath);
  makeNumberedFilenames(data.length, root, extension).map(async (numberedName, i) => {
    const outPath = path.join(directory, numberedName);
    fs.writeFile(outPath, data[i]);
  });
};

/**
 *
 */
export const exportBinaryFiles = async (
  binaryFiles: Buffer[] = [],
  ext = "png",
  typename = "image",
): Promise<void> => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [makeFileFilter(typename, ext)],
  });
  if (canceled) {
    return;
  }
  const { directory, root, extension } = await getFilePathInfo(filePath);
  makeNumberedFilenames(binaryFiles.length, root, extension).map(
    async (numberedName, i) => {
      const outPath = path.join(directory, numberedName);
      fs.writeFile(outPath, binaryFiles[i]);
    },
  );
};
