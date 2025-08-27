import type { Command } from "./Command.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import type { FOLDChildFrame } from "rabbit-ear/types.js";
import type { GraphData } from "../graphs/GraphData.svelte.ts";

export class AppendFrameCommand implements Command {
  constructor(
    private doc: FileDocument,
    private newFrame: FOLDChildFrame) {
  }

  spliceIndex: number | undefined;

  execute(): void {
    this.doc.updateSource((data: GraphData): GraphUpdateModifier | undefined => {
      this.spliceIndex = data.source.length;
      data.source.push(this.newFrame);
      data.frameIndex = this.spliceIndex;
      return { reset: true };
    });
  }

  undo(): void {
    this.doc.updateSource((data: GraphData): GraphUpdateModifier | undefined => {
      if (this.spliceIndex === undefined) { return; }
      data.source.splice(this.spliceIndex, 1);
      data.frameIndex = Math.max(0, Math.min(data.source.length - 1, data.frameIndex));
      return { reset: true };
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

