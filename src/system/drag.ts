import { getCurrentWebview } from "@tauri-apps/api/webview";
import { stat, readDir, type DirEntry } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import context from "../app/context.svelte.ts";

const processEntriesRecursively = async (parent: string, entries?: DirEntry[]): Promise<string[]> => {
  if (!entries) { entries = await readDir(parent); }
  // todo: consider checking if these files start with a . dot (invisible file)
  const onlyFiles: string[] = await Promise.all(entries
    .filter(entry => entry.isFile)
    .map(async (el) => await join(parent, el.name)));
  const subdirFiles: string[][] = await Promise.all(entries
    .filter(entry => entry.isDirectory)
    .map(async (entry) => {
      const dir = await join(parent, entry.name);
      return await processEntriesRecursively(dir, await readDir(dir));
    }));
  return onlyFiles.concat(subdirFiles.flat());
}

// user may have dragged in a directory.
const resolvePayloadPaths = async (paths: string[]): Promise<string[]> => {
  const fileInfos = await Promise.all(paths
    .map(async (path: string) => await stat(path)));
  const pathsAndInfos = paths
    .map((path, i) => ({ path, info: fileInfos[i] }));

  // these are the files located in the local directory root (not absolute root)
  const rootFilePaths = pathsAndInfos
    .filter(el => el.info.isFile)
    .map(el => el.path);

  // if the user dropped a folder, recursively gather all files contained inside
  const nestedFiles: string[] = (await Promise
    .all(pathsAndInfos
      .filter(el => el.info.isDirectory)
      .map(el => el.path)
      .map(async (dirPath) => await processEntriesRecursively(dirPath))))
    .flat();

  return rootFilePaths.concat(nestedFiles);
};

let dragDropUnlisten: (() => void) | undefined = await getCurrentWebview()
  .onDragDropEvent(async (event) => {
    if (event.payload.type === "over") {
      context.dragIsHovering = true;
    } else if (event.payload.type === "drop") {
      context.dragIsHovering = false;
      const filePaths = await resolvePayloadPaths(event.payload.paths);
      await context.fileController.openFilesWithPaths(filePaths);
    } else {
      context.dragIsHovering = false;
    }
  });

// todo:
// in Rust there is a listener for before the app closes,
// that is currently not working on MacOS (known issue on Github).
// when it works again, call this method from Rust.
export const removeDragDropListener = () => {
  if (dragDropUnlisten !== undefined) {
    dragDropUnlisten();
  }
  dragDropUnlisten = undefined;
};

