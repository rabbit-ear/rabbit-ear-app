import { confirm } from "@tauri-apps/plugin-dialog";
import {
  open as systemOpenDialog,
  save as systemSaveDialog,
} from "@tauri-apps/plugin-dialog";
import { homeDir } from "@tauri-apps/api/path";
import { EXTENSION, EXTENSIONS, FILE_TYPE_NAME } from "./constants.ts";
import { type FilePathInfo, getFilePathInfo } from "./path.ts";

export type DialogFilter = {
  name: string;
  extensions: string[];
};

export const defaultFileDialogFilter = () => ({
  name: FILE_TYPE_NAME,
  extensions: [EXTENSION],
});

export const defaultFilesDialogFilter = () => ({
  name: FILE_TYPE_NAME,
  extensions: [EXTENSIONS],
});

/**
 *
 */
export const unsavedChangesDialog = (
  yesString: string = "Yes",
  noString: string = "No",
  cancelString: string = "Cancel",
): Promise<boolean> =>
  confirm("Would you like to save?", {
    title: "You have unsaved progress",
    kind: "warning",
    // kind: "question",
    // buttons: [yesString, cancelString, noString],
  });

/**
 *
 */
export const openFileDialog = async (filter?: DialogFilter): Promise<FilePathInfo | undefined> => {
  const filters = filter ? [filter] : [];
  const filePath = await systemOpenDialog({ multiple: false, filters });
  // null if user cancelled the dialog
  return filePath === null
    ? undefined
    : await getFilePathInfo(filePath);
};

/**
 *
 */
export const saveFileAsDialog = async (filter?: DialogFilter): Promise<FilePathInfo | undefined> => {
  const defaultPath = await homeDir();
  const filters = filter ? [filter] : [];
  const options = !defaultPath || defaultPath === ""
    ? { filters }
    : { filters, defaultPath };
  const filePath = await systemSaveDialog(options);
  // null if user cancelled the dialog
  return filePath === null
    ? undefined
    : await getFilePathInfo(filePath);
};

