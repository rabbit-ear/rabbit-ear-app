type Action = string;
type KeyCombination = string[];
type KeyHandler = () => void;

interface Keymap {
  name: string;
  bindings: Map<Action, KeyCombination>;
  listeners: Map<Action, KeyHandler[]>;
}

export class KeyboardManager {
  #keys = new Set<string>();
  #keymaps = new Map<string, Keymap>();
  #activeKeymap: Keymap | undefined;

  // not currently used but possible to setup a system
  // that runs O(1), but idk let's see. This system has
  // its benefits too.
  #keyCombination: string = "";

  constructor() {
    window.addEventListener("keydown", this.#onkeydown.bind(this));
    window.addEventListener("keyup", this.#onkeyup.bind(this));
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

  bind(keymapName: string, action: Action, keyCombination: KeyCombination) {
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

  #onkeydown(event: KeyboardEvent) {
    this.#keys.add(this.#normalize(event.key));
    this.#keyCombination = this.#stringifyKeys();
    this.#checkActions();
  }

  #onkeyup(event: KeyboardEvent) {
    this.#keys.delete(this.#normalize(event.key));
    this.#keyCombination = this.#stringifyKeys();
    this.#checkActions();
  }

  #stringifyKeys(): string {
    return Array.from(this.#keys).sort().join("+");
  }

  #checkActions() {
    // if (!this.activeKeymap) return;
    // const combo = Array.from(this.#keys).sort().join("+");
    // const actions = this.activeKeymap.comboMap.get(combo);
    // if (actions) actions.forEach((a) => this.trigger(a, true));
    if (!this.#activeKeymap) return;
    console.log(this.#keyCombination);
    for (const [action, combo] of this.#activeKeymap.bindings.entries()) {
      const active = combo.every((k) => this.#keys.has(k));
      if (!active) { continue; }
      // this.#activeKeymap.listeners.get(action)
      //   ?.forEach((fn) => fn(active));
      this.#activeKeymap.listeners.get(action)
        ?.forEach(handler => handler());
    }
  }

  #normalize(key: string): string {
    if (key === " ") return "Space";
    if (key.length === 1) return key.toUpperCase();
    return key;
  }

  dealloc(): void {
    window.removeEventListener("keydown", this.#onkeydown);
    window.removeEventListener("keyup", this.#onkeyup);
  }
}
