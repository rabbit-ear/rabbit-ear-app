import { writable } from "svelte/store";

//
// show/hide things
//

// highlight vertices/faces under the cursor
export const showTouches = writable(false);

// turn on three.js shadows
export const showShadows = writable(false);

// show model faces
export const showFront = writable(true);
export const showBack = writable(true);

// show/hide lines by assignment
export const showBoundary = writable(true);
export const showMountain = writable(true);
export const showValley = writable(true);
export const showFlat = writable(true);
export const showJoin = writable(false);
export const showUnassigned = writable(true);

//
// colors
//

// the background of the WebGL canvas
export const backgroundColor = writable("#2a2a2a");

// front and back are the mesh faces
export const frontColor = writable("#333");
export const backColor = writable("#414ff1");

// line color by assignment
export const lineOpacity = writable(1);
export const boundaryColor = writable("#888");
export const mountainColor = writable("#e53");
export const valleyColor = writable("#08f");
export const flatColor = writable("#888");
export const joinColor = writable("#f80");
export const unassignedColor = writable("#80f");
