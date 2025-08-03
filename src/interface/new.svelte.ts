import { model } from "../app/model.svelte.ts";
import file from "../app/file.svelte.ts";
import { EXTENSION, UNTITLED_FILENAME } from "../system/constants.ts";
import { unsavedChangesDialog } from "../system/dialogs.ts";

/**
 * @description ask the app to create a new file.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const newFile = async (): Promise<void> => {
  if (file.modified) {
    // todo: when 3-button dialogs are re-introduced this needs updating
    switch (await unsavedChangesDialog("New File", "Cancel")) {
      case true: break;
      case false: return;
      // case yes: saveFileAs(); break;
    }
  }
  model.value = "";
  file.info = {
    fullpath: "",
    directory: "",
    file: UNTITLED_FILENAME,
    root: "untitled",
    extension: `.${EXTENSION}`,
  };
  file.modified = false;
};
