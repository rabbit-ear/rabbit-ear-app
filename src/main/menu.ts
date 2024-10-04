import { app, BrowserWindow, type MenuItemConstructorOptions } from "electron";

export const makeTemplate = (window: BrowserWindow): MenuItemConstructorOptions[] => {
  const send = (channel: string, ...args: any[]) => {
    // check if window.webContents exists.
    // if not, search other windows for the correct "main" window.
    // todo: unfortunately this does not solve the issue.
    if (!window || !window.webContents || !window.webContents.send) {
      console.log("menu does not exist");
      // let count = BrowserWindow.getAllWindows()
      // .filter(b => {
      //   return b.isVisible()
      // })
      // .length
      return;
    }
    window.webContents.send(channel, ...args);
  };
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
