/**
 * files here are accessible to both the back-end and front-end.
 * very important! do not include any node core modules.
 */

/**
 * @description the name of the app
 */
export const APP_NAME = "Document App";

/**
 * @description The "native" file type which this app modifies.
 * The app is able to modify (import and export) many other file types,
 * but there should be only one native type.
 */
export const DOCUMENT_EXTENSION = "txt";

/**
 * @description the human readable name for the above format.
 */
export const DOCUMENT_TYPE_NAME = "Text files";

/**
 * @description the default file name for a new file
 */
export const UNTITLED_FILENAME = `untitled.${DOCUMENT_EXTENSION}`;
