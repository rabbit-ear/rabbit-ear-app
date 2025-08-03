import { model } from "../app/model.svelte.ts";
import file from "../app/file.svelte.ts";
import { type FilePathInfo } from "../system/path.ts";
import { writeTextFile } from "../system/fs.ts";
import { defaultFileDialogFilter, saveFileAsDialog } from "../system/dialogs.ts";

/**
 * @description ask the app to save the currently opened file.
 * this can be called from the front-end or the back-end.
 *
 * @description Perform a "Save" operation for the currently opened file.
 * if the file exists it will be overwritten,
 * if the file does not exist it will be silently created then written to.
 * returns true if the write was successful
 * returns false if the write was unsuccessful, it might be customary to
 * run the "saveAs" method.
 */
export const saveFile = async (): Promise<void> => {
  if (!file.info) { return; }

  // a couple checks to REALLY make sure that the file already exists
  if (!file.info || !file.info.fullpath) {
    saveFileAs();
    return;
  }
  // fs.access(fileInfo.fullpath, fs.constants.F_OK)
  // fs.checkFileExistsAndWritable();
  await writeTextFile(file.info.fullpath, model.value);
  // on success, mark as unmodified
  file.modified = false;
};

/**
 * @description ask the app to "save as", to write to a new file.
 * this can be called from the front-end or the back-end.
 */
export const saveFileAs = async (): Promise<FilePathInfo | undefined> => {
  const fileInfo = await saveFileAsDialog(defaultFileDialogFilter());
  if (!fileInfo) { return undefined; }
  await writeTextFile(fileInfo?.fullpath, model.value);
  if (fileInfo) {
    file.info = fileInfo;
    file.modified = false;
  }
  return fileInfo;
};

