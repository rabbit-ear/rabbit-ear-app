// an isomorphic change can modify the vertex coordinates
// or change any of the attributes associated with the edges
type Isomorphic = {
  isomorphic: { coords: boolean; } |
  { assignments: boolean; } |
  { foldAngles: boolean; };
};

// a structural change modifies the connectivity of the graph
type Structural = {
  structural: boolean;
}

// a reset is when an entirely new graph has been loaded
type Reset = {
  reset: boolean;
}

// export type GraphUpdateEvent = Isomorphic | Structural | Reset;

export type GraphUpdateEvent = {
  isomorphic?: {
    coords?: boolean;
    assignments?: boolean;
    foldAngles?: boolean;
  };
  structural?: boolean;
  reset?: boolean;
};

