import type { UI } from "../ui/UI.svelte.ts";
import { FileManager } from "../file/FileManager.svelte.ts";
import { Invoker } from "../kernel/Invoker.svelte.ts";
import * as Dialog from "../dialog/index.ts";
import Settings from "./Settings.svelte.ts";
import { Models } from "../model/Models.svelte.ts";
import { Simulator } from "../simulator/Simulator.svelte.ts";

// on-boot events, and example file
import craneString from "../../../resources/crane.fold?raw";
import { TextCommand } from "../kernel/commands/Text.ts";

class Application {
  settings: typeof Settings;
  invoker: Invoker;
  #fileManager: FileManager;
  models: Models;
  // UI is optional, the app is able to run without a UI.
  // UI is undefined here, initialized inside components/UI.svelte.
  ui: UI | undefined;
  dialog: typeof Dialog;
  simulator: Simulator;

  constructor() {
    this.settings = Settings;
    this.invoker = new Invoker();
    this.#fileManager = new FileManager();
    this.models = new Models(this.#fileManager);
    this.simulator = new Simulator(this.#fileManager);
    this.dialog = Dialog;

    // load example file
    this.#fileManager.loadUntitled(JSON.parse(craneString));

    this.bootInformation();
  }

  // some general app info to print to the console on boot
  async bootInformation(): Promise<void> {
    console.log(window, window.api);
    const baseDirectory = await window?.api?.getBaseDirectory?.();
    const bootInfo = baseDirectory
      ? `app started ${new Date()} from ${baseDirectory}`
      : `app started ${new Date()}`;
    this.invoker.executeCommand(new TextCommand(bootInfo));
  }

  get fileManager(): FileManager {
    return this.#fileManager;
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.ui?.dealloc();
    this.simulator?.dealloc();
  }
}

//export default new Application();
const app = new Application();
// @ts-ignore requires re-typing window object
window.app = app;
export default app;
