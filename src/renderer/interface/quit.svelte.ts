import file from "../model/file.svelte.ts";

/**
 * @description methods available to both the front and back ends.
 * This is the front-end's counterpart to src/main/index.ts, these methods
 * exist on the front-end side, but can be called from either front or back end.
 */

let quitInProgress = false;

/**
 * @description ask the app to quit.
 * this can be called from the front-end or the back-end.
 * The request must pass through the front end because we need to check
 * with the model (on the front-end) whether or not there are unsaved changes.
 */
export const quitApp = async (): Promise<void> => {
  // console.log("quit app request");
  if (file.modified) {
    const { response } = await window.api.unsavedChangesDialog();
    if (response !== 0) {
      return;
    }
  }
  quitInProgress = true;
  window.api.quitApp();
};

/**
 * @description Protection for quitting the app with the "X" or red circle.
 * This will prompt the user if there are unsaved changes.
 */
window.addEventListener("beforeunload", (event) => {
  if (!file.modified || quitInProgress) {
    return;
  }
  event.preventDefault();
  // https://github.com/electron/electron/issues/7977
  event.returnValue = false;
  setTimeout(async () => {
    const { response } = await window.api.unsavedChangesDialog();
    quitInProgress = response === 0;
    if (response === 0) {
      window.api.quitApp();
    }
  });
});
