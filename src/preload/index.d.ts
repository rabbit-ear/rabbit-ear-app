import type { ElectronAPI } from "@electron-toolkit/preload";
import type { WindowAPI } from "./api.ts";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WindowAPI;
  }
}
