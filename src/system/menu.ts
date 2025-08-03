import { Menu, MenuItem, Submenu, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { quitApp } from "../interface/quit.svelte";
import context from "../app/context.svelte.ts";

// Will become the application submenu on MacOS
const aboutSubmenu = await Submenu.new({
  text: 'About',
  items: [

    await MenuItem.new({
      id: 'About',
      text: 'About',
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
      text: 'Quit',
      action: quitApp,
      accelerator: "CmdOrCtrl+Q",
    }),
  ],
});

const fileSubmenu = await Submenu.new({
  text: 'File',
  items: [
    await MenuItem.new({
      id: 'new',
      text: 'New',
      // action: newFile,
      action: () => context.fileController.newFile(),
      accelerator: "CmdOrCtrl+N",
    }),
    await MenuItem.new({
      id: 'open',
      text: 'Open',
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
      text: 'Save',
      // action: saveFile,
      action: () => context.fileController.saveActiveDocument(),
      accelerator: "CmdOrCtrl+S",
    }),

    await MenuItem.new({
      id: 'save_as',
      text: 'Save As...',
      // action: saveFileAs,
      action: () => context.fileController.saveActiveDocumentWithSaveAsDialog(),
      accelerator: "CmdOrCtrl+Shift+S",
    }),
  ],
});

const editSubmenu = await Submenu.new({
  text: 'Edit',
  items: [
    await PredefinedMenuItem.new({
      text: 'Undo',
      item: 'Undo',
    }),
    await PredefinedMenuItem.new({
      text: 'Redo',
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
      text: 'Cut',
      item: 'Cut',
    }),
    await PredefinedMenuItem.new({
      text: 'Copy',
      item: 'Copy',
    }),
    await PredefinedMenuItem.new({
      text: 'Paste',
      item: 'Paste',
    }),
    await PredefinedMenuItem.new({
      text: 'Select All',
      item: 'SelectAll',
    }),
  ],
});

const viewSubmenu = await Submenu.new({
  text: "View",
  items: [
    await PredefinedMenuItem.new({
      text: "Minimize",
      item: "Minimize",
    })
  ],
});

const menu = await Menu.new({
  items: [aboutSubmenu, fileSubmenu, editSubmenu, viewSubmenu],
});

menu.setAsAppMenu();

