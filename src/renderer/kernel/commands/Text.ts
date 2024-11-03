import { type Command } from "./Command.svelte.ts";

export class TextCommand implements Command {
  static name: string = "text";
  text: string;

  constructor(text: string) {
    this.text = text;
  }

  get asString(): string {
    return this.text;
  }

  get asTokenString(): string {
    return this.text;
  }

  execute(): void {
    return undefined;
  }

  undo(): void {
    // empty
  }
}
