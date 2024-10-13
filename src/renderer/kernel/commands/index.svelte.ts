// import ear from "rabbit-ear";
import { AddCircle } from "./AddCircle.ts";
import { BackgroundColorCommand } from "./background.ts";
import { CursorCommand } from "./cursor.ts";
// this might cause a circular reference, scope inherits app, app inherits Invoker.
import app from "../../app/App.svelte.ts";

// all command should be bound to this scope object.

// the context which will bind to the Function's this.
// const context = Object.assign({ ...ear }, Commands);

/**
 * @description The "scope" to be bound to the function which executes all commands
 * that are executed by the invoker: Function().bind(scope).
 * This object contains all commands able to be executed.
 */
const scope = {
  // invoker,
  [AddCircle.name]: (cx: number, cy: number, r: number): string =>
    app.invoker.executeCommand(new AddCircle(cx, cy, r)),
  [BackgroundColorCommand.name]: (color: string): string =>
    app.invoker.executeCommand(new BackgroundColorCommand(color)),
  [CursorCommand.name]: (cursor: string) =>
    app.invoker.executeCommand(new CursorCommand(cursor)),
};

export default scope;
