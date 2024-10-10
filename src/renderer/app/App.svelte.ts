import type { UI } from "../ui/UI.svelte.ts";
import { Model } from "../model/model.svelte.ts";
import { Invoker } from "../kernel/Invoker.svelte.ts";

class Application {
  invoker: Invoker;
  model: Model;
  // UI is optional, the app is able to run without a UI.
  // UI is added inside components/UI.svelte.
  ui: UI | undefined;

  constructor() {
    this.invoker = new Invoker();
    this.model = new Model();

    this.model.shapes.push({ name: "circle", params: { cx: 0, cy: 0, r: 1 } });
    this.model.shapes.push({
      name: "circle",
      params: { cx: 0.5, cy: 0.5, r: Math.SQRT1_2 },
    });
    this.model.shapes.push({ name: "rect", params: { x: 0, y: 0, width: 1, height: 1 } });
    this.model.shapes.push({ name: "line", params: { x1: 0, y1: 0, x2: 1, y2: 1 } });
    this.model.shapes.push({ name: "line", params: { x1: 1, y1: 0, x2: 0, y2: 1 } });
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
