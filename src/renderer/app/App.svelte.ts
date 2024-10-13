import type { UI } from "../ui/UI.svelte.ts";
import { File } from "../file/File.svelte.ts";
import { Invoker } from "../kernel/Invoker.svelte.ts";

class Application {
  invoker: Invoker;
  file: File;
  // UI is optional, the app is able to run without a UI.
  // UI is added inside components/UI.svelte.
  ui: UI | undefined;

  constructor() {
    this.invoker = new Invoker();
    this.file = new File();
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc(): void {
    this.ui?.dealloc();
  }
}

//export default new Application();
const app = new Application();
// @ts-ignore requires re-typing window object
window.app = app;
export default app;
