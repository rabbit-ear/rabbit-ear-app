import type { Tool } from "../tools/Tool.ts";
// import circle from "./circle/index.ts";
// import line from "./line/index.ts";
// import rect from "./rect/index.ts";
// import rotate from "./rotate/index.ts";
// import scale from "./scale/index.ts";
// import scribble from "./scribble/index.ts";
// import segment from "./segment/index.ts";
import select from "./select/index.ts";
// import translate from "./translate/index.ts";
// import zoom from "./zoom/index.ts";

const Tools: { [key: string]: typeof Tool } = {
  // circle,
  // line,
  // rect,
  // rotate,
  // scale,
  // scribble,
  // segment,
  select,
  // translate,
  // zoom,
};

export default Tools;
