import type { FOLD } from "rabbit-ear/types.d.ts";
import { type Command } from "./Command.svelte.ts";
import { formatJavascript } from "../format.ts";
import app from "../../app/App.svelte.ts";

export class AddPath implements Command {
  static name: string = "addPath";
  #d: string;
  #backup: FOLD | undefined;

  constructor(d: string) {
    this.#d = d;
  }

  paramsString(): string {
    return this.#d;
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
      name: "path",
      params: { d: this.#d },
    });
  }

  undo(): void {
    if (this.#backup) {
      app.fileManager.file.import(this.#backup);
    }
  }
}
