import { type Command } from "./Command.svelte.ts";
import { formatJavascript } from "../format.ts";

export class Cursor implements Command {
  static name: string = "cursor";
  private cursor: string;
  private previousCursor: string | null;

  constructor(cursor: string) {
    this.cursor = cursor;
    this.previousCursor =
      document.body.style.cursor || getComputedStyle(document.body)["cursor"];
  }

  get asString(): string {
    return `${this.constructor.name}(${JSON.stringify(this.cursor)})`;
  }

  get asTokenString(): string {
    return formatJavascript(this.asString);
  }

  execute(): void {
    this.previousCursor =
      document.body.style.cursor || getComputedStyle(document.body)["cursor"];
    document.body.style.cursor = this.cursor;
  }

  undo(): void {
    if (this.previousCursor) {
      document.body.style.cursor = this.previousCursor;
    } else {
    }
  }
}
