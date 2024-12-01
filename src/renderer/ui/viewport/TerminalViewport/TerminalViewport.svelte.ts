import type { Component } from "svelte";
import type { IViewport, ViewportEvents } from "../ViewportTypes.ts";
import { unsetViewportEvents } from "../ViewportTypes.ts";
import ViewportComponent from "./Viewport.svelte";
import { Events } from "./Events.svelte.ts";
import { TerminalReprint } from "./TerminalReprint.svelte.ts";
import settings from "./Settings.svelte.ts";

export class TerminalViewport implements IViewport, ViewportEvents {
  static settings: typeof settings = settings;

  component: Component;
  terminalTextarea: Element = $state();
  terminalValue: string = $state();

  events: Events;
  reprint: TerminalReprint;

  props?: object = $state();

  onkeydown?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;

  redraw?: () => void;

  constructor() {
    this.component = ViewportComponent;
    this.reprint = new TerminalReprint();
    this.events = new Events(this.reprint);
    this.onkeydown = this.events.onkeydown;
    this.onkeyup = this.events.onkeyup;
  }

  unbindTool(): void {
    unsetViewportEvents(this);
    this.props = undefined;
  }

  resetView(): void {
    // empty
  }

  dealloc(): void {
    // empty
  }
}
