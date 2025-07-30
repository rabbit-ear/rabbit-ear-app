import {
  readTextFile as fsReadTextFile,
  writeTextFile as fsWriteTextFile,
  writeFile as fsWriteFile,
} from "@tauri-apps/plugin-fs"

/**
 *
 */
export const readTextFile = (filePath: string): Promise<string> => {
  return fsReadTextFile(filePath);
};

/**
 *
 */
export const writeTextFile = (filePath: string, data: string): Promise<void> => {
  return fsWriteTextFile(filePath, data);
};

/**
 *
 */
export const writeFile = (filePath: string, data: Uint8Array): Promise<void> => {
  return fsWriteFile(filePath, data);
};

