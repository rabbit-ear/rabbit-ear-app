import type { Component } from "svelte";

import ViewportsPanel from "./ViewportsPanel.svelte";
import FramesPanel from "./FramesPanel.svelte";
import FramePanel from "./FramePanel.svelte";
import FilePanel from "./FilePanel.svelte";
import HistoryPanel from "./HistoryPanel.svelte";
import EmbeddingsPanel from "./EmbeddingsPanel.svelte";

const Panels: { name: string, component: Component }[] = [
  { name: "File", component: FilePanel },
  { name: "Frames", component: FramesPanel },
  { name: "Frame", component: FramePanel },
  { name: "History", component: HistoryPanel },
  { name: "Embeddings", component: EmbeddingsPanel },
  { name: "Viewports", component: ViewportsPanel },
];

export default Panels;

