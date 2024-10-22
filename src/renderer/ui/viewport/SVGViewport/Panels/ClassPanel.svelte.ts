import type { Component } from "svelte";
import type { Panel } from "../../../panel/panel.ts";
import ClassPanelComponent from "./ClassPanelComponent.svelte";

export class ClassPanel implements Panel {
  component: Component = ClassPanelComponent;
  title: string = "SVG Viewports";

  cursor: [number, number] = $state();

  constructor() {
    // empty
  }
}
