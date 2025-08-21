import context from "./context.svelte.ts";
import { buildMenu } from "../system/menu.ts";
import { resourceDir, join } from "@tauri-apps/api/path";

$effect.root(() => {
  $effect(async () => {
    const _ = context.localization.language;
    (await buildMenu()).setAsAppMenu();
  });
});

const loadExampleFile = async () => {
  const resourcesDir = await join(await resourceDir(), "_up_/resources/");
  const files = [
    await join(resourcesDir, "crane.fold"),
    await join(resourcesDir, "cube-octagon.fold"),
  ];
  await context.fileManager.openFiles(files);
}

export const defaultAppSetup = () => {
  // setup
  if (context.ui) {
    context.ui.toolManager.setToolWithName("ui.tools.select");
    context.ui.viewportManager.addViewportWithName("SVGViewport");
    context.ui.viewportManager.addViewportWithName("WebGLViewport");
    context.ui.viewportManager.viewports[1].embeddingName = "foldedForm";
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

  loadExampleFile();
};

