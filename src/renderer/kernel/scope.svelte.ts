// import ear from "rabbit-ear";
import { BackgroundColorCommand } from "./commands/background.ts";
import { CursorCommand } from "./commands/cursor.ts";
import { invoker } from "./invoker.svelte.ts";

// all command should be bound to this scope object.

// the context which will bind to the Function's this.
// const context = Object.assign({ ...ear }, Commands);
export const scope = {
  // invoker,
  [BackgroundColorCommand.name]: (color: string) =>
    invoker.executeCommand(new BackgroundColorCommand(color)),
  [CursorCommand.name]: (cursor: string) =>
    invoker.executeCommand(new CursorCommand(cursor)),
};
