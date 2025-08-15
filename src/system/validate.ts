import { message } from "@tauri-apps/plugin-dialog";
import type { FilePathInfo } from "./path.ts";
import { EXTENSIONS } from "./constants.ts";

/**
 *
 */
export const validateFileType = async (fileInfo?: FilePathInfo): Promise<boolean> => {
  if (!fileInfo) { return false; }

  // const f = await open(selected);
  // const fileInfo = await f.stat();
  // await f.close();
  // // user selected a single file
  // if (!fileInfo.isFile) { return; }

  if (EXTENSIONS.includes(fileInfo.extension)) {
    return true;
  }
  await message(`${fileInfo.extension} file type not supported`,
    {
      title: "Unknown File Type",
      kind: "error",
    });
  return false;
};
