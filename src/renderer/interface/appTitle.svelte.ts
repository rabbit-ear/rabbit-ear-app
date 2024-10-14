import { APP_NAME, UNTITLED_FILENAME } from "../app/constants.svelte.ts";
import app from "../app/App.svelte.ts";

const filename: string = $derived(
  app.file?.path === undefined ? UNTITLED_FILENAME : app.file.path.file,
);
const modifiedMark: string = $derived(app.file?.modified ? " *" : "");

// description Watch "FilePath" for any changes, update the window title
// to include the currently opened filename.
const appTitle: string = $derived(`${APP_NAME} - ${filename}${modifiedMark}`);

let previousAppTitle = "";

// description update the system app title name to include the file name
// and the asterisk indicator if the file has unsaved changes; but only
// send an update if the desired and the current titles differ.
//const unbind = $effect.root(() => {
$effect.root(() => {
  $effect(() => {
    if (appTitle === previousAppTitle) {
      return;
    }
    previousAppTitle = appTitle;
    window.api?.setAppTitle(appTitle);
  });
  return (): void => { };
});
