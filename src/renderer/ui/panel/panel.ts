import type { Component } from "svelte";

// an abstract class would allow us to describe the "settings" static property.
//export abstract class Viewport implements ViewportEvents, Deallocable {
export interface Panel {
  // to be implemented by each component:
  // static settings: any;
  title: string;

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component;

  // this method will unbind anything needed (likely rarely ever used)
  dealloc?: () => void;
}