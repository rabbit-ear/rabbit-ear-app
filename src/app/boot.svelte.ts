import context from "./context.svelte.ts";
import { buildMenu } from "../system/menu.ts";
import { resourceDir, join } from "@tauri-apps/api/path";
import { UIMode } from "../ui/Settings.svelte.ts";

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
  await context.fileController.openFilesWithPaths(files);
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
  keyboard.createKeymap("meshMode");
  keyboard.createKeymap("rulerMode");
  // same key bindings in different keymaps
  keyboard.bind("meshMode", "swapMode", ["Tab"]);
  keyboard.bind("meshMode", "grabObject", ["G"]);
  keyboard.bind("meshMode", "rotateObject", ["R"]);
  keyboard.bind("rulerMode", "swapMode", ["Tab"]);
  keyboard.bind("rulerMode", "grabVertex", ["G"]);
  keyboard.bind("rulerMode", "extrudeVertex", ["E"]);
  // define the handlers
  keyboard.on("meshMode", "grabObject", () => console.log("Grab object:"));
  keyboard.on("meshMode", "rotateObject", () => console.log("Rotate object:"));
  keyboard.on("rulerMode", "grabVertex", () => console.log("Grab vertex:"));
  keyboard.on("rulerMode", "extrudeVertex", () => console.log("Extrude vertex:"));
  keyboard.on("meshMode", "swapMode", (event: KeyboardEvent) => {
    event.preventDefault();
    context.ui.settings.mode = UIMode.ruler;
  });
  keyboard.on("rulerMode", "swapMode", (event: KeyboardEvent) => {
    event.preventDefault();
    context.ui.settings.mode = UIMode.mesh;
  });
  keyboard.setActiveKeymap("meshMode");
  // keyboard.setActiveKeymap("rulerMode");

  loadExampleFile();
};

