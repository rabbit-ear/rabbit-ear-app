import type { Component } from "svelte";
import type { VecLine2 } from "rabbit-ear/types.js";
import type { Viewport } from "../viewport.ts";
import type {
  ViewportEvents,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../events.ts";
import type { Panel } from "../../panel/panel.ts";
import { ViewportStatics, unsetViewportEvents } from "../viewport.ts";
import { clipLineInPolygon } from "./clip.ts";
import { Grid } from "./Settings/Grid.svelte.ts";
import { Snap } from "./Settings/Snap.svelte.ts";
import { View } from "./Settings/View.svelte.ts";
import ViewportComponent from "./ViewportComponent.svelte";
import settings from "./Settings/ClassSettings.svelte.ts";
import { Style } from "./Settings/Style.svelte.ts";
import { ViewportPanel } from "./Panels/Panel.svelte.ts";
import { ClassPanel } from "./Panels/ClassPanel.svelte.ts";

export class SVGViewport extends ViewportStatics implements Viewport, ViewportEvents {
  static settings: typeof settings = settings;
  static panel: Panel = new ClassPanel();

  component: Component;
  panel: Panel;

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
    super();
    this.component = ViewportComponent;
    this.view = new View();
    this.style = new Style(this.view);
    this.grid = new Grid(this.view);
    this.snap = new Snap(this.view);
    this.panel = new ViewportPanel();
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
