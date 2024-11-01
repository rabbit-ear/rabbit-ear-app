<script lang="ts">
  import { basicSetup } from "codemirror";
  import { defaultKeymap, indentWithTab } from "@codemirror/commands";
  import { EditorState } from "@codemirror/state";
  import { EditorView, keymap, lineNumbers } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { foldGutter } from "@codemirror/language";
  import { closeSearchPanel, openSearchPanel, search } from "@codemirror/search";
  import { vim } from "@replit/codemirror-vim";

  let { ...rest } = $props();

  let parent: HTMLDivElement = $state();

  const doc = `const b = () => {
  let p = 4;
}
`;

  const extensions = [
    vim(),
    keymap.of(defaultKeymap),
    basicSetup,
    keymap.of([indentWithTab]),
    search(),
    lineNumbers(),
    foldGutter({ closedText: "▶", openText: "▼" }),
    javascript(),
    oneDark,
  ];

  let startState = EditorState.create({ extensions, doc });
  let view = $derived(new EditorView({ state: startState, parent }));
  $inspect(view);
</script>

<div class="script-container" bind:this={parent} {...rest}></div>

<style>
  :global(.cm-editor) {
    width: 100%;
    height: 100%;
  }

  :global(.cm-editor p, .cm-editor span) {
    font-size: 1rem;
  }

  .script-container {
    width: 100%;
    height: 100%;
  }
</style>
