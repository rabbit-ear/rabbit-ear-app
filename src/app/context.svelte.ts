import { EditorContext } from "./EditorContext.svelte";

// export default new EditorContext();

const context = new EditorContext();
// @ts-expect-error requires re-typing window object
window.context = context;
export default context;

