import { Menu, MenuItem, Submenu, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { quitApp } from "./quit.ts";
import context from "../app/context.svelte.ts";
import t from "../app/t.ts";

export const buildMenu = async () => {
  // Will become the application submenu on MacOS
  const aboutSubmenu = await Submenu.new({
    text: 'About',
    items: [

      await MenuItem.new({
        id: 'About',
        text: t("menu.About"),
        action: () => { },
      }),

      await PredefinedMenuItem.new({
        text: 'separator-text',
        item: 'Separator',
      }),

      await PredefinedMenuItem.new({
        text: 'Hide',
        item: 'Hide',
      }),

      await PredefinedMenuItem.new({
        text: 'Separator',
        item: 'Separator',
      }),

      await PredefinedMenuItem.new({
        text: 'Services',
        item: 'Services',
      }),

      await PredefinedMenuItem.new({
        text: 'separator-text',
        item: 'Separator',
      }),

      await MenuItem.new({
        id: 'quit',
        text: t("menu.File.Quit"),
        action: quitApp,
        accelerator: "CmdOrCtrl+Q",
      }),
    ],
  });

  const fileSubmenu = await Submenu.new({
    text: t("menu.File"),
    items: [
      await MenuItem.new({
        id: 'new',
        text: t("menu.File.New"),
        // action: newFile,
        action: () => context.fileController.newFile(),
        accelerator: "CmdOrCtrl+N",
      }),

      await MenuItem.new({
        id: 'open',
        text: t("menu.File.Open"),
        // action: openFile,
        action: () => context.fileController.openFilesWithDialog(),
        accelerator: "CmdOrCtrl+O",
      }),

      await PredefinedMenuItem.new({
        text: 'separator-text',
        item: 'Separator',
      }),

      await MenuItem.new({
        id: 'save',
        text: t("menu.File.Save"),
        // action: saveFile,
        action: () => context.fileController.saveActiveDocument(),
        accelerator: "CmdOrCtrl+S",
      }),

      await MenuItem.new({
        id: 'save_as',
        text: t("menu.File.SaveAs"),
        // action: saveFileAs,
        action: () => context.fileController.saveActiveDocumentWithSaveAsDialog(),
        accelerator: "CmdOrCtrl+Shift+S",
      }),
    ],
  });

  const editSubmenu = await Submenu.new({
    text: t("menu.Edit"),
    items: [
      await PredefinedMenuItem.new({
        text: t("menu.Edit.Undo"),
        item: 'Undo',
      }),

      await PredefinedMenuItem.new({
        text: t("menu.Edit.Redo"),
        item: 'Redo',
      }),

      // await MenuItem.new({
      //   id: 'undo',
      //   text: 'Undo',
      //   action: () => {
      //     console.log('Undo clicked');
      //   },
      //   accelerator: "CmdOrCtrl+Z",
      // }),

      // await MenuItem.new({
      //   id: 'redo',
      //   text: 'Redo',
      //   action: () => {
      //     console.log('Redo clicked');
      //   },
      //   accelerator: "CmdOrCtrl+Shift+Z",
      // }),

      await PredefinedMenuItem.new({
        text: 'separator-text',
        item: 'Separator',
      }),

      await PredefinedMenuItem.new({
        text: t("menu.Edit.Cut"),
        item: 'Cut',
      }),

      await PredefinedMenuItem.new({
        text: t("menu.Edit.Copy"),
        item: 'Copy',
      }),

      await PredefinedMenuItem.new({
        text: t("menu.Edit.Paste"),
        item: 'Paste',
      }),

      await PredefinedMenuItem.new({
        text: t("menu.Edit.SelectAll"),
        item: 'SelectAll',
      }),
    ],
  });

  const viewSubmenu = await Submenu.new({
    text: t("menu.View"),
    items: [
      await PredefinedMenuItem.new({
        text: t("menu.View.Minimize"),
        item: "Minimize",
      })
    ],
  });

  const languageSubmenu = await Submenu.new({
    text: t("menu.Language"),
    items: await Promise.all(Object.entries(context.localization.allLanguages())
      .map(async ([iso, name]) => await MenuItem.new({
        id: name,
        text: name,
        action: () => context.localization.setLanguage(iso),
      }))),
  });

  return await Menu.new({
    items: [aboutSubmenu, fileSubmenu, editSubmenu, viewSubmenu, languageSubmenu],
  });
}

