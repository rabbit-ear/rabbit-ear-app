import { type Command } from "./Command.svelte.ts";
import { formatJavascript } from "../format.ts";

export class BackgroundColor implements Command {
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
    return `${this.constructor.name}(${JSON.stringify(this.color)})`;
  }

  get asTokenString(): string {
    return formatJavascript(this.asString);
  }

  execute(): string {
    this.previousColor =
      document.body.style.backgroundColor ||
      getComputedStyle(document.body)["background-color"];
    document.body.style.backgroundColor = this.color;
    return this.color;
  }

  undo(): any {
    if (this.previousColor) {
      document.body.style.backgroundColor = this.previousColor;
    } else {
    }
  }
}
