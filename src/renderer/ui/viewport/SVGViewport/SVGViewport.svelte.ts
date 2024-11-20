import type { Component } from "svelte";
import type { VecLine2 } from "rabbit-ear/types.js";
import type { IModel } from "../../../model/Models.svelte.ts";
import type {
  IModelViewport,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../ViewportTypes.ts";
import { unsetViewportEvents } from "../ViewportTypes.ts";
import { Grid } from "./Settings/Grid.svelte.ts";
import { Snap } from "./Settings/Snap.svelte.ts";
import { View } from "./Settings/View.svelte.ts";
import { Style } from "./Settings/Style.svelte.ts";
import settings from "./Settings/Settings.svelte.ts";
import ViewportPanel from "./Dropdown.svelte";
import ClassPanel from "./Panel.svelte";
import ViewportComponent from "./ViewportComponent.svelte";
import { clipLineInPolygon } from "./clip.ts";
import app from "../../../app/App.svelte.ts";

export class SVGViewport implements IModelViewport {
  static name: string = "SVG Viewport";
  static settings: typeof settings = settings;
  static panel: Component = ClassPanel;
  //static panel: Panel = new ClassPanel();

  component: Component;
  panel: Component;

  model?: IModel = $state.raw();

  grid: Grid;
  snap: Snap;
  style: Style;
  view: View;

  // the SVG Viewport comes with the ability to instantiate a <g> layer.
  // currently, this is primarily used by the tools, to draw indicator marks.
  layer?: Component = $state();
  //props?: object & SVGAttributes<SVGGElement> = $state();
  props?: object = $state();

  // a UI touch event, coming from a pointer device, will have some
  // built-in error correcting (like snapping, for example), and this behavior
  // is zoom-level dependent. Use this variable to get an appropriate error-
  // correcting value.
  uiEpsilon: number = $derived.by(() => this.view.vmax * settings.uiEpsilonFactor);

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
    this.panel = ViewportPanel;
    this.view = new View(this);
    this.style = new Style(this.view);
    this.grid = new Grid(this.view);
    this.snap = new Snap(this, this.view);
    this.model = app.models.cp;
  }

  dealloc(): void {
    unsetViewportEvents(this);
    this.layer = undefined;
    this.props = undefined;
  }

  clipLine(line: VecLine2): [number, number][] | undefined {
    return clipLineInPolygon(line, this.view.viewBoxPolygon);
  }
}
