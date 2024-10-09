import { invoker } from "../../../kernel/invoker.svelte.ts";
import { isFormElementActive } from "../../../general/dom.ts";
import { TerminalTextarea } from "./dom.svelte.ts";
import { TerminalReprint } from "./terminal.svelte.ts";

/**
 * @description If a keyboard up event occured on a form element this method
 * will be called. Behavior can be tied to particular DOM form elements.
 */
const FormKeyboardUp = $derived<Function>((event: KeyboardEvent) => {});

/**
 * @description If a keyboard down event occured on a form element this method
 * will be called. Behavior can be tied to particular DOM form elements,
 * for example, the textarea that functions as the terminal input, to watch
 * for an ENTER key press to execute the command and clear the input.
 */
const FormKeyboardDown = $derived((event: KeyboardEvent) => {
  const { altKey, ctrlKey, metaKey, shiftKey } = event;
  // console.log("FormKeyboardEvent Down");
  if (document.activeElement === TerminalTextarea.element) {
    // console.log(event.key);
    switch (event.key) {
      case "Enter":
      case "NumpadEnter":
        if (!event.shiftKey) {
          event.preventDefault();
          invoker.executeJavascript(TerminalTextarea.value || "");
          TerminalTextarea.value = "";
          TerminalReprint.value = 0;
        }
        break;
      case "z":
      case "Z":
        if (metaKey || ctrlKey) {
          if (shiftKey) {
            invoker.redo();
          } else {
            invoker.undo();
          }
        }
        break;
      case "b":
      case "B":
        if (metaKey || ctrlKey) {
          invoker.executeMethod("background", `hsl(${Math.random() * 360}, 50%, 50%)`);
        }
        break;
      case "ArrowUp":
        TerminalTextarea.value = TerminalReprint.decrement();
        break;
      case "ArrowDown":
        TerminalTextarea.value = TerminalReprint.increment();
        break;
      default:
        break;
    }
  }
});

/**
 * @description If a keyboard down event occured NOT on a form element,
 * it's considered an on-window event and this method will be called.
 */
const WindowKeyboardDown = $state((event: KeyboardEvent) => {});

/**
 * @description If a keyboard up event occured NOT on a form element,
 * it's considered an on-window event and this method will be called.
 */
const WindowKeyboardUp = $state((event: KeyboardEvent) => {});

/**
 * @description Main entry point for keyboard events, this will be bound to
 * the window.onkeydown event. This method will call one of two subroutines,
 * depending on if a form element is selected or not.
 */
export const KeyboardDown = (() => {
  const value = $derived((event: KeyboardEvent) =>
    isFormElementActive() ? FormKeyboardDown(event) : WindowKeyboardDown(event),
  );
  return {
    get value() {
      return value;
    },
  };
})();

/**
 * @description Main entry point for keyboard events, this will be bound to
 * the window.onkeyup event. This method will call one of two subroutines,
 * depending on if a form element is selected or not.
 */
export const KeyboardUp = (() => {
  const value = $derived((event: KeyboardEvent) =>
    isFormElementActive() ? FormKeyboardUp(event) : WindowKeyboardUp(event),
  );
  return {
    get value() {
      return value;
    },
  };
})();
