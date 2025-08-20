import type { Command } from "../commands/Command.ts";

export class HistoryManager {
  #undoStack: Command[] = $state([]);
  #redoStack: Command[] = $state([]);

  get undoStack(): Readonly<Command[]> { return this.#undoStack; }
  get redoStack(): Readonly<Command[]> { return this.#redoStack; }

  executeCommand(command: Command): boolean {
    command.execute();
    this.#undoStack.push(command);
    this.#redoStack = [];
    return true;
  }

  undo(): boolean {
    const command = this.#undoStack.pop();
    if (!command) { return false; }
    command.undo();
    this.#redoStack.push(command);
    return true;
  }

  redo(): boolean {
    const command = this.#redoStack.pop();
    if (!command) { return false; }
    command.execute();
    this.#undoStack.push(command);
    return true;
  }

  clear(): void {
    this.#undoStack = [];
    this.#redoStack = [];
  }
}

