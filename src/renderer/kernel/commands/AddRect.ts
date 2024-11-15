import type { FOLD } from "rabbit-ear/types.d.ts";
import { type Command } from "./Command.svelte.ts";
import { formatJavascript } from "../format.ts";
import app from "../../app/App.svelte.ts";

export class AddRect implements Command {
  static name: string = "addRect";
  #x: number;
  #y: number;
  #width: number;
  #height: number;
  #backup: FOLD | undefined;

  constructor(x: number, y: number, width: number, height: number) {
    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;
  }

  paramsString(): string {
    return [this.#x, this.#y, this.#width, this.#height]
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
    this.#backup = app.fileManager.file.export();
    app.fileManager.file?.shapes.push({
      name: "rect",
      params: { x: this.#x, y: this.#y, width: this.#width, height: this.#height },
    });
  }

  undo(): void {
    if (this.#backup) {
      app.fileManager.file.import(this.#backup);
    }
  }
}
