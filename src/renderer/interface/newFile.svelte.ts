import app from "../app/App.svelte.ts";

/**
 * @description ask the app to create a new file.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const newFile = async (): Promise<void> => {
  if (app.fileManager.hasUnsavedChanges()) {
    const { response } = await window.api.unsavedChangesDialog("New File", "Cancel");
    if (response !== 0) {
      return;
    }
  }
  app.fileManager.loadNewEmpty();
};
