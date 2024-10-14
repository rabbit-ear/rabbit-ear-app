import app from "../app/App.svelte.ts";

/**
 * @description ask the app to save the currently opened file.
 * this can be called from the front-end or the back-end.
 */
export const saveFile = async (): Promise<void> => {
  if (!app.file) {
    return;
  }
  // fileInfo.value is an object and a Proxy (due to Svelte 5), this method
  // will attempt to clone it, can't clone a proxy, so we shallow copy.
  // const success = await window.api.saveFile({ ...fileInfo.value }, model.value);
  const success = await window.api.saveFile(
    $state.snapshot(app.file.path),
    app.file.getCopy(),
  );
  if (success) {
    app.fileManager.updateFileAsSaved();
  } else {
    saveFileAs();
  }
};

/**
 * @description ask the app to "save as", to write to a new file.
 * this can be called from the front-end or the back-end.
 */
export const saveFileAs = async (): Promise<void> => {
  if (!app.file) {
    return;
  }
  const path = await window.api.saveFileAs(app.file.getCopy());
  if (path) {
    app.fileManager.updateFileAsSavedAs(path);
  }
};
