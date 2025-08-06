import context from "./context.svelte.ts";
import { SVGViewport } from "../ui/viewports/SVGViewport/SVGViewport.svelte.ts";

export const defaultAppSetup = () => {
  // setup
  context.ui?.viewportManager.addViewport(new SVGViewport());
  context.ui?.toolManager.setToolWithName("select");

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

