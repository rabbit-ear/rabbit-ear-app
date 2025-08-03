import { exit } from "@tauri-apps/plugin-process";
// import { saveFileAs } from "./save.svelte.ts";
// import { unsavedChangesDialog } from "../system/dialogs.ts";
import context from "../app/context.svelte.ts";

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
  if (await context.fileController.requestCloseAll()) {
    quitInProgress = true;
    exit();
  }
};

// export const quitApp = async (): Promise<void> => {
//   // console.log("quit app request");
//   if (file.modified) {
//     // todo: when 3-button dialogs are re-introduced this needs updating
//     const response = await unsavedChangesDialog();
//     if (response === false) {
//       const info = await saveFileAs();
//       // save was cancelled
//       if (info === undefined) {
//         return;
//       }
//       console.log(info);
//     }
//     // temporarily mute "cance" until Tauri has 3-button dialogs
//     // if (response === 1) {
//     //   return;
//     // }
//   }
//   quitInProgress = true;
//   exit();
// };

/**
 * @description Protection for quitting the app with the "X" or red circle.
 * This will prompt the user if there are unsaved changes.
 */
// todo: this does not work, currently do to an issue which is already
// reported on Github, where MacOS before quit handler is missed.
// window.addEventListener("beforeunload", (event) => {
//   if (!file.modified || quitInProgress) {
//     return;
//   }
//   event.preventDefault();
//   // https://github.com/electron/electron/issues/7977
//   event.returnValue = false;
//   setTimeout(async () => {
//     // 0: "yes", 1: "cancel", 2: "no"
//     const response = await unsavedChangesDialog();
//     // quitInProgress = response === 2;
//     quitInProgress = response === true;
//     if (response === false) {
//       // set quitInProgress based on the result of saveFileAs
//       const info = await saveFileAs();
//       console.log(info);
//       if (info === undefined) {
//         // save was cancelled
//         return;
//       } else {
//         // save successful
//         exit();
//       }
//     }
//     if (response === true) {
//       exit();
//     }
//   });
// });
