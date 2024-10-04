/**
 * @description create and return a writable Svelte rune
 */
export const createSignal = <T>(val?: T) => {
  let value = $state(val);
  return {
    get value(): T {
      return value;
    },
    set value(v: T) {
      value = v;
    },
  };
};

/**
 * @description Literally, just the contents of the file as a text string,
 * this is one level of abstraction away from the raw byte contents of a file,
 * because this app only ever uses files which are text files.
 */
export const model = createSignal<string>();

