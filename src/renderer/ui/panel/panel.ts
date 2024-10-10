import type { Component } from "svelte";

export interface Deallocable {
  dealloc(): void;
}

// an abstract class would allow us to describe the "settings" static property.
//export abstract class Viewport implements ViewportEvents, Deallocable {
export interface Panel extends Deallocable {
  // to be implemented by each component:
  // static settings: any;
  title: string;

  // the Svelte component to be instanced as one of the App's display canvases
  component: Component;

  // this method will unbind all of the above events (set them to undefined)
  dealloc: () => void;
}
