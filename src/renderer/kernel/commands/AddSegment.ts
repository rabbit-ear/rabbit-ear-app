import { type Command } from "./Command.svelte.ts";
import { formatJavascript } from "../format.ts";
import app from "../../app/App.svelte.ts";

export class AddSegment implements Command {
  static name: string = "addSegment";
  #x1: number;
  #y1: number;
  #x2: number;
  #y2: number;
  #backup: string | undefined;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.#x1 = x1;
    this.#y1 = y1;
    this.#x2 = x2;
    this.#y2 = y2;
  }

  paramsString(): string {
    return [this.#x1, this.#y1, this.#x2, this.#y2]
      .map((n) => JSON.stringify(n))
      .join(", ");
  }

  get asString(): string {
    return `${this.constructor.name}(${this.paramsString()})`;
  }

  get asTokenString(): string {
    return formatJavascript(this.asString);
  }

  execute(): void {
    this.#backup = app.fileManager.file.getCopy();
    //app.fileManager.file.geometry.addSegment(this.#x1, this.#y1, this.#x2, this.#y2);
    app.models.geometry.addSegment(this.#x1, this.#y1, this.#x2, this.#y2);
  }

  undo(): void {
    if (this.#backup) {
      app.fileManager.file.update(this.#backup);
    }
  }
}
