import { type Command } from "./Command.svelte.ts";
import { execute } from "../shell.svelte.ts";
import { formatJavascript } from "../format.ts";

export class JavascriptCommand implements Command {
  private js: string;

  constructor(js: string) {
    this.js = js;
  }

  get asString(): string {
    return this.js;
  }

  get asTokenString(): string {
    return formatJavascript(this.asString);
  }

  execute(): unknown {
    return execute(this.js);
  }

  //undo(): void {
  undo(): unknown {
    console.log("todo: undo", this.js);
  }
}
