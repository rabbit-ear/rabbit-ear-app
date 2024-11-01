//
// show/hide things
//
class Style {
  // highlight vertices/faces under the cursor
  showTouches = $state(true);

  // turn on three.js shadows
  showShadows = $state(false);

  // show model faces
  showFront = $state(true);
  showBack = $state(true);

  // show/hide lines by assignment
  showBoundary = $state(false);
  showMountain = $state(true);
  showValley = $state(true);
  showFlat = $state(true);
  showJoin = $state(false);
  showUnassigned = $state(true);

  //
  // colors
  //

  // the background of the WebGL canvas
  backgroundColor = $state("gray");
  // export const backgroundColor = writable("#111");

  // front and back are the mesh faces
  // export const frontColor = writable("#e08");
  backColor = $state("white");
  frontColor = $state("#222");

  // line color by assignment
  lineOpacity = $state(1);
  boundaryColor = $state("#000");
  mountainColor = $state("red");
  valleyColor = $state("#08f");
  flatColor = $state("#888");
  joinColor = $state("#f80");
  unassignedColor = $state("#80f");
}

export default new Style();

