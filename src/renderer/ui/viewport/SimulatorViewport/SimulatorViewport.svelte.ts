import type { Component } from "svelte";
import type {
  IModelViewport,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../ViewportTypes.ts";
import { unsetViewportEvents } from "../ViewportTypes.ts";
//import ViewportComponent from "./Simulator.svelte";
import ViewportComponent from "./SimulatorSimple.svelte";
import { View } from "./Settings/View.svelte.ts";
import { Style } from "./Settings/Style.svelte.ts";
import Panel from "./Panel.svelte";
import Dropdown from "./Dropdown.svelte";
import settings from "./Settings/ClassSettings.svelte.ts";

export class SimulatorViewport implements IModelViewport {
  static settings = settings;
  static panel: Component = Panel;

  component: Component;
  panel: Component;

  view: View;
  style: Style;

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
    this.panel = Dropdown;
    this.view = new View();
    this.style = new Style();
    //this.panel = new ViewportPanel();
  }

  dealloc(): void {
    unsetViewportEvents(this);
    // todo
  }
}
