import { dialog, type MessageBoxReturnValue } from "electron";

export const unsavedChanges = (
  yesString: string = "Proceed",
  noString: string = "Cancel",
): Promise<MessageBoxReturnValue> =>
  dialog.showMessageBox({
    message: "You have unsaved progress",
    title: "Are you sure?",
    type: "question",
    buttons: [yesString, noString],
  });
