import file from "./file.svelte.ts";
import { storageKeys, getStorageBoolean } from "./localStorage.svelte.ts";
import { UI } from "./UI.svelte.ts";
import { FileManager } from "./FileManager.svelte.ts";
import { FileController } from "./FileController.svelte.ts";
import { UNTITLED_FILENAME, APP_NAME } from "../system/constants.ts";

class Application {
  // UI is optional, the app is able to run without a UI.
  ui: UI | undefined;
  fileManager: FileManager;
  fileController: FileController;

  // custom effect.root will be unbound when this component is deallocated
  unbind: (() => void)[] = [];

  // if the X axis is to the right, is the Y axis up (right handed) or down (left).
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $state(getStorageBoolean(storageKeys.rightHanded, true));

  /**
   * @description Watch "FilePath" for any changes, update the window title
   * to include the currently opened filename.
   */
  appTitle: string = $derived.by<string>(() => {
    const displayName = file.info === undefined ? UNTITLED_FILENAME : file.info.file;
    const savedIndicator = file.modified ? " *" : "";
    return `${APP_NAME} - ${displayName}${savedIndicator}`;
  });

  // drag and drop. communicates with the backend.
  // true if the user is dragging a file onto the app window.
  dragIsHovering: boolean = $state(false);

  constructor() {
    this.fileManager = new FileManager();
    this.fileController = new FileController(this.fileManager);
    this.ui = new UI();
    this.unbind = [this.#bindToLocalStorage()];
  }

  #bindToLocalStorage(): () => void {
    return $effect.root(() => {
      $effect(() => {
        localStorage.setItem(storageKeys.rightHanded, String(this.rightHanded));
      });
      return () => { };
    });
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.ui?.dealloc();
    this.unbind.forEach((fn) => fn());
  }
}

export default new Application();

// const app = new Application();
// // @ts-ignore requires re-typing window object
// window.app = app;
// export default app;
//
