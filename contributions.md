# How to Contribute _x_

## tool

UI Tools live on the left side bar and are meant for user-interface to modify the model. Tools inhabit their own directory and contain an index.js with required metadata including an icon. Cleanup all memory in an optional "unsubscribe" method. an optional "reset" method will be called when the UI needs to be visually cleared. If there is a "panel" svelte component (also optional), it will be added to the right panel when your tool is active. "pointerEvent" will be fired during. An optional "SVGCanvas" will be added to the crease pattern SVG view.

See the examples in the `src/tools` folder. 

## modifier

Modifiers sit inside the command system, between the call and the execute, and have the power to modify the commands before they get executed. You can use the parser to check for the presence of certain method calls, and build your logic based on the presence of these methods.

See the examples in the `src/modifiers` folder. 

# Coding Style Guide

When linking to the Rabbit Ear library, please link directly to the method in question, like this:

```js
import { subgraph } from "rabbit-ear/graph/subgraph.js";
subgraph();
```

As opposed to doing this,

```js
// do not do this:
import ear from "rabbit-ear";
ear.graph.subgraph();
```

# List of known issues / idiosyncrasies

Race conditions with multiple derived stores often causing redundant updates to fire. Not noticible, but it's happening. Perhaps we can do with a better store design, perhaps once Svelte 5 comes out, runes/effects can solve this.


# General Contribution Tips

### modularity

Keep your code modular. No other parts of the app should depend on your contribution (removing your contribution will not break the app). Notice how each tool is encapsulated in its own folder, tools can be easily included or removed by changing one line of code.

### communicate beforehand

Open an issue or a discussion in this repository before you spend a lot of time coding. It's possible that a contribution will be rejected due to no fault of your own, something which better communication could have prevented any wasted time.
