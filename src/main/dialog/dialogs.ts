import { dialog } from "electron";

export const unsavedChanges = (yesString: string = "Proceed", noString: string = "Cancel") => (
  dialog.showMessageBox({
    message: "You have unsaved progress",
    title: "Are you sure?",
    type: "question",
    buttons: [yesString, noString],
  })
);

