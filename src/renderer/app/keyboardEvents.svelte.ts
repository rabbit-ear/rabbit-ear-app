import { isFormElementActive } from "../general/dom.ts";
import keyboard from "./keyboard.svelte.ts";

// this is not a part of this app
const TerminalTextarea = document.getElementById("element-does-not-yet-exist");

/**
 *
 */
const encodeModifier = (event: KeyboardEvent): number =>
  (Number(event.shiftKey) << 0) |
  ((Number(event.ctrlKey) || Number(event.metaKey)) << 1) |
  (Number(event.altKey) << 2);

/**
 *
 */
const Keybindings: {
  [key: string]: { [key: string]: { [key: number]: (event: KeyboardEvent) => void } };
} = {
  down: {
    Enter: {
      0: () => console.log("keybindings enter down"),
    },
    KeyC: {
      2: () => console.log("copied to clipboard"),
    },
    KeyV: {
      2: () => console.log("paste from clipboard"),
    },
  },
  up: {
    Enter: {
      0: () => console.log("keybindings enter up"),
    },
  },
};

/**
 *
 */
const onkeydownApp = $state((event: KeyboardEvent) => {
  const modifier = encodeModifier(event);
  const boundFunction = Keybindings.down[event.code]?.[modifier];
  if (!boundFunction) {
    return false;
  }
  event.preventDefault();
  boundFunction(event);
  return true;
});

/**
 *
 */
const onkeyupApp = $state((event: KeyboardEvent) => {
  const modifier = encodeModifier(event);
  const boundFunction = Keybindings.up[event.code]?.[modifier];
  if (!boundFunction) {
    return false;
  }
  event.preventDefault();
  boundFunction(event);
  return true;
});

/**
 *
 */
const onkeydownTerminal = $state((event: KeyboardEvent): void => {
  switch (event.code) {
    case "Enter":
      if (!event.shiftKey) {
        // event.preventDefault();
        // execute($TerminalValue);
        // TerminalValue.set("");
      }
      break;
    case "ArrowUp":
      // ReplayCommandIndex.decrement();
      // TerminalValue.set(get(ReplayCommand).text);
      break;
    case "ArrowDown":
      // ReplayCommandIndex.increment();
      // TerminalValue.set(get(ReplayCommand).text);
      break;
    default:
      break;
  }
});

/**
 * todo: i think this needs to be refactored. writable(). not a derived.
 * it's probably reloading a new function every single state update.
 */
const onkeydownForm = $state((event: KeyboardEvent): void => {
  if (document.activeElement === TerminalTextarea) {
    return onkeydownTerminal(event);
  }
  switch (event.code) {
    case "KeyC":
      if (event.metaKey || event.ctrlKey) {
        console.log("onkeydownForm CMD + C");
      }
      break;
    case "KeyV":
      if (event.metaKey || event.ctrlKey) {
        console.log("onkeydownForm CMD + V");
      }
      break;
  }
  //return false;
});

/**
 *
 */
//const onkeyupForm = $state((event: KeyboardEvent) => {});
const onkeyupForm = $state((event: KeyboardEvent) => {
  if (!event) {
    console.log("to be filled in later");
  }
});

/**
 *
 */
const onkeydownWindow = $derived((event: KeyboardEvent): void => {
  //if (tool.value?.onkeydown?.(event)) { return; }
  if (onkeydownApp(event)) {
    return;
  }
});

/**
 *
 */
const onkeyupWindow = $derived((event: KeyboardEvent): void => {
  //if (tool.value?.onkeyup?.(event)) { return; }
  if (onkeyupApp(event)) {
    return;
  }
});

/**
 *
 */
export const onkeydown = (event: KeyboardEvent): void => {
  console.log(event.code);
  keyboard.keys[event.code] = true;
  return isFormElementActive() ? onkeydownForm(event) : onkeydownWindow(event);
};

/**
 *
 */
export const onkeyup = (event: KeyboardEvent): void => {
  delete keyboard.keys[event.code];
  return isFormElementActive() ? onkeyupForm(event) : onkeyupWindow(event);
};
