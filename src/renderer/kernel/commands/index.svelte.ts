// import ear from "rabbit-ear";
import { AddCircle } from "./AddCircle.ts";
import { AddSegment } from "./AddSegment.ts";
import { BackgroundColor } from "./Background.ts";
import { Cursor } from "./Cursor.ts";
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
  // todo: revisit these method return types
  [AddCircle.name]: (cx: number, cy: number, radius: number): void =>
    app.invoker.executeCommand(new AddCircle(cx, cy, radius)),
  [AddSegment.name]: (x1: number, y1: number, x2: number, y2: number): void =>
    app.invoker.executeCommand(new AddSegment(x1, y1, x2, y2)),
  [BackgroundColor.name]: (color: string): string =>
    app.invoker.executeCommand(new BackgroundColor(color)),
  [Cursor.name]: (cursor: string): void => app.invoker.executeCommand(new Cursor(cursor)),
};

export default scope;
