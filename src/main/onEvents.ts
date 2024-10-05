import { BrowserWindow, type IpcMainEvent } from "electron";

/**
 * these are the simple renderer-to-main one way events which use
 * ipcRenderer.send() and ipcMain.on()
 */

export const setAppTitle = (event: IpcMainEvent, title: string): void => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (!win) {
    return;
  }
  win.setTitle(title);
};
