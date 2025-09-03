import type { Component } from "svelte";

import ViewPanel from "./ViewPanel.svelte";
import FramesPanel from "./FramesPanel.svelte";
import FramePanel from "./FramePanel.svelte";
import FilePanel from "./FilePanel.svelte";
import HistoryPanel from "./HistoryPanel.svelte";
import EmbeddingsPanel from "./EmbeddingsPanel.svelte";

const Panels: { name: string, component: Component }[] = [
  { name: "View", component: ViewPanel },
  { name: "Embeddings", component: EmbeddingsPanel },
  { name: "Frames", component: FramesPanel },
  { name: "Graph", component: FramePanel },
  { name: "File", component: FilePanel },
  { name: "History", component: HistoryPanel },
];

export default Panels;

