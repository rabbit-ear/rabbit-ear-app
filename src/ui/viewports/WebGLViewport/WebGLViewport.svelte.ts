import type { Component } from "svelte";
import type { Viewport } from "../Viewport";
import type { Embedding } from "../../../graphs/Embedding.ts";
import type { Ruler } from "../../../rulers/Ruler.ts";
import type { GraphUpdateEvent } from "../../../graphs/Updated.ts";
import Dropdown from "./Dropdown.svelte";
import ClassPanel from "./Panel.svelte";
import ViewportComponent from "./Component.svelte";
import { Style } from "./Style.svelte.ts";
import { WebGLModels } from "./WebGLModels.svelte.ts";
import { Settings } from "./Settings.svelte.ts";
import { WebGLView } from "./WebGLView.svelte.ts";
import { WebGLSnap } from "./WebGLSnap.svelte.ts";
import { WebGLRendering } from "./WebGLRendering.svelte.ts";
import { RenderPerspective, RenderStyle } from "../types.ts";
import { CreasePattern } from "../../../graphs/CreasePattern/CreasePattern.svelte.ts";
import { FoldedForm } from "../../../graphs/FoldedForm/FoldedForm.svelte.ts";
import { Simulator } from "../../../graphs/Simulator/Simulator.svelte.ts";
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
  webGLModels: WebGLModels;
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

  #effects: (() => void)[];

  constructor() {
    this.id = String(Math.random());
    this.component = ViewportComponent;
    this.dropdown = Dropdown;
    this.view = new WebGLView(this);
    this.snap = new WebGLSnap(this);
    this.style = new Style(this);
    this.webGLModels = new WebGLModels(this);
    this.rendering = new WebGLRendering(this);
    this.#effects = [
      this.#effectModelStyle(),
      this.#effectModelPerspective(),
    ];
  }

  unbindTool(): void {
    // console.log("WebGLViewport unbindTool()");
    this.webGLModels.unbindTool();
  }

  dealloc(): void {
    this.webGLModels.dealloc();
    this.rendering.dealloc();
    this.#effects.forEach(fn => fn());
  }

  #setModelStyle(embedding: Embedding | undefined): void {
    console.log("WebGLViewport() setModelStyle");
    if (!embedding) { return; }
    switch (embedding.constructor) {
      case CreasePattern:
        this.style.renderStyle = RenderStyle.creasePattern;
        break;
      case Simulator:
        this.style.renderStyle = RenderStyle.foldedForm;
        break;
      case FoldedForm:
      default:
        this.style.renderStyle = embedding.attributes.hasLayerOrder
          ? RenderStyle.foldedForm
          : RenderStyle.translucent;
        break;
    }
  }

  #setModelPerspective(embedding: Embedding | undefined): void {
    console.log("WebGLViewport() setModelPerspective");
    if (!embedding) { return; }
    this.view.perspective = embedding.attributes.dimension === 2
      ? RenderPerspective.orthographic
      : RenderPerspective.perspective;
  }

  #effectModelStyle(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          this.embedding,
          // this.embedding?.embeddingUpdate?.reset,
          // this.embedding?.embeddingUpdate?.structural,
          // this.embedding?.embeddingUpdate?.isomorphic.coords,
          this.embedding?.embeddingUpdate?.isomorphic.faceOrders,
          // this.embedding?.embeddingUpdate?.isomorphic.assignments,
          // this.embedding?.embeddingUpdate?.isomorphic.foldAngles,
        ];
        this.#setModelStyle(this.embedding);
      });
      // empty
      return () => { };
    });
  }

  #effectModelPerspective(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const _ = [
          this.embedding,
          // this.embedding?.embeddingUpdate?.reset,
          // this.embedding?.embeddingUpdate?.structural,
          // this.embedding?.embeddingUpdate?.isomorphic.coords,
          // this.embedding?.embeddingUpdate?.isomorphic.faceOrders,
          // this.embedding?.embeddingUpdate?.isomorphic.assignments,
          // this.embedding?.embeddingUpdate?.isomorphic.foldAngles,
        ];
        this.#setModelPerspective(this.embedding);
      });
      // empty
      return () => { };
    });
  }
}

