import app from "../../../app/App.svelte";

/**
 * @description This captures the behavior of being at a terminal input and
 * using the up/down arrow keys to scroll through the history.
 * The value of this writable store is an integer, the index of the currently
 * selected command in the history. Call "increment" or "decrement" and a side-
 * effect will fire, one which will get() the invoker.commandHistory and
 * return the string of the currently selected command in the history.
 */
export class TerminalReprint {
  index = $state(0);

  increment(): string {
    this.index += 1;
    return this.#getCommandFromHistory();
  }

  decrement(): string {
    this.index -= 1;
    return this.#getCommandFromHistory();
  }

  // call this when a new command has been added. this will reset the
  // current index to be once again the most recent entry.
  reset(): void {
    this.index = 0;
  }

  // a subroutine of the TerminalReprint store. get the
  // commandHistory and return the item at the index parameter,
  // or an empty string if length of 0.
  #getCommandFromHistory(): string {
    if (!app.invoker.commandHistory.length) {
      return "";
    }
    let arrayIndex = this.index % app.invoker.commandHistory.length;
    arrayIndex += arrayIndex < 0 ? app.invoker.commandHistory.length : 0;
    return app.invoker.commandHistory[arrayIndex];
  }
}
