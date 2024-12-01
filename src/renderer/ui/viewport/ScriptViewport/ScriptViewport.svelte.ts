import type { Component } from "svelte";
import type {
  IViewport,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../ViewportTypes.ts";
import { unsetViewportEvents } from "../ViewportTypes.ts";
import ViewportComponent from "./ViewportComponent.svelte";
//import { ViewportPanel } from "./Panels/Panel.svelte.ts";
//import { ClassPanel } from "./Panels/ClassPanel.svelte.ts";
//import settings from "./Settings/ClassSettings.svelte.ts";

export class ScriptViewport implements IViewport {
  //static settings = settings;
  //static panel = new ClassPanel();

  component: Component;
  panel: Component;

  redraw?: () => void = $state();

  onmousemove?: (event: ViewportMouseEvent) => void;
  onmousedown?: (event: ViewportMouseEvent) => void;
  onmouseup?: (event: ViewportMouseEvent) => void;
  onmouseleave?: (event: ViewportMouseEvent) => void;
  onwheel?: (event: ViewportWheelEvent) => void;
  ontouchstart?: (event: ViewportTouchEvent) => void;
  ontouchend?: (event: ViewportTouchEvent) => void;
  ontouchmove?: (event: ViewportTouchEvent) => void;
  ontouchcancel?: (event: ViewportTouchEvent) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;

  constructor() {
    this.component = ViewportComponent;
    //this.panel = new ViewportPanel();
  }

  unbindTool(): void {
    unsetViewportEvents(this);
    // todo
  }

  resetView(): void {
    // empty
  }

  dealloc(): void {
    // empty
  }
}
