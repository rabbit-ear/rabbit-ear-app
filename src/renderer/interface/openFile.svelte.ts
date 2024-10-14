import app from "../app/App.svelte.ts";

/**
 * @description ask the app to open a new file, replacing the current one.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const openFile = async (): Promise<void> => {
  if (app.fileManager.hasUnsavedChanges()) {
    const { response } = await window.api.unsavedChangesDialog("Proceed", "Cancel");
    if (response !== 0) {
      return;
    }
  }

  const { data, fileInfo: path } = await window.api.openFile();
  if (path) {
    app.fileManager.loadFOLDString(path, data);
  }
};
