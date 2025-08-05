import { LocalStorageRegistry } from "./LocalStorageRegistry.svelte.ts";

export class LocalStorageItem<T> {
  key: string;
  value: T = $state<T>() as T;

  constructor(namespace: string, key: string, value: T) {
    this.key = `${namespace}/${key}`;
    this.value = value;

    LocalStorageRegistry.register(this);

    const current = localStorage.getItem(this.key);
    if (current != null) { this.value = this.deserialize(current); }

    $effect.root(() => {
      $effect(() => localStorage.setItem(this.key, String(this.value)));
      return () => { };
    });

    // todo: test that this works before enabling it
    // Cross-tab sync
    window.addEventListener("storage", (e) => {
      console.log("LocalStorageItem, window.addEventListener", e);
      // if (e.key === this.key && e.newValue !== null) {
      //   this.value = this.deserialize(e.newValue);
      // }
    });
  }

  deserialize(input: string): T {
    try {
      return JSON.parse(input) as T;
    } catch {
      return (input as unknown) as T;
    }
  }
}
