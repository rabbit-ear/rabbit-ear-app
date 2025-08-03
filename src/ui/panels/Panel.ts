import type { Component } from "svelte";

export abstract class Panel {
  abstract name: string;

  abstract component: Component;

  abstract props?: any;
}
