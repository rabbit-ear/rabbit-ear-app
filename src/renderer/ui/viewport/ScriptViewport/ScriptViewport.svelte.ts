import type { Component } from "svelte";
import type { Panel } from "../../panel/panel.ts";
import type {
  ViewportEvents,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../events.ts";
import { ViewportStatics, unsetViewportEvents, type Viewport } from "../viewport.ts";
import ViewportComponent from "./ViewportComponent.svelte";
//import { ViewportPanel } from "./Panels/Panel.svelte.ts";
//import { ClassPanel } from "./Panels/ClassPanel.svelte.ts";
//import settings from "./Settings/ClassSettings.svelte.ts";

export class ScriptViewport extends ViewportStatics implements Viewport, ViewportEvents {
  //static settings = settings;
  //static panel = new ClassPanel();

  component: Component;
  panel: Panel;

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
    super();
    this.component = ViewportComponent;
    //this.panel = new ViewportPanel();
  }

  dealloc(): void {
    unsetViewportEvents(this);
    // todo
  }
}
