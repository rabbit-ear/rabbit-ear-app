//import type { Command, Tokenizable } from "./Command.svelte.ts";
import { formatCommandResult } from "../format.ts";

/**
 *
 */
export interface Tokenizable {
  get asString(): string;
  get asTokenString(): string; // with html tags
}

/**
 *
 */
export interface Command extends Tokenizable {
  // static name: string; // also need this
  execute(): unknown;
  undo(): unknown;
}

// export abstract class Command implements Tokenizable {
// 	static name: string;
// 	abstract execute(): any;
// 	abstract undo(): any;
// 	abstract get asString(): string;
//   abstract get asTokenString(): string; // with html tags
// }

export class CommandResult implements Tokenizable {
  #result: unknown;
  #isError: boolean;
  #stringified: string;

  get asString(): string {
    return this.#stringified;
  }

  get asTokenString(): string {
    // if (this.isError) { console.error(this.result); }
    return this.#isError
      ? `<span class="error">${this.#stringified}</span>`
      : `<span>${this.#stringified}</span>`;
  }

  constructor(result: unknown) {
    this.#isError = result instanceof Error;
    this.#result = result;
    this.#stringified = this.#isError
      ? `${this.#result}`
      : formatCommandResult(this.#result) || "";
  }
}

export type CommandAndResult = {
  command: Command;
  result: CommandResult;
};
