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

export default new Keyboard();

