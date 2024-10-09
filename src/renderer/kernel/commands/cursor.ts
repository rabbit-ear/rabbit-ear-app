import { type Command } from "./command.ts";
import { formatJavascript } from "../format.ts";

export class CursorCommand implements Command {
  static name: string = "cursor";
  private cursor: string;
  private previousCursor: string | null;

  constructor(cursor: string) {
    this.cursor = cursor;
    this.previousCursor =
      document.body.style.cursor || getComputedStyle(document.body)["cursor"];
  }

  get asString(): string {
    return `${CursorCommand.name}(${JSON.stringify(this.cursor)})`;
  }

  get asTokenString(): string {
    return formatJavascript(this.asString);
  }

  execute(): any {
    this.previousCursor =
      document.body.style.cursor || getComputedStyle(document.body)["cursor"];
    document.body.style.cursor = this.cursor;
  }

  undo(): any {
    if (this.previousCursor) {
      document.body.style.cursor = this.previousCursor;
    } else {
    }
  }
}
