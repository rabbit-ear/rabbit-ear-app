import type { FilePathInfo } from "../../main/fs/path.ts";
import app from "../app/App.svelte.ts";
import file from "../model/file.svelte.ts";

/**
 * @description this method is bound directly to the window DragEvent "ondrop"
 * and will fire when the user drags in a file from the system into the app.
 */
export const fileDropDidUpdate = async (event: DragEvent): Promise<void> => {
  // drag and drop file event object does not contain
  // the filename, we have to store it here and re-match later.
  let info: FilePathInfo;

  const fileOnLoad = (event: ProgressEvent<FileReader>): void => {
    if (event.target && event.target.result && typeof event.target.result === "string") {
      app.model.setFromString(event.target.result);
      file.info = info;
      file.modified = false;
    }
  };

  if (event.dataTransfer && event.dataTransfer.items) {
    const filenames = [...event.dataTransfer.files].map((el) => el.name);

    // todo: el.item.kind can be a "string", I think it might be possible to support this.
    const transferFile = [...event.dataTransfer.items]
      .map((item, i) => ({ item, filename: filenames[i] }))
      .filter((el) => el.item.kind === "file")
      .map((el) => ({ ...el, contents: el.item.getAsFile() }))
      .shift();

    if (transferFile) {
      // todo: for some reason, File type (contents) does not contain .path, but it does.
      info = await window.api.makeFilePathInfo(transferFile.contents.path);

      //console.log(transferFile.contents.path);
      const reader = new FileReader();
      reader.onload = fileOnLoad;
      if (transferFile.contents) {
        reader.readAsText(transferFile.contents);
      }
    }
  }
};
