import * as autoPlanarize from "./autoPlanarize/index.js";
import * as undoHistory from "./undoHistory/index.js";

export default {
	...autoPlanarize,
	...undoHistory,
};
