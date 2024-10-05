import { ipcRenderer } from "electron";
import type { FilePathInfo } from "../main/fs/path.ts";

export type WindowAPI = {
  // one way, from renderer to main
  quitApp: () => void;
  setAppTitle: (title: string) => void;

  // two way, from renderer to main and back
  unsavedChangesDialog: (
    yesString?: string,
    noString?: string,
  ) => Promise<{ response: number }>;
  pathJoin: () => Promise<string>;
  openFile: () => Promise<{ data?: string; fileInfo?: FilePathInfo }>;
  saveFile: (fileInfo: FilePathInfo, data: string) => Promise<boolean>;
  saveFileAs: (data: string) => Promise<FilePathInfo | undefined>;
  makeFilePathInfo: (data: string) => Promise<FilePathInfo>;

  // from main to renderer,
  //queryUnsavedChanges: (callback: () => boolean) => boolean;

  // allow front end to bind a front end method that can be called by the back end
  bindIpcRendererOn: (key: string, func: () => void) => void;
  bindIpcRendererInvoke: <T>(key: string, func: () => T) => Promise<T>;
};

// window.api
// this object will become a child of the global window object.
// primarily this will function as a way for the renderer to call to main.
export const api: WindowAPI = {
  // one way, front end to back end
  quitApp: () => ipcRenderer.send("quitApp"),
  setAppTitle: (title: string) => ipcRenderer.send("setAppTitle", title),

  // two way, front to back with a response
  unsavedChangesDialog: (yesString?: string, noString?: string) =>
    ipcRenderer.invoke("unsavedChangesDialog", yesString, noString),
  openFile: () => ipcRenderer.invoke("openFile"),
  saveFile: (fileInfo: FilePathInfo, data: string) =>
    ipcRenderer.invoke("saveFile", fileInfo, data),
  saveFileAs: (data: string): Promise<FilePathInfo | undefined> =>
    ipcRenderer.invoke("saveFileAs", data),
  pathJoin: () => ipcRenderer.invoke("pathJoin"),
  makeFilePathInfo: (data: string): Promise<FilePathInfo> =>
    ipcRenderer.invoke("makeFilePathInfo", data),

  // from main to renderer,
  // where main calls via: window.webContents.send() and ipcRenderer.on()
  //queryUnsavedChanges: (callback: () => boolean) =>
  //  ipcRenderer.invoke("queryUnsavedChanges", callback),

  // allow front end to bind a front end method that can be called by the back end
  bindIpcRendererOn: (key: string, func: () => void) => ipcRenderer.on(key, func),
  bindIpcRendererInvoke: <T>(key: string, func: () => T) => ipcRenderer.invoke(key, func),
};
