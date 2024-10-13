import app from "../app/App.svelte.ts";

/**
 * @description ask the app to save the currently opened file.
 * this can be called from the front-end or the back-end.
 */
export const saveFile = async (): Promise<void> => {
  // fileInfo.value is an object and a Proxy (due to Svelte 5), this method
  // will attempt to clone it, can't clone a proxy, so we shallow copy.
  // const success = await window.api.saveFile({ ...fileInfo.value }, model.value);
  const success = await window.api.saveFile(
    $state.snapshot(app.file.path),
    app.file.valueAsString(),
  );
  if (success) {
    app.file.modified = false;
  } else {
    saveFileAs();
  }
};

/**
 * @description ask the app to "save as", to write to a new file.
 * this can be called from the front-end or the back-end.
 */
export const saveFileAs = async (): Promise<void> => {
  const info = await window.api.saveFileAs(app.file.valueAsString());
  if (info) {
    app.file.path = info;
    app.file.modified = false;
  }
};
