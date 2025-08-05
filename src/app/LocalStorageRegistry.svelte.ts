import { LocalStorageItem } from "./LocalStorageItem.svelte";

export class LocalStorageRegistry {
  private static registry = new Map<string, LocalStorageItem<any>>();

  static register(item: LocalStorageItem<any>) {
    if (this.registry.has(item.key)) {
      console.warn(`Duplicate LocalStorage key detected: ${item.key}`);
    }
    this.registry.set(item.key, item);
  }

  static get<T>(key: string): LocalStorageItem<T> | undefined {
    return this.registry.get(key) as LocalStorageItem<T>;
  }

  static listKeys() {
    return [...this.registry.keys()];
  }
}
