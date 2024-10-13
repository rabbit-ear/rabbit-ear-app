import app from "../app/App.svelte.ts";

/**
 * @description ask the app to open a new file, replacing the current one.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const openFile = async (): Promise<void> => {
  if (app.file.modified) {
    const { response } = await window.api.unsavedChangesDialog("Proceed", "Cancel");
    if (response !== 0) {
      return;
    }
  }

  const { data, fileInfo: info } = await window.api.openFile();
  if (info) {
    app.file.load(data, info);
  }
};
