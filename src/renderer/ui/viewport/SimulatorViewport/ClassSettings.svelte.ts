class Settings {
  // turn on/off Origami Simulator's folding engine
  active = $state(false);

  // fold the origami model, float (0.0-1.0)
  foldAmount = $state(0.15);

  // tool is either ["trackball", "pull"], this determines how
  // to respond to a user interface: rotate model or pull a vertex
  tool = $state("trackball");

  // settings for the solver
  integration = $state("euler");
  axialStiffness = $state(20);
  faceStiffness = $state(0.2);
  joinStiffness = $state(0.7);
  creaseStiffness = $state(0.7);
  dampingRatio = $state(0.45);

  // vertex displacement error relayed back from the simulator
  error = $state(0);

  // reset the vertices back to their starting location
  reset = $state(() => { });
}

export default new Settings();
