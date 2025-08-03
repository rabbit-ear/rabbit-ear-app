import type { Component } from "svelte";

import ViewportsPanel from "./ViewportsPanel.svelte";
// import AppPanel from "./AppPanel/AppPanel.svelte";
// import FramesPanel from "./FramesPanel/FramesPanel.svelte";
// import FramePanel from "./FramePanel/FramePanel.svelte";
// import HistoryPanel from "./HistoryPanel/HistoryPanel.svelte";
// import ModelsPanel from "./ModelsPanel/ModelsPanel.svelte";

const Panels: { name: string, component: Component }[] = [
  { name: "Viewports", component: ViewportsPanel },
  // { name: "App", component: AppPanel },
  // { name: "Frames", component: FramesPanel },
  // { name: "Frame", component: FramePanel },
  // { name: "History", component: HistoryPanel },
  // { name: "View Models", component: ModelsPanel },
];

export default Panels;

