import type { Component } from "svelte";
import type { Viewport } from "./viewport/viewport.ts";
import type { Panel } from "./panel/panel.ts";

export interface Deallocable {
  dealloc(): void;
}

/**
 * @description This is the currently selected UI tool, as seen on the
 * toolbar (left side of screen). Tool definitions can be found inside
 * the tools/ folder.
 * @notes The tool setter will reset the UI between tools and
 * call any "subscribe" or "unsubscribe" methods, if they exist,
 * intended to cleanup or initialize Svelte stores which are specific
 * to each tool.
 */
export abstract class UITool implements Deallocable {
  // unique UUID for this tool
  static key: string;

  // human readable display name for this tool
  static name: string;

  // an SVG image. an XML formatted file with a single top level <svg> element,
  // but the file has a .svelte extension (no <script> or <style> sections)
  static icon: Component;

  // an optional .svelte component, intended to contain settings for the tool
  //panel?: Component;
  panel?: Panel;

  // A UI tool is intended for a Viewport, a tool will be instanced once per app,
  // but may need to subinstance internal state once per viewport (one app can
  // have many viewports). This is that internal "constructor" for each viewport.
  // The return function is the deallocr for everything made in the bindTo().
  abstract bindTo(viewport: Viewport): () => void;

  // This function should clean up anything that was created/bound in the constructor.
  // This will be called when this tool is removed (during a switching of tools).
  abstract dealloc(): void;
}

// panel can change a variable like, "snap rotation", this variable must not live inside
// of a tool's UI state because this would be instance once for each viewport and it wouldn't
// be ideal to have one "global" setting modify a bunch of instance's settings; so, a tool
// should have "global" settings and "viewport" settings.
// - viewport settings: one for each viewport
// - global settings: apply to all viewport instances.

// i didn't realize this was going to open a can of worms.
//
// creating a new tool should create one instance of the tool.
// (because there is at least an option for a global state with global settings)
// that one instance should allow you to create multiple viewport states
// where each viewport state can be created and destroyed, and has
// access to the global state object.
