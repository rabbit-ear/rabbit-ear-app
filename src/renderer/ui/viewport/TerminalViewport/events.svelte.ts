import app from "../../../app/App.svelte.ts";
import type { TerminalReprint } from "./TerminalReprint.svelte.ts";

export class Events {
  reprint: TerminalReprint;

  constructor(reprint: TerminalReprint) {
    this.reprint = reprint;
  }

  /**
   * @description If a keyboard down event occured on a form element this method
   * will be called. Behavior can be tied to particular DOM form elements,
   * for example, the textarea that functions as the terminal input, to watch
   * for an ENTER key press to execute the command and clear the input.
   */
  onkeydown = (event: KeyboardEvent): void => {
    //const { altKey, ctrlKey, metaKey, shiftKey } = event;
    const { ctrlKey, metaKey, shiftKey } = event;
    const textarea = event.target as HTMLTextAreaElement;
    switch (event.key) {
      case "Enter":
      case "NumpadEnter":
        if (!event.shiftKey) {
          event.preventDefault();
          app.invoker.executeJavascript(textarea.value || "");
          textarea.value = "";
          this.reprint.reset();
        }
        break;

      case "z":
      case "Z":
        if (metaKey || ctrlKey) {
          if (shiftKey) {
            app.invoker.redo();
          } else {
            app.invoker.undo();
          }
        }
        break;

      case "b":
      case "B":
        if (metaKey || ctrlKey) {
          app.invoker.executeMethod(
            "background",
            `hsl(${Math.random() * 360}, 50%, 50%)`,
          );
        }
        break;

      case "ArrowUp":
        textarea.value = this.reprint.decrement();
        break;

      case "ArrowDown":
        textarea.value = this.reprint.increment();
        break;

      default:
        break;
    }
  };

  /**
   * @description If a keyboard up event occured on a form element this method
   * will be called. Behavior can be tied to particular DOM form elements.
   */
  //onkeyup = (event: KeyboardEvent): void => {};
  onkeyup = (_event: KeyboardEvent): void => {};
}
