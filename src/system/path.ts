import {
  basename,
  dirname,
  extname,
  join as pathJoin,
  resolve,
} from "@tauri-apps/api/path";

/**
 * @description Verbose file path information
 */
export type FilePathInfo = {
  fullpath: string; // "/Users/Maya/Documents/notes.txt"
  directory: string; // "/Users/Maya/Documents" (without a final slash /)
  file: string; // "notes.txt"
  root: string; // "notes"
  extension: string; // ".txt"
};

export const join = (...paths: string[]): Promise<string> => pathJoin(...paths);

/**
 * @description Convert a file name (name + extension) into a sequence of
 * filenames that take the form of name-0000N.ext where 000N is a number
 * that counts up from 0 to "count" - 1, and 000N will have the minimum
 * number of preceding zeros to pad all numbers to be the same length.
 */
export const makeNumberedFilenames = (
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

export const getFileName = (filePath: string): string | undefined => {
  const match = filePath.match(/[^\\/]+$/);
  return match ? match[0] : undefined;
};

/**
 * @description Pick apart a file path into useful parts
 */
export const getFilePathInfo = async (filePath: string): Promise<FilePathInfo> => {
  // compute everything inside of individual try catches.
  // for example if the file has no extension, the extname() function
  // will throw an error, in which case, we still want to get the other data.
  let fullpath = "";
  let directory = "";
  let file = "";
  let root = "";
  let extension = "";

  // resolve the user's "filePath" into an absolute path
  try {
    fullpath = await resolve(filePath);
  } catch (e) {
    // ignore
  }

  // get the directory containing the file
  try {
    directory = await dirname(fullpath);
  } catch (e) {
    // ignore
  }

  // get the basename of the file (name + extension), and for now,
  // set the "name" entry to be this, in the case that the file has no
  // extension, the following calls might not work.
  try {
    file = await basename(fullpath);
    root = file;
  } catch (e) {
    // ignore
  }

  // get the extension of the file, the portion after the final "."
  try {
    extension = await extname(fullpath);
  } catch (e) {
    // ignore
  }
  // parse the file and get the name of the file excluding the . and extension

  try {
    const rootmatch = file.match(/(.*)\.[^.]+$/);
    if (rootmatch && rootmatch.length > 1) {
      root = rootmatch[1];
    }
  } catch (e) {
    // ignore
  }
  return { fullpath, directory, file, root, extension };
};
