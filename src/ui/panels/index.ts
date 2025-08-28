import type { Component } from "svelte";

import ViewportsPanel from "./ViewportsPanel.svelte";
import FramesPanel from "./FramesPanel.svelte";
import FramePanel from "./FramePanel.svelte";
import FilePanel from "./FilePanel.svelte";
import HistoryPanel from "./HistoryPanel.svelte";
import EmbeddingsPanel from "./EmbeddingsPanel.svelte";

const Panels: { name: string, component: Component }[] = [
  { name: "Viewports", component: ViewportsPanel },
  { name: "Embeddings", component: EmbeddingsPanel },
  { name: "Frames", component: FramesPanel },
  { name: "History", component: HistoryPanel },
  { name: "File", component: FilePanel },
  { name: "Frame", component: FramePanel },
];

export default Panels;

