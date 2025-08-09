import { UI } from "../ui/UI.svelte.ts";
import { APP_NAME } from "../system/constants.ts";
import { FileManager } from "./FileManager.svelte.ts";
import { FileController } from "./FileController.svelte.ts";
import { KeyboardManager } from "./KeyboardManager.svelte.ts";
import { Localization } from "./Localization.svelte.ts";
import { Settings } from "./Settings.svelte.ts";

export class EditorContext {
  fileManager: FileManager;
  fileController: FileController;
  keyboardManager: KeyboardManager;
  localization: Localization;
  settings: Settings;
  // UI is optional, the app is able to run without a UI.
  ui: UI | undefined;

  // the title of the application, with the currently active file,
  // and an additional asterisk if the file is modified and not yet saved
  appTitle: string = $derived.by<string>(() => {
    const savedIndicator = this.fileManager.document?.dirty ? " *" : "";
    return `${APP_NAME} - ${this.fileManager.activeFileName}${savedIndicator}`;
  });

  // drag and drop. communicates with the backend.
  // true if the user is dragging a file onto the app window.
  dragIsHovering: boolean = $state(false);

  constructor() {
    this.fileManager = new FileManager();
    this.fileController = new FileController(this.fileManager);
    this.keyboardManager = new KeyboardManager();
    this.localization = new Localization();
    this.settings = new Settings();
    this.ui = new UI();
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.keyboardManager.dealloc();
    this.ui?.dealloc();
  }
}

