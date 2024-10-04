import { model } from "../doc-state/model.svelte.ts";
import file from "../doc-state/file.svelte.ts";
import { DOCUMENT_EXTENSION, UNTITLED_FILENAME } from "../../../global/constants.ts";

/**
 * @description ask the app to create a new file.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const newFile = async () => {
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
    extension: `.${DOCUMENT_EXTENSION}`,
  };
  file.modified = false;
};

