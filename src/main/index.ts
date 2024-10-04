import { app, shell, ipcMain, Menu, BrowserWindow } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { join } from "node:path";
import icon from "../../resources/icon.png?asset";
import { makeTemplate } from "./menu.ts";
import { setAppTitle } from "./oneWayEvents.ts";
import {
  openFile,
  saveFile,
  saveFileAs,
  pathJoin,
  makeFilePathInfo,
  unsavedChangesDialog,
} from "./twoWayEvents.ts";

// ipcMain sends signal from main to the renderer

const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  //mainWindow.webContents.openDevTools();

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC one-way events
  ipcMain.on("setAppTitle", setAppTitle);
  ipcMain.on("quitApp", () => app.quit());

  // IPC two-way events
  ipcMain.handle("unsavedChangesDialog", unsavedChangesDialog);
  ipcMain.handle("pathJoin", pathJoin);
  ipcMain.handle("openFile", openFile);
  ipcMain.handle("saveFile", saveFile);
  ipcMain.handle("saveFileAs", saveFileAs);
  ipcMain.handle("makeFilePathInfo", makeFilePathInfo);

  const mainWindow = createWindow();
  const menu = Menu.buildFromTemplate(makeTemplate(mainWindow));
  Menu.setApplicationMenu(menu);

  // currently we are making MacOS run like a Windows app, when the window closes,
  // the app closes. Here is the code for the typical mac behavior:
  //app.on("activate", function() {
  //  // On macOS it's common to re-create a window in the app when the
  //  // dock icon is clicked and there are no other windows open.
  //  if (BrowserWindow.getAllWindows().length === 0) createWindow();
  //});

  // regarding quitting the app, in order of event fire
  // this happens first, but only if the window was closed (X or red circle).
  app.on("window-all-closed", () => {
    // if (process.platform !== "darwin") {
    // 	app.quit();
    // }
    app.quit();
  });

  // // 1st to fire upon quit
  // app.on("before-quit", (event) => {});
  // // 2nd to fire upon quit
  // app.on("will-quit", (event) => {});
  // // 3rd to fire upon quit
  // app.on("quit", (event) => {});
});

