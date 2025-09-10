export type GraphUpdateEvent = {
  // nothing changes, only the set of components currently selected
  selection: number;

  // an isomorphic change can modify the vertex coordinates
  // or change any of the attributes associated with the edges
  isomorphic: {
    coords: number;
    assignments: number;
    foldAngles: number;
  };

  // a structural change modifies the connectivity of the graph
  structural: number;

  // a reset is when an entirely new graph has been loaded
  reset: number;
};

export type GraphUpdateModifier = {
  selection: boolean;
  isomorphic?: {
    coords?: boolean;
    assignments?: boolean;
    foldAngles?: boolean;
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
  }
  if (modifier.structural) { update.structural++; }
  if (modifier.reset) { update.reset++; }
};

