import { UI } from "../ui/UI.svelte.ts";
import { FileManager } from "./FileManager.svelte.ts";
import { FileController } from "./FileController.svelte.ts";
import { UNTITLED_FILENAME, APP_NAME } from "../system/constants.ts";

export class EditorContext {
  readonly fileManager: FileManager;
  readonly fileController: FileController;
  // UI is optional, the app is able to run without a UI.
  readonly ui: UI | undefined;

  // private listeners = new Map<string, Set<(payload?: any) => void>>();

  /**
   * @description Watch "FilePath" for any changes, update the window title
   * to include the currently opened filename.
   */
  appTitle: string = $derived.by<string>(() => {
    const file = this.fileManager.activeDocument;
    if (!file) { return UNTITLED_FILENAME; }
    // const displayName = file.info === undefined ? UNTITLED_FILENAME : file.info.file;
    const displayName = !file.path ? UNTITLED_FILENAME : file.path;
    const savedIndicator = file.dirty ? " *" : "";
    return `${APP_NAME} - ${displayName}${savedIndicator}`;
  });

  // drag and drop. communicates with the backend.
  // true if the user is dragging a file onto the app window.
  dragIsHovering: boolean = $state(false);

  constructor() {
    this.fileManager = new FileManager();
    this.fileController = new FileController(this.fileManager);
    this.ui = new UI();
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.ui?.dealloc();
  }

  // on(event: string, handler: (payload?: any) => void) {
  //   if (!this.listeners.get(event)) { this.listeners.set(event, new Set()); }
  //   this.listeners.get(event)?.add(handler);
  // }

  // off(event: string, handler: (payload?: any) => void) {
  //   this.listeners.get(event)?.delete(handler);
  // }

  // emit(event: string, payload?: any) {
  //   this.listeners.get(event)?.forEach(fn => fn(payload));
  // }
}

