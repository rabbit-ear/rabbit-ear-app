import type { Component } from "svelte";
import type { Viewport } from "../Viewport";
import type { Embedding } from "../../../graphs/Embedding.ts";
import type { Ruler } from "../../../rulers/Ruler.ts";
import type { GraphUpdateEvent } from "../../../graphs/Updated.ts";
import Dropdown from "./Dropdown.svelte";
import ClassPanel from "./Panel.svelte";
import ViewportComponent from "./Component.svelte";
import { Style } from "./Style.svelte.ts";
import { GLModels } from "./GLModels.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import { WebGLView } from "./WebGLView.svelte.ts";
import { WebGLSnap } from "./WebGLSnap.svelte.ts";
import { WebGLRendering } from "./WebGLRendering.svelte.ts";
import context from "../../../app/context.svelte.ts";

export class WebGLViewport implements Viewport {
  static name: string = "WebGL Viewport";
  static settings: Settings = new Settings();
  static panel: Component = ClassPanel;

  id: string;
  component: Component;
  dropdown: Component;
  domElement?: HTMLCanvasElement;

  view: WebGLView;
  snap: WebGLSnap; // todo
  style: Style;
  glModels: GLModels;
  rendering: WebGLRendering;

  gl: WebGLRenderingContext | WebGL2RenderingContext | undefined = $state();
  version: number = $state(2);

  embeddingName = $state("creasePattern");
  embedding: Embedding | undefined = $derived(context.fileManager.document?.data?.getEmbedding(this.embeddingName));
  embeddingUpdate: GraphUpdateEvent | undefined = $derived(this.embedding?.embeddingUpdate);

  rulers?: Ruler[] = $derived(context.fileManager.document?.data?.frame.rulers.allRulers);

  // in the HTMLCanvas component, the window onresize event will be
  // be bound to this. this is also necessary for setting the canvasSize.
  redraw?: () => void = $state();

  didMount?: () => void;

  constructor() {
    this.id = String(Math.random());
    this.component = ViewportComponent;
    this.dropdown = Dropdown;
    this.view = new WebGLView(this);
    this.snap = new WebGLSnap(this);
    this.style = new Style(this);
    this.glModels = new GLModels(this);
    this.rendering = new WebGLRendering(this);
  }

  unbindTool(): void {
    // console.log("WebGLViewport unbindTool()");
    this.glModels.unbindTool();
  }

  dealloc(): void {
    this.glModels.dealloc();
    this.style.dealloc();
  }
}

