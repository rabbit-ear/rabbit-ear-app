import { type Command } from "./Command.svelte.ts";
import { formatJavascript } from "../format.ts";
import app from "../../app/App.svelte.ts";

export class AddCircle implements Command {
  static name: string = "addCircle";
  #cx: number;
  #cy: number;
  #r: number;
  #backup: string | undefined;

  constructor(cx: number, cy: number, r: number) {
    this.#cx = cx;
    this.#cy = cy;
    this.#r = r;
  }

  paramsString(): string {
    return [this.#cx, this.#cy, this.#r].map((n) => JSON.stringify(n)).join(", ");
  }

  get asString(): string {
    return `${AddCircle.name}(${this.paramsString()})`;
  }

  get asTokenString(): string {
    return formatJavascript(this.asString);
  }

  execute(): string {
    this.#backup = app.file.getCopy();
    app.file.geometry.addCircle(this.#cx, this.#cy, this.#r);
    return "circle";
  }

  undo(): void {
    if (this.#backup) {
      app.file.update(this.#backup);
    }
  }
}
