import type { Component } from "svelte";
import type { Viewport } from "../Viewport.ts";
import type { Embedding } from "../../../graphs/Embedding.ts";
import type { Ruler } from "../../../rulers/Ruler.ts";
import type { GraphUpdateEvent } from "../../../graphs/Updated.ts";
import Dropdown from "./Dropdown.svelte";
import ClassPanel from "./Panel.svelte";
import ViewportComponent from "./Component.svelte";
import { SVGRendering } from "./SVGRendering.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import { SVGView } from "./SVGView.svelte.ts";
import { SVGSnap } from "./SVGSnap.svelte.ts";
import { Style } from "./Style.svelte.ts";
import { Grid } from "./Grid.svelte.ts";
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
  style: Style;
  snap: SVGSnap;
  view: SVGView;
  rendering: SVGRendering;

  embeddingName = $state("creasePattern");
  embedding: Embedding | undefined = $derived(context.fileManager.document?.data?.getEmbedding(this.embeddingName));
  embeddingUpdate: GraphUpdateEvent | undefined = $derived(this.embedding?.embeddingUpdate);

  rulers?: Ruler[] = $derived(context.fileManager.document?.data?.frame.rulers.allRulers);

  // the SVG Viewport comes with the ability to instantiate a <g> layer.
  // currently, this is used by the tools to draw indicator marks.
  layer?: Component = $state();
  //props?: object & SVGAttributes<SVGGElement> = $state();
  props?: object = $state();

  // todo: somehow we need to be able to swap viewports (WebGL to SVG)
  // and carry over the style settings (view and render style).
  constructor() {
    this.id = String(Math.random());
    this.component = ViewportComponent;
    this.dropdown = Dropdown;
    this.view = new SVGView(this);
    this.style = new Style(this);
    this.grid = new Grid(this);
    this.snap = new SVGSnap(this);
    this.rendering = new SVGRendering(this);
  }

  unbindTool(): void {
    // console.log("SVGViewport unbindTool()");
    this.layer = undefined;
    this.props = undefined;
  }

  dealloc(): void {
    this.rendering.dealloc();
  }
}

