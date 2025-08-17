import type { Component } from "svelte";
import type { Viewport } from "../Viewport.ts";
import type { Embedding } from "../../../graphs/Embedding.ts";
import Dropdown from "./Dropdown.svelte";
import ClassPanel from "./Panel.svelte";
import ViewportComponent from "./Component.svelte";
import { Settings } from "./Settings.svelte.ts";
import { SVGView } from "./View.svelte.ts";
import { Style } from "./Style.svelte.ts";
import { Grid } from "./Grid.svelte.ts";
import { Snap } from "./Snap.svelte.ts";
import context from "../../../app/context.svelte.ts";

export class SVGViewport implements Viewport {
  static name: string = "SVG Viewport";
  static settings: Settings = new Settings();
  static panel: Component = ClassPanel;

  id: string;
  component: Component;
  dropdown: Component;
  domElement?: SVGSVGElement;
  didMount?: () => void;

  grid: Grid;
  snap: Snap;
  style: Style;
  view: SVGView;

  // model?: Model = $state.raw();
  embeddingName = $state("creasePattern");
  // embeddingName = $derived.by(() => this.state.model);

  embedding?: Embedding = $derived(context.fileManager.document?.data[this.embeddingName]);

  // the SVG Viewport comes with the ability to instantiate a <g> layer.
  // currently, this is used by the tools to draw indicator marks.
  layer?: Component = $state();
  //props?: object & SVGAttributes<SVGGElement> = $state();
  props?: object = $state();

  redraw?: () => void = $state();

  // todo: somehow we need to be able to swap viewports (WebGL to SVG)
  // and carry over the style settings (view and render style).
  constructor() {
    this.id = String(Math.random());
    this.component = ViewportComponent;
    this.dropdown = Dropdown;
    this.view = new SVGView(this);
    this.style = new Style(this);
    this.grid = new Grid(this);
    this.snap = new Snap(this);
  }

  unbindTool(): void {
    console.log("SVGViewport unbindTool()");
    this.layer = undefined;
    this.props = undefined;
  }

  dealloc(): void {
    // empty
  }
}

