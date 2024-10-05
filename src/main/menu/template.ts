import { app, BrowserWindow, type MenuItemConstructorOptions } from "electron";

export const makeTemplate = (window: BrowserWindow): MenuItemConstructorOptions[] => {
  const send = (channel: string, ...args: string[]): void =>
    window && window.webContents && window.webContents.send
      ? window.webContents.send(channel, ...args)
      : undefined;
  return [
    {
      label: app.name,
      role: "appMenu",
      submenu: [
        {
          role: "about",
        },
        {
          type: "separator",
        },
        {
          role: "hide",
        },
        {
          role: "hideOthers",
        },
        {
          role: "unhide",
        },
        {
          type: "separator",
        },
        {
          type: "normal",
          accelerator: "CommandOrControl+Q",
          click: () => send("menuQuit"),
          label: "Quit",
        },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          type: "normal",
          accelerator: "CommandOrControl+N",
          click: () => send("menuNew"),
          label: "New",
        },
        {
          type: "normal",
          accelerator: "CommandOrControl+O",
          click: () => send("menuOpen"),
          label: "Open",
        },
        {
          type: "separator",
        },
        {
          type: "normal",
          accelerator: "CommandOrControl+S",
          click: () => send("menuSave"),
          label: "Save",
        },
        {
          type: "normal",
          accelerator: "CommandOrControl+Shift+S",
          click: () => send("menuSaveAs"),
          label: "Save As",
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          role: "undo",
        },
        {
          role: "redo",
        },
        {
          type: "separator",
        },
        {
          role: "cut",
        },
        {
          role: "copy",
        },
        {
          role: "paste",
        },
        {
          type: "separator",
        },
        {
          role: "selectAll",
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          role: "toggleDevTools",
        },
        {
          type: "separator",
        },
        {
          role: "togglefullscreen",
        },
      ],
    },
    {
      role: "window",
      submenu: [
        {
          role: "minimize",
        },
        {
          role: "close",
        },
      ],
    },
  ];
};
