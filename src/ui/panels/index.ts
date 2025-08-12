import type { Component } from "svelte";

import ViewportsPanel from "./ViewportsPanel.svelte";
import FramesPanel from "./FramesPanel.svelte";
import FramePanel from "./FramePanel.svelte";
import FilePanel from "./FilePanel.svelte";
import HistoryPanel from "./HistoryPanel.svelte";
// import ModelsPanel from "./ModelsPanel/ModelsPanel.svelte";

const Panels: { name: string, component: Component }[] = [
  { name: "Viewports", component: ViewportsPanel },
  { name: "Frames", component: FramesPanel },
  { name: "Frame", component: FramePanel },
  { name: "File", component: FilePanel },
  { name: "History", component: HistoryPanel },
  // { name: "View Models", component: ModelsPanel },
];

export default Panels;

