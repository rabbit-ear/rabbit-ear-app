import { quitApp } from "./quit.svelte.ts";
import { newFile } from "./newFile.svelte.ts";
import { openFile } from "./openFile.svelte.ts";
import { saveFile, saveFileAs } from "./saveFile.svelte.ts";
import type { WindowAPI } from "../../preload/api.ts";
import "./appTitle.svelte.ts";

// this is duplicated (in part) from src/preload/index.d.ts
declare global {
  interface Window {
    api: WindowAPI;
  }
}

/**
 * bind all methods for the from-main-to-renderer IPC communication.
 */
window.api?.bindIpcRendererOn("menuQuit", quitApp);
window.api?.bindIpcRendererOn("menuNew", newFile);
window.api?.bindIpcRendererOn("menuOpen", openFile);
window.api?.bindIpcRendererOn("menuSave", saveFile);
window.api?.bindIpcRendererOn("menuSaveAs", saveFileAs);
// window.api?.queryUnsavedChanges(() => fileModified.value);
