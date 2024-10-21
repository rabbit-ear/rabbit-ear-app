import type { Component } from "svelte";
import type { Panel } from "../../../panel/panel.ts";
import PanelComponent from "./PanelComponent.svelte";
//import app from "../../../app/App.svelte.ts";

export class FramesPanel implements Panel {
  component: Component = PanelComponent;
  title: string = "File Frames";

  constructor() {
    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    //const that = this;
    //this.viewport.props = {
    //  get fixedPoint(): SVGFixedPoint {
    //    return that.fixedPoint;
    //  },
    //};
  }
}
