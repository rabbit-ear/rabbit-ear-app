import { model } from "../state/model.svelte.ts";
import file from "../state/file.svelte.ts";
import { EXTENSION, UNTITLED_FILENAME } from "../state/app.svelte.ts";

/**
 * @description ask the app to create a new file.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const newFile = async (): Promise<void> => {
  if (file.modified) {
    const { response } = await window.api.unsavedChangesDialog("New File", "Cancel");
    if (response !== 0) {
      return;
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
