import { type Command } from "./command.ts";
import { formatJavascript } from "../format.ts";

export class BackgroundColorCommand implements Command {
  static name: string = "background";
  private color: string;
  private previousColor: string | null;

  constructor(color: string) {
    this.color = color;
    this.previousColor =
      document.body.style.backgroundColor ||
      getComputedStyle(document.body)["background-color"];
  }

  get asString(): string {
    return `${BackgroundColorCommand.name}(${JSON.stringify(this.color)})`;
  }

  get asTokenString(): string {
    return formatJavascript(this.asString);
  }

  execute(): any {
    this.previousColor =
      document.body.style.backgroundColor ||
      getComputedStyle(document.body)["background-color"];
    document.body.style.backgroundColor = this.color;
  }

  undo(): any {
    if (this.previousColor) {
      document.body.style.backgroundColor = this.previousColor;
    } else {
    }
  }
}
