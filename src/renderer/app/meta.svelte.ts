import file from "../model/file.svelte.ts";

/**
 * @description the name of the app
 */
export const APP_NAME = "Rabbit Ear";

/**
 * @description The "native" file type which this app modifies.
 * The app is able to modify (import and export) many other file types,
 * but there should be only one native type.
 */
export const EXTENSION = "txt";

/**
 * @description the default file name for a new file
 */
export const UNTITLED_FILENAME = `untitled.${EXTENSION}`;

/**
 * @description Watch "FilePath" for any changes, update the window title
 * to include the currently opened filename.
 */
const appTitle = $derived.by<string>(() => {
  const displayName = file.info === undefined ? UNTITLED_FILENAME : file.info.file;
  const savedIndicator = file.modified ? " *" : "";
  return `${APP_NAME} - ${displayName}${savedIndicator}`;
});

export const getAppTitle = (): string => appTitle;
