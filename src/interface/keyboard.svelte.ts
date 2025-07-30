// import { isFormElementActive } from "../general/dom.ts";

const isFormElementActive = () => false;

/**
 * @description a hash lookup of every keyboard key currently being pressed
 * where the dictionary's keys are numbers, the numbers being event.code.
 * and the value will be "true" if the key is pressed. If the key is not
 * pressed, the key will not exist.
 */

//export const keyboard: { [key: string]: boolean } = $state({});
//export const space = $derived(keyboard.Space);

class Keyboard {
  keys: { [key: string]: boolean } = $state({});

  shift = $derived(this.keys.ShiftLeft || this.keys.ShiftRight);
  // command (Mac)
  command = $derived(this.keys.MetaLeft || this.keys.MetaRight);
  // control, ctrl
  control = $derived(this.keys.ControlLeft || this.keys.ControlRight);
  // alt, option
  alt = $derived(this.keys.AltLeft || this.keys.AltRight);

  //tab = $derived(this.keys.Tab);
  //space = $derived(this.keys.Space);
}

const keyboard = new Keyboard();

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
    KeyZ: {
      2: () => console.log("undo"),
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
  // console.log("onkeydown", isFormElementActive(), event);
  keyboard.keys[event.code] = true;
  return isFormElementActive() ? onkeydownForm(event) : onkeydownWindow(event);
};

/**
 *
 */
export const onkeyup = (event: KeyboardEvent): void => {
  // console.log("onkeyup", isFormElementActive(), event);
  delete keyboard.keys[event.code];
  return isFormElementActive() ? onkeyupForm(event) : onkeyupWindow(event);
};

window.onkeydown = onkeydown;
window.onkeyup = onkeyup;

