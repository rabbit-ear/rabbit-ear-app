import { getCurrentWebview } from "@tauri-apps/api/webview";
import context from "../app/context.svelte.ts";

let dragDropUnlisten: (() => void) | undefined = await getCurrentWebview()
  .onDragDropEvent(async (event) => {
    if (event.payload.type === "over") {
      context.dragIsHovering = true;
    } else if (event.payload.type === "drop") {
      context.dragIsHovering = false;
      // todo: consider alphabetical sorting of files
      // todo: another: this is duplicated inside of FileController
      // we need some openFiles method without the openFilesWithDialog
      const errors = await context.fileManager.openFiles(event.payload.paths);
      if (errors.length) {
        const errorString = errors.join("\n\n");
        window.alert(`Error opening ${errors.length} files\n\n${errorString}`)
      }
    } else {
      context.dragIsHovering = false;
    }
  });

// todo:
// in Rust there is a listener for before the app closes,
// that is currently not working on MacOS (known issue on Github).
// when it works again, call this method from Rust.
export const removeDragDropListener = () => {
  if (dragDropUnlisten !== undefined) {
    dragDropUnlisten();
  }
  dragDropUnlisten = undefined;
};

