import { getCurrentWebview } from "@tauri-apps/api/webview";
import file from "../app/file.svelte.ts";
import { model } from "../app/model.svelte.ts";
import { unsavedChangesDialog } from "../system/dialogs.ts";
import { readTextFile } from "../system/fs.ts";
import { getFilePathInfo } from "../system/path.ts";
import { validateFileType } from "../system/validate.ts";
import { saveFileAs } from "./save.svelte.ts";
import context from "../app/context.svelte.ts";

export const dragOpenFile = async (filePath: string): Promise<void> => {
  if (file.modified) {
    // todo: when 3-button dialogs are re-introduced this needs updating
    const response = await unsavedChangesDialog("Yes", "No", "Cancel");
    if (response === false) {
      return;
    }
    if (response === true) {
      // todo: if they cancel from this dialog
      await saveFileAs();
    }
  }
  const fileInfo = await getFilePathInfo(filePath);

  if (fileInfo === undefined) { return; }
  if (!(await validateFileType(fileInfo))) { return; }

  const data = await readTextFile(fileInfo.fullpath);

  if (fileInfo) {
    model.value = data;
    file.info = fileInfo;
    file.modified = false;
  }
};

// let dragDropUnlisten: Function | undefined;
// dragDropUnlisten = await getCurrentWebview().onDragDropEvent(async (event) => {
getCurrentWebview().onDragDropEvent(async (event) => {
  if (event.payload.type === "over") {
    console.log("User hovering", event.payload.position);
    app.dragIsHovering = true;
  } else if (event.payload.type === "drop") {
    console.log("User dropped", event.payload.paths);
    app.dragIsHovering = false;
    const filePaths = event.payload.paths;
    const filePath = filePaths[0];
    await dragOpenFile(filePath);
  } else {
    console.log("File drop cancelled");
    app.dragIsHovering = false;
  }
});

// todo
// in Rust there is a listener for before the app closes,
// that is currently not working on MacOS (known issue on Github).
// when it works again, call this method from Rust.
// const removeDragDropListener = () => {
//   if (dragDropUnlisten !== undefined) {
//     dragDropUnlisten();
//   }
//   dragDropUnlisten = undefined;
// };
//
