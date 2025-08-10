import context from "./context.svelte.ts";
import { buildMenu } from "../system/menu.ts";

$effect.root(() => {
  $effect(async () => {
    const _ = context.localization.language;
    console.log("rebuilding app menu");
    (await buildMenu()).setAsAppMenu();
  });
});

export const defaultAppSetup = () => {
  // setup
  if (context.ui) {
    context.ui.toolManager.setToolWithName("ui.tools.select");
    context.ui.viewportManager.addViewportWithName("SVGViewport");
    context.ui.viewportManager.addViewportWithName("SVGViewport");
    context.ui.viewportManager.viewports[1].modelName = "folded";
  }

  // setup keyboard event mapping
  const keyboard = context.keyboardManager;
  keyboard.createKeymap("objectMode");
  keyboard.createKeymap("editMode");
  // same key bindings in different keymaps
  keyboard.bind("objectMode", "grabObject", ["G"]);
  keyboard.bind("objectMode", "rotateObject", ["R"]);
  keyboard.bind("editMode", "grabVertex", ["G"]);
  keyboard.bind("editMode", "extrudeVertex", ["E"]);
  // define the handlers
  keyboard.on("objectMode", "grabObject", () => console.log("Grab object:"));
  keyboard.on("objectMode", "rotateObject", () => console.log("Rotate object:"));
  keyboard.on("editMode", "grabVertex", () => console.log("Grab vertex:"));
  keyboard.on("editMode", "extrudeVertex", () => console.log("Extrude vertex:"));
  keyboard.setActiveKeymap("objectMode");
  // keyboard.setActiveKeymap("editMode");
};

