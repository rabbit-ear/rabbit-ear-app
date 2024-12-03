import { untrack } from "svelte";
//import { subtract2 } from "rabbit-ear/math/vector.js";
import type { Deallocable } from "../../UITool.ts";
import type { SVGViewport } from "../../../viewport/SVGViewport/SVGViewport.svelte.ts";
import { panCameraMatrix } from "../matrix.ts";
import { SVGEvents } from "../events/SVGEvents.ts";

export class ToolState {
  press: [number, number] | undefined = $state();
  move: [number, number] | undefined = $state();
  drag: [number, number] | undefined = $state();

  viewport: SVGViewport;

  //dragVector: [number, number] = $derived(
  //  !this.drag || !this.press ? [0, 0] : subtract2(this.drag, this.press),
  //);
  dragVector: [number, number] = $state([0, 0]);

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  reset(): void {
    this.move = undefined;
    this.drag = undefined;
    this.press = undefined;
  }

  //doPan(): () => void {
  //  return $effect.root(() => {
  //    $effect(() => {
  //      if (!this.dragVector) {
  //        return;
  //      }
  //      const translation: [number, number] = [
  //        this.dragVector[0],
  //        this.dragVector[1] * (this.viewport.view.rightHanded ? -1 : 1),
  //      ];
  //
  //      untrack(() => {
  //        const impliedScale = this.viewport.view.view[0];
  //        translation[0] *= impliedScale;
  //        translation[1] *= impliedScale;
  //        //console.log("drag pan", this.dragVector, translation, impliedScale);
  //        this.viewport.view.camera = panCameraMatrix(
  //          this.viewport.view.camera,
  //          translation,
  //        );
  //      });
  //    });
  //    return () => {};
  //  });
  //}
}

export class SVGState implements Deallocable {
  viewport: SVGViewport;
  tool: ToolState;
  events: SVGEvents;
  unsub: (() => void)[] = [];

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
    this.tool = new ToolState(this.viewport);
    this.events = new SVGEvents(this.viewport, this.tool);
    //this.unsub.push(this.tool.doPan());
  }

  dealloc(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.tool.reset();
  }
}
