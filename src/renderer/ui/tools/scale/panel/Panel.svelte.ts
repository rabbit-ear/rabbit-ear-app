import type { Component } from "svelte";
import type { Panel } from "../../../panel/panel.ts";
import { GlobalState } from "../GlobalState.svelte.ts";
import PanelComponent from "./ToolPanel.svelte";
//import app from "../../../app/App.svelte.ts";

export class ToolPanel implements Panel {
  component: Component;
  globalState: GlobalState;

  title: string = "scale";

  constructor(globalState: GlobalState) {
    this.globalState = globalState;
    this.component = PanelComponent;

    // pass data back up through the viewport: assign the SVGLayer and
    // build the props object so that data can pass from here to the component.
    //const that = this;
    //this.viewport.props = {
    //  get fixedPoint(): SVGFixedPoint {
    //    return that.fixedPoint;
    //  },
    //};
  }

  dealloc(): void {
    // empty
  }
}
