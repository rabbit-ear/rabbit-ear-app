import { contextBridge } from "electron";
import { type ElectronAPI, electronAPI } from "@electron-toolkit/preload";
import type { WindowAPI } from "../preload/api.ts";
import { api } from "./api.ts";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WindowAPI;
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}

