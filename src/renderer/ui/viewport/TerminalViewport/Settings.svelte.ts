//import {
//  storageKeys,
//  getStorageBoolean,
//  getStorageNumber,
//  getStorageString,
//} from "../../../app/localStorage.svelte.ts";

class Settings {
  //example: string = $state(getStorageString(storageKeys.terminalExampleKey, "default"));
  minLineCount = 8;
  maxLineCount = 300;
  //commands: string[] = ["first", "second", "third"];
  //commandHistory: string[] = $derived(this.commands.map((el) => `<span>${el}</span>`));
  //commandHistoryHTMLString: string = $derived(this.commandHistory.join("\n"));
  //terminalHistoryHTMLString = $derived(invoker.historyAsHTML.join("\n"));

  //history: string[] = $derived(
  //  this.commandHistory.length >= this.minLineCount
  //    ? this.commandHistory
  //    : Array(this.minLineCount - this.commandHistory.length)
  //        .fill("<span></span>")
  //        .concat(this.commandHistory),
  //);

  unbind: (() => void)[] = [];

  constructor() {
    this.unbind = [];
  }

  dealloc(): void {
    this.unbind.forEach((fn) => fn());
  }
}

export default new Settings();
