import type { Component } from "svelte";
import type { Viewport } from "../viewport.ts";
import type { ViewportEvents } from "../events.ts";
import { unsetViewportEvents } from "../viewport.ts";
import ViewportComponent from "./Viewport.svelte";
import settings from "./Settings.svelte.ts";
import { invoker } from "../../../kernel/invoker.svelte.ts";

export class TerminalViewport implements Viewport, ViewportEvents {
  static settings: typeof settings = settings;

  component: Component;
  terminalTextarea: Element;
  terminalValue: string;

  props?: object = $state();

  onkeydown?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;
  redraw?: () => void;

  constructor() {
    this.component = ViewportComponent;
  }

  dealloc(): void {
    unsetViewportEvents(this);
    this.props = undefined;
  }
}

/**
 * @description a subroutine of the TerminalReprint store. get the
 * commandHistory and return the item at the index parameter,
 * or an empty string if length of 0.
 */
const getCommandFromHistory = (index: number): string => {
  if (!invoker.commandHistory.length) {
    return "";
  }
  let arrayIndex = index % invoker.commandHistory.length;
  arrayIndex += arrayIndex < 0 ? invoker.commandHistory.length : 0;
  return invoker.commandHistory[arrayIndex];
};

/**
 * @description This captures the behavior of being at a terminal input and
 * using the up/down arrow keys to scroll through the history.
 * The value of this writable store is an integer, the index of the currently
 * selected command in the history. Call "increment" or "decrement" and a side-
 * effect will fire, one which will get() the invoker.commandHistory and
 * return the string of the currently selected command in the history.
 */
export const TerminalReprint = (() => {
  let value = $state(0);
  return {
    get value() {
      return value;
    },
    set value(newValue) {
      value = newValue;
    },
    increment: (): string => {
      value += 1;
      return getCommandFromHistory(value);
    },
    decrement: (): string => {
      value -= 1;
      return getCommandFromHistory(value);
    },
  };
})();
