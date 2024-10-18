import { isFormElementActive } from "../general/dom.ts";
import keyboard from "./Keyboard.svelte.ts";

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
const onkeydownWindow = $state((event: KeyboardEvent) => {
  const modifier = encodeModifier(event);
  const boundFunction = Keybindings.down[event.code]?.[modifier];
  if (boundFunction) {
    event.preventDefault();
    boundFunction(event);
  }
});

/**
 *
 */
const onkeyupWindow = $state((event: KeyboardEvent) => {
  const modifier = encodeModifier(event);
  const boundFunction = Keybindings.up[event.code]?.[modifier];
  if (boundFunction) {
    event.preventDefault();
    boundFunction(event);
  }
});

/**
 * todo: i think this needs to be refactored. writable(). not a derived.
 * it's probably reloading a new function every single state update.
 */
const onkeydownForm = $state((event: KeyboardEvent): void => {
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
});

/**
 *
 */
//const onkeyupForm = $state((event: KeyboardEvent) => {});
const onkeyupForm = $state((event: KeyboardEvent) => {
  if (!event) {
    console.log("form element key up");
  }
});

/**
 *
 */
export const onkeydown = (event: KeyboardEvent): void => {
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
