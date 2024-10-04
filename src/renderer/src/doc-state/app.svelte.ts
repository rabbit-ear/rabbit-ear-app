import { APP_NAME, UNTITLED_FILENAME } from "../../../global/constants.ts";
import file from "./file.svelte.ts";

/**
 * @description Watch "FilePath" for any changes, update the window title
 * to include the currently opened filename.
 */
const appTitle = $derived.by<string>(() => {
  const displayName = file.info === undefined ? UNTITLED_FILENAME : file.info.file;
  const savedIndicator = file.modified ? " *" : "";
  return `${APP_NAME} - ${displayName}${savedIndicator}`;
});

export const getAppTitle = () => appTitle;

