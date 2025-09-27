export type GraphUpdateEvent = {
  // nothing changes, only the set of components currently selected
  selection: number;

  // an isomorphic change can modify the vertex coordinates
  // or change any of the attributes associated with the edges
  isomorphic: {
    coords: number;
    assignments: number;
    foldAngles: number;
    faceOrders: number;
  };

  // a structural change modifies the connectivity of the graph
  structural: number;

  // a reset is when an entirely new graph has been loaded
  reset: number;
};

export type GraphUpdateModifier = {
  selection?: boolean;
  isomorphic?: {
    coords?: boolean;
    assignments?: boolean;
    foldAngles?: boolean;
    faceOrders?: boolean;
  };
  structural?: boolean;
  reset?: boolean;
};

export const makeGraphUpdateEvent = (): GraphUpdateEvent => ({
  selection: 0,
  isomorphic: {
    coords: 0,
    assignments: 0,
    foldAngles: 0,
    faceOrders: 0,
  },
  structural: 0,
  reset: 0,
});

export const modifyGraphUpdate = (update: GraphUpdateEvent, modifier: GraphUpdateModifier): void => {
  if (modifier.selection) { update.selection++; }
  if (modifier.isomorphic) {
    if (modifier.isomorphic.coords) { update.isomorphic.coords++; }
    if (modifier.isomorphic.assignments) { update.isomorphic.assignments++; }
    if (modifier.isomorphic.foldAngles) { update.isomorphic.foldAngles++; }
    if (modifier.isomorphic.faceOrders) { update.isomorphic.faceOrders++; }
  }
  if (modifier.structural) { update.structural++; }
  if (modifier.reset) { update.reset++; }
};

// // writes the changes into a new graph update object. does not modify input objects
// export const joinGraphUpdates = (a: GraphUpdateEvent, b: GraphUpdateEvent): GraphUpdateEvent => ({
//   selection: a.selection + b.selection,
//   isomorphic: {
//     coords: a.isomorphic.coords + b.isomorphic.coords,
//     assignments: a.isomorphic.assignments + b.isomorphic.assignments,
//     foldAngles: a.isomorphic.foldAngles + b.isomorphic.foldAngles,
//     faceOrders: a.isomorphic.faceOrders + b.isomorphic.faceOrders,
//   },
//   structural: a.structural + b.structural,
//   reset: a.reset + b.reset,
// });

// merges both graph update events into the first
export const assignGraphUpdates = (a: GraphUpdateEvent, b: GraphUpdateEvent): GraphUpdateEvent => {
  a.selection += b.selection;
  a.isomorphic.coords += b.isomorphic.coords;
  a.isomorphic.assignments += b.isomorphic.assignments;
  a.isomorphic.foldAngles += b.isomorphic.foldAngles;
  a.isomorphic.faceOrders += b.isomorphic.faceOrders;
  a.structural += b.structural;
  a.reset += b.reset;
  return a;
};

