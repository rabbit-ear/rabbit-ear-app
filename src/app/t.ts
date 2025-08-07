import context from "./context.svelte.ts";

// export default (key: string) => context?.localization?.localize(key) ?? key;
export default (key: string) => context.localization.localize(key);

