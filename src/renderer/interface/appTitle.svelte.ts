import { APP_NAME, UNTITLED_FILENAME } from "../app/constants.svelte.ts";
import file from "../model/file.svelte.ts";

class AppTitle {
  filename: string = $state(file.info === undefined ? UNTITLED_FILENAME : file.info.file);
  modifiedMark: string = $state(file.modified ? " *" : "");

  // description Watch "FilePath" for any changes, update the window title
  // to include the currently opened filename.
  appTitle: string = $derived(`${APP_NAME} - ${this.filename}${this.modifiedMark}`);

  unbind: (() => void)[] = [];

  previousAppTitle = "";

  // description update the system app title name to include the file name
  // and the asterisk indicator if the file has unsaved changes; but only
  // send an update if the desired and the current titles differ.
  #makeEffect(): () => void {
    return $effect.root(() => {
      $effect(() => {
        if (this.appTitle === this.previousAppTitle) {
          return;
        }
        this.previousAppTitle = this.appTitle;
        window.api?.setAppTitle(this.appTitle);
      });
      return () => {};
    });
  }

  constructor() {
    this.unbind.push(this.#makeEffect());
  }

  dealloc(): void {
    this.unbind.forEach((fn) => fn());
  }
}

export default new AppTitle();
