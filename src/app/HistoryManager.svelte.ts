import type { Command } from "../commands/Command.ts";

export class HistoryManager {
  #undoStack: Command[] = $state([]);
  #redoStack: Command[] = $state([]);

  get undoStack(): Readonly<Command[]> { return this.#undoStack; }
  get redoStack(): Readonly<Command[]> { return this.#redoStack; }

  executeCommand(command: Command): boolean {
    try {
      command.execute();
    } catch (error) {
      console.log(error);
    }
    this.#undoStack.push(command);
    this.#redoStack = [];
    return true;
  }

  undo(): boolean {
    const command = this.#undoStack.pop();
    if (!command) { return false; }
    try {
      command.undo();
    } catch (error) {
      console.log(error);
    }
    this.#redoStack.push(command);
    return true;
  }

  redo(): boolean {
    const command = this.#redoStack.pop();
    if (!command) { return false; }
    try {
      command.execute();
    } catch (error) {
      console.log(error);
    }
    this.#undoStack.push(command);
    return true;
  }

  undoUntilIndex(index: number): boolean {
    let modified = false;
    const count = this.#undoStack.length - 1 - index;
    for (let i = 0; i < count; i++) {
      const result = this.undo();
      modified ||= result;
    }
    return modified;
  }

  redoUntilIndex(index: number): boolean {
    let modified = false;
    for (let i = 0; i <= index; i++) {
      const result = this.redo();
      modified ||= result;
    }
    return modified;
  }

  clear(): void {
    this.#undoStack = [];
    this.#redoStack = [];
  }
}

