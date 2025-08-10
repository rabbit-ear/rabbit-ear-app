import type { FOLDChildFrame } from "rabbit-ear/types.js";

export class FrameSettings {
  viewMatrix: number[] = $state([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  static makeFromFOLDFrame(frame: FOLDChildFrame): FrameSettings {
    const settings = new FrameSettings();
    return settings;
  }
}
