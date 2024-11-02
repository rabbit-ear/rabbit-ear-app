import path from "node:path";
import type { MessageBoxReturnValue, IpcMainInvokeEvent } from "electron";
import { type FilePathInfo, getFilePathInfo } from "./fs/path.ts";
import {
  openFile as fsOpenFile,
  saveFile as fsSaveFile,
  saveFileAs as fsSaveFileAs,
  getBaseDirectory as fsGetBaseDirectory,
} from "./fs/file.ts";
import { unsavedChanges } from "./dialog/dialogs.ts";

/**
 * these are the two-way renderer-to-main-and-back events which use
 * ipcRenderer.invoke() and ipcMain.handle()
 */

export const pathJoin = (_: IpcMainInvokeEvent, ...paths: string[]): string =>
  path.join(...paths);

export const unsavedChangesDialog = (
  _: IpcMainInvokeEvent,
  yesString: string = "Proceed",
  noString: string = "Cancel",
): Promise<MessageBoxReturnValue> => unsavedChanges(yesString, noString);

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

export const getBaseDirectory = async (_: IpcMainInvokeEvent): Promise<string> =>
  fsGetBaseDirectory();
