import type { Command } from "./Command.ts";
import type { GraphUpdateModifier } from "../graphs/Updated.ts";
import { FileDocument } from "../app/FileDocument.svelte.ts";
import type { FOLDChildFrame } from "rabbit-ear/types.js";
import type { GraphData } from "../graphs/GraphData.svelte.ts";
import { Frame } from "../graphs/Frame.ts";

export class AppendFrameCommand implements Command {
  constructor(
    private doc: FileDocument,
    private newFrame: FOLDChildFrame) {
  }

  spliceIndex: number | undefined;

  execute(): void {
    this.doc.updateData((data: GraphData): GraphUpdateModifier | undefined => {
      this.spliceIndex = data.frames.length;
      data.frames.push(new Frame(this.newFrame));
      data.frameIndex = this.spliceIndex;
      return { reset: true };
    });
  }

  undo(): void {
    this.doc.updateData((data: GraphData): GraphUpdateModifier | undefined => {
      if (this.spliceIndex === undefined) { return; }
      data.frames.splice(this.spliceIndex, 1);
      data.frameIndex = Math.max(0, Math.min(data.frames.length - 1, data.frameIndex));
      return { reset: true };
    });
  }

  tryMerge(other: Command): boolean {
    return false;
  }
}

