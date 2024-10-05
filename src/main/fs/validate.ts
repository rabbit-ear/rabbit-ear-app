import { dialog } from "electron";
import type { FilePathInfo } from "./path.ts";

/**
 *
 */
export const validateFileType = async (fileInfo: FilePathInfo): Promise<boolean> => {
  // list all supported extensions here
  switch (fileInfo.extension.toLowerCase()) {
    case "": // files without an extension might appear here?
    case ".js":
    case ".json":
    case ".txt":
      return true;
    default:
      await dialog.showMessageBox({
        message: `${fileInfo.extension} file type not supported`,
        title: "Unknown File Type",
        type: "error",
      });
      return false;
  }
};
