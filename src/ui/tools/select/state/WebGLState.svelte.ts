import { type Box } from "rabbit-ear/types.js";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { Deallocable } from "../../Deallocable.ts";
import type { Viewport } from "../../../viewports/Viewport.ts";
import type { ToolEvents } from "../../ToolEvents.ts";
import type { WebGLViewport } from "../../../viewports/WebGLViewport/WebGLViewport.svelte.ts";
import type {
  ElementArray,
  GLModel,
  VertexArray,
} from "../../../viewports/WebGLViewport/GLModel.ts";
import { vectorFromScreenLocation, zoomViewMatrix } from "../../../../general/matrix.ts";
import { createProgram } from "rabbit-ear/webgl/general/webgl.js";
import draw_rect_100_vert from "./shaders/draw-rect-100.vert?raw";
import draw_rect_100_frag from "./shaders/draw-rect-100.frag?raw";
import { makeUniforms } from "./uniforms.ts";
import {
  makeVertexArrays,
  makeElementArrays,
} from "./arrays.ts";
import { Touches } from "./Touches.svelte.ts";

export class WebGLState implements GLModel, Deallocable, ToolEvents {
  viewport: WebGLViewport;
  touches: Touches;
  zIndex?: number | undefined = 100;

  constructor(viewport: WebGLViewport) {
    this.viewport = viewport;
    this.touches = new Touches(this.viewport);
    this.#effects = [
      this.#deleteProgram(),
      this.#deleteVertexArrays(),
      this.#deleteElementArrays(),
      this.#timer(),
    ];

    this.viewport.glModels.toolModel = this;
  }

  dealloc(): void {
    this.#effects.forEach((cleanup) => cleanup());
  }

  box: Box | undefined = $derived.by(() => {
    if (!this.touches.press || !this.touches.drag) {
      return undefined;
    }
    const points = [
      $state.snapshot(this.touches.press),
      $state.snapshot(this.touches.drag),
    ];
    return boundingBox(points);
  });

  touchBounds: [number, number, number, number] = $derived([
    this.box?.min[0] ?? 0,
    this.box?.min[1] ?? 0,
    this.box?.max[0] ?? 0,
    this.box?.max[1] ?? 0,
  ]);

  rect: { x: number; y: number; width: number; height: number } | undefined = $derived(
    this.box && this.box.span
      ? {
        x: this.box.min[0],
        y: this.box.min[1],
        width: this.box.span[0],
        height: this.box.span[1],
      }
      : undefined,
  );

  time: number = $state(0);

  program: WebGLProgram | undefined = $derived.by(() => {
    try {
      if (!this.viewport.gl) { return undefined; }
      return createProgram(this.viewport.gl, draw_rect_100_vert, draw_rect_100_frag);
    } catch {
      return undefined;
    }
  });

  vertexArrays: VertexArray[] = $derived.by(() => this.viewport.gl && this.program
    ? makeVertexArrays(this.viewport.gl, this.program)
    : []);

  elementArrays: ElementArray[] = $derived.by(() => this.viewport.gl
    ? makeElementArrays(this.viewport.gl)
    : []);

  flags: number[] = $state([]);

  uniformInputs = $derived.by(() => ({
    projectionMatrix: this.viewport.view.projection,
    modelViewMatrix: this.viewport.view.modelView,
    touchBounds: this.touchBounds,
    canvas: this.viewport.domElement,
    time: this.time,
  }));

  uniforms = $derived(makeUniforms(this.uniformInputs));

  #effects: (() => void)[];

  onmousemove(viewport: Viewport, event: MouseEvent): void {
    event.preventDefault();
    const { buttons } = event;
    const point = vectorFromScreenLocation(
      // [event.clientX, event.clientY],
      [event.offsetX, event.offsetY],
      viewport.view.canvasSize,
      viewport.view.projection,
    );
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
  };

  onmousedown(viewport: Viewport, event: MouseEvent): void {
    event.preventDefault();
    const { buttons } = event;
    const point = vectorFromScreenLocation(
      // [event.clientX, event.clientY],
      [event.offsetX, event.offsetY],
      viewport.view.canvasSize,
      viewport.view.projection,
    );
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.press = point;
  };

  onmouseup(viewport: Viewport, event: MouseEvent): void {
    const { buttons } = event;
    const point = vectorFromScreenLocation(
      // [event.clientX, event.clientY],
      [event.offsetX, event.offsetY],
      viewport.view.canvasSize,
      viewport.view.projection,
    );
    this.touches.move = buttons ? undefined : point;
    this.touches.drag = buttons ? point : undefined;
    this.touches.release = point;
  };

  onwheel(viewport: Viewport, event: WheelEvent): void {
    const { deltaY } = event;
    if (deltaY !== undefined) {
      const delta = -deltaY * (viewport.constructor as WebGLViewport).settings.scrollSensitivity;
      if (Math.abs(delta) < 1e-3) { return; }
      viewport.view.view = zoomViewMatrix(
        viewport.view.perspective,
        viewport.view.view,
        delta,
      );
    }
  };

  #deleteProgram(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const program = this.program;
      });
      return () => {
        if (this.program && this.viewport.gl) {
          this.viewport.gl.deleteProgram(this.program);
        }
      };
    });
  }

  #deleteVertexArrays(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const vas = this.vertexArrays;
      });
      return () => {
        if (this.viewport.gl) {
          this.vertexArrays.forEach(v => v.buffer && this.viewport.gl?.deleteBuffer(v.buffer));
        }
      };
    });
  }

  #deleteElementArrays(): () => void {
    return $effect.root(() => {
      $effect(() => {
        const eas = this.elementArrays;
      });
      return () => {
        if (this.viewport.gl) {
          this.elementArrays.forEach(e => e.buffer && this.viewport.gl?.deleteBuffer(e.buffer));
        }
      };
    });
  }

  #timer(): () => void {
    return $effect.root(() => {
      let loop: number | undefined;
      $effect(() => {
        loop = setInterval(() => {
          this.time = performance.now();
        }, 1000 / 60);
      });
      return () => {
        if (loop !== undefined) {
          clearInterval(loop);
        }
      };
    });
  }
}
