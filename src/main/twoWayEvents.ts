import path from "node:path";
import { type IpcMainInvokeEvent } from "electron";
import { type FilePathInfo, getFilePathInfo } from "./fs/path.ts";
import {
  openFile as fsOpenFile,
  saveFile as fsSaveFile,
  saveFileAs as fsSaveFileAs,
} from "./fs/file.ts";
import { unsavedChanges } from "./dialog/dialogs.ts";

/**
 * these are the two-way renderer-to-main-and-back events which use
 * ipcRenderer.invoke() and ipcMain.handle()
 */

export const pathJoin = (_: IpcMainInvokeEvent, ...paths: string[]) => path.join(...paths);

export const unsavedChangesDialog = (
  _: IpcMainInvokeEvent,
  yesString: string = "Proceed",
  noString: string = "Cancel",
) => unsavedChanges(yesString, noString);

export const makeFilePathInfo = async (
  _: IpcMainInvokeEvent,
  filePath: string,
): Promise<FilePathInfo> => getFilePathInfo(filePath);

export const openFile = async (
  _: IpcMainInvokeEvent,
): Promise<{ data?: string; fileInfo?: FilePathInfo }> => fsOpenFile();

export const saveFileAs = async (
  _: IpcMainInvokeEvent,
  data: string,
): Promise<FilePathInfo | undefined> => fsSaveFileAs(data);

export const saveFile = async (
  _: IpcMainInvokeEvent,
  fileInfo: FilePathInfo,
  data: string,
): Promise<boolean> => fsSaveFile(fileInfo, data);

