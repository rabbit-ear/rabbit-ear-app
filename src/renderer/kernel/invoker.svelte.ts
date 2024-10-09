import type { Command, Tokenizable } from "./commands/command.ts";
import { JavascriptCommand } from "./commands/jsCommand.ts";
import { formatCommandResult } from "./format.ts";
import { matchFromArray } from "./arrays.ts";
import { scope } from "./scope.svelte.ts";

const stringifyArgs = (...args: any[]): string =>
  `${args.map((v) => JSON.stringify(v)).join(", ")}`;

class CommandResult implements Tokenizable {
  private result: any;
  private isError: boolean;
  private stringified: string;

  get asString(): string {
    return this.stringified;
  }

  get asTokenString(): string {
    // if (this.isError) { console.error(this.result); }
    return this.isError
      ? `<span class="error">${this.stringified}</span>`
      : `<span>${this.stringified}</span>`;
  }

  constructor(result: any) {
    this.isError = result instanceof Error;
    this.result = result;
    this.stringified = this.isError ? `${result}` : formatCommandResult(result) || "";
  }
}

export type CommandAndResult = {
  command: Command;
  result: CommandResult;
};

class Invoker {
  public history = $state<CommandAndResult[]>([]);
  public redoStack = $state<CommandAndResult[]>([]);

  /**
   * @description An array of the history of the command inputs.
   * This contains the inputs only, no results. There is no HTML span wrapper.
   */
  public historyAsHTML = $derived<string[]>(
    this.history.flatMap(({ command, result }) => [
      `<span>${command.asTokenString}</span>`,
      `<span class="result">${result.asTokenString}</span>`,
    ]),
  );

  /**
   * @description An array of the history of the command inputs.
   * This contains the inputs only, no results. There is no HTML span wrapper.
   */
  public commandHistory = $derived<string[]>(
    this.history.map(({ command }) => command.asString),
  );

  executeCommand(command: Command): any {
    const res = command.execute();
    const result = new CommandResult(res);
    // an alternative to this system of checking might be to always print out the
    // javascript command, perhaps give it a class="metadata" third type of class,
    // always print the javascript command and possibly? print out the other
    // commands...? maybe. not sure how undo would work though.
    if (
      command instanceof JavascriptCommand &&
      matchFromArray(command.asString, Object.keys(scope)).length
    ) {
      // console.log(`! 3b invoker: skipping javascript command ${command.asString}`);
    } else {
      this.history.push({ command, result });
    }
    // clear the redo history
    this.redoStack = [];
    return result;
  }

  executeJavascript(js: string): any {
    return this.executeCommand(new JavascriptCommand(js));
  }

  /**
   * @description This is a more user-friendly alternative to "executeJavascript"
   * intended for only one method call, and it can include method arguments.
   * This allows the user to simply type the method name instead of
   * constructing a valid Javascript blob.
   * @example executeMethod("add", 3, 4) will call the method add(3, 4);
   */
  executeMethod(name: string, ...args: any[]) {
    const js = `${name}(${stringifyArgs(...args)})`;
    return this.executeJavascript(js);
  }

  undo(): any {
    const latest = this.history.pop();
    if (!latest) {
      console.log("no command to undo");
      return;
    }
    const { command, result } = latest;
    this.redoStack.push(latest);
    if (command) {
      return command.undo();
    } else {
      console.log("No commands to undo.");
    }
    // should we return anything?
  }

  redo(): any {
    const latest = this.redoStack.pop();
    if (!latest) {
      console.log("no command to redo");
      return;
    }
    const { command, result } = latest;
    if (command) {
      // we need an entire copy of the "execute" call but without the
      // clearing of the redoStack at the end.
      // the rest of this block is copied code. refactor at some point
      const res = command.execute();
      const result = new CommandResult(res);
      // an alternative to this system of checking might be to always print out the
      // javascript command, perhaps give it a class="metadata" third type of class,
      // always print the javascript command and possibly? print out the other
      // commands...? maybe. not sure how undo would work though.
      if (
        command instanceof JavascriptCommand &&
        matchFromArray(command.asString, Object.keys(scope)).length
      ) {
        // console.log(`! 3b invoker: skipping javascript command ${command.asString}`);
      } else {
        this.history.push({ command, result });
      }
    }
    // should we return anything?
  }
}

export const invoker = new Invoker();
