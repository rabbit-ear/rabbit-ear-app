import { untrack } from "svelte";
//import { subtract2 } from "rabbit-ear/math/vector.js";
import type { Deallocable } from "../Deallocable.ts";
import type { Viewport } from "../../viewports/Viewport.ts";
import type { SVGViewport } from "../../viewports/SVGViewport/SVGViewport.svelte.ts";
import type { ToolEvents } from "../ToolEvents.ts";
import { scale2, subtract2 } from "rabbit-ear/math/vector.js";
import { wheelEventZoomMatrix, wheelPanMatrix, panCameraMatrix } from "./matrix.ts";
import { getSVGViewportPoint } from "../../viewports/SVGViewport/touches.ts";

export class SVGState implements Deallocable, ToolEvents {
  viewport: SVGViewport;
  press: [number, number] | undefined = $state();
  move: [number, number] | undefined = $state();
  drag: [number, number] | undefined = $state();
  //dragVector: [number, number] = $derived(
  //  !this.drag || !this.press ? [0, 0] : subtract2(this.drag, this.press),
  //);
  dragVector: [number, number] = $state([0, 0]);
  cameraMatrixOnPress: number[];
  clientPress: [number, number] = [0, 0];

  unsub: (() => void)[] = [];

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
    //this.unsub.push(this.tool.doPan());
  }

  // onmousemove(viewport: Viewport, { x, y, buttons }: MouseEvent): void {
  onmousemove(viewport: Viewport, { clientX, clientY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    this.move = buttons ? undefined : point;
    this.drag = buttons ? point : undefined;
    this.dragVector =
      !this.drag || !this.press
        ? [0, 0]
        : subtract2(this.drag, this.press);
    const impliedScale = this.viewport.view.view[0];
    // todo: this scale is arbitrary. needs to be a factor of the
    const drag = scale2(subtract2([clientX, clientY], this.clientPress), 1 / 300);

    if (this.drag && this.press) {
      const translation: [number, number] = [
        drag[0] * impliedScale,
        drag[1] * impliedScale,
        //drag[1] * impliedScale * (this.viewport.view.rightHanded ? -1 : 1),
      ];

      this.viewport.view.camera = panCameraMatrix(this.cameraMatrixOnPress, translation);
    }
  };

  onmousedown(viewport: Viewport, { clientX, clientY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    this.move = buttons ? undefined : point;
    this.drag = buttons ? point : undefined;
    this.press = point;
    this.dragVector = [0, 0];
    this.clientPress = [clientX, clientY];
    this.cameraMatrixOnPress = this.viewport.view.camera;
  };

  onmouseup(viewport: Viewport, { clientX, clientY, buttons }: MouseEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    this.move = buttons ? undefined : point;
    this.drag = buttons ? point : undefined;
    // this.release = point;
    this.dragVector = [0, 0];
    this.clientPress = [0, 0];
    this.reset();
  };

  // onmouseleave = (event: ViewportMouseEvent) => {
  // 	this.tool.reset();
  // };

  // new plan for onwheel
  // all tools must implement the "zoomTool.onwheel?.(event);" behavior.
  // there is no longer an app-wide fallthrough that executes that method
  // if no tool wheel event exists. the tool must specify the behavior explicitly.

  onwheel(viewport: Viewport, { clientX, clientY, deltaX, deltaY }: WheelEvent): void {
    const point = getSVGViewportPoint(viewport, [clientX, clientY]);
    // todo: I thought i renamed this to the class names, SVGViewport for example
    const type: string = "svg"; // this.viewport.type;
    switch (type) {
      case "svg":
        return wheelPanMatrix(this.viewport, { deltaX, deltaY });
      case "webgl":
        return wheelEventZoomMatrix(this.viewport, { point, deltaY });
      default:
        return wheelEventZoomMatrix(this.viewport, { point, deltaY });
    }
  };

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

  reset(): void {
    this.move = undefined;
    this.drag = undefined;
    this.press = undefined;
  }

  dealloc(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.reset();
  }
}

