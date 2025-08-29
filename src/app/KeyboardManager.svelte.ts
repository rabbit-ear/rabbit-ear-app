type Action = string;
type KeyCombination = string[];
type KeyHandler = (event: KeyboardEvent) => void;

interface Keymap {
  name: string;
  bindings: Map<Action, KeyCombination>;
  listeners: Map<Action, KeyHandler[]>;
}

export class KeyboardManager {
  // #keys: Set<string> = $state(new Set<string>());
  #keys: { [key: string]: boolean } = $state({});
  #keymaps = new Map<string, Keymap>();
  #activeKeymap: Keymap | undefined;

  // shift: boolean = $derived(this.#keys.has("Shift"));
  // alt: boolean = $derived(this.#keys.has("Alt"));
  // control: boolean = $derived(this.#keys.has("Control"));
  // command: boolean = $derived(this.#keys.has("Meta"));
  shift: boolean = $derived(this.#keys["Shift"]);
  alt: boolean = $derived(this.#keys["Alt"]);
  control: boolean = $derived(this.#keys["Control"]);
  command: boolean = $derived(this.#keys["Meta"]);

  // not currently used but possible to setup a system
  // that runs O(1), but idk let's see. This system has
  // its benefits too.
  // #keyCombination: string = "";

  constructor() {
    window.addEventListener("keydown", this.#onkeydown.bind(this));
    window.addEventListener("keyup", this.#onkeyup.bind(this));
  }

  dealloc(): void {
    window.removeEventListener("keydown", this.#onkeydown);
    window.removeEventListener("keyup", this.#onkeyup);
  }

  createKeymap(name: string): Keymap {
    const keymap = { name, bindings: new Map(), listeners: new Map() };
    this.#keymaps.set(name, keymap);
    if (!this.#activeKeymap) { this.#activeKeymap = keymap; }
    return keymap;
  }

  setActiveKeymap(name: string): void {
    const keymap = this.#keymaps.get(name);
    if (!keymap) { return; }
    this.#activeKeymap = keymap;
  }

  bind(keymapName: string, action: Action, keyCombination: KeyCombination): void {
    const keymap = this.#keymaps.get(keymapName);
    if (!keymap) { return; }
    keymap.bindings.set(action, keyCombination);
  }

  on(keymapName: string, action: Action, handler: () => void): void {
    const keymap = this.#keymaps.get(keymapName);
    if (!keymap) { return; }
    if (!keymap.listeners.has(action)) { keymap.listeners.set(action, []); }
    keymap.listeners.get(action)?.push(handler);
  }

  #onkeydown(event: KeyboardEvent): void {
    // this.#keys.add(this.#normalize(event.key));
    this.#keys[this.#normalize(event.key)] = true;
    // this.#keyCombination = this.#stringifyKeys();
    this.#checkActions(event);
  }

  #onkeyup(event: KeyboardEvent): void {
    // this.#keys.delete(this.#normalize(event.key));
    delete this.#keys[this.#normalize(event.key)];
  }

  // #stringifyKeys(): string {
  //   return Array.from(this.#keys).sort().join("+");
  // }

  #checkActions(event: KeyboardEvent): void {
    if (!this.#activeKeymap) return;
    // this will potentially match with multiple definitions.
    // pressing CMD+SHIFT+Z (redo) will still also match with CMD+Z (undo)
    // we want the one with the longest sequence of keys.
    const match = Array.from(this.#activeKeymap.bindings.entries())
      .map(([action, combo]) => ({ action, combo }))
      .filter(({ combo }) => combo.every(k => this.#keys[k]))
      .sort((a, b) => a.combo.length - b.combo.length)
      .pop();

    if (match) {
      this.#activeKeymap.listeners.get(match.action)?.forEach(handler => handler(event));
    }
  }

  #normalize(key: string): string {
    if (key === " ") return "Space";
    if (key.length === 1) return key.toUpperCase();
    return key;
  }
}
