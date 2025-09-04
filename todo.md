# Rabbit Ear app todo

an svg tool layer will remain even when switching to another tool if that tool doesn't have a tool layer

### selection

Viewport layout: WebGL CP, WebGL Folded. show a CP frame, switch to a folded frame, the CP still remains because the GLModel was not rebuilt, it still has the arrays/buffers from the previous frame rendering.

Needs rework for the flow of data. #source to frame via frameIndex. I think we need to build all frames on load, this way each Frame can cache its own selection and various metadata.

selection command must be able to join to other selection commands. perhaps selection command stores a list of boxes, each marked "union" "subtract" etc, so that commands can be joined simply by concat-ing lists. the selection region becomes a set of potentially non-convex polygons which then gets compared against the graph. alternatively, since bounding box comparison is fast each bounding box is compared (union/subtract) in series on the graph or the subgraph from the previous comparison, but that sounds slower.

getDimensionsQuick: possible that we can replace the final test with a Array.find() call, where we use a != null to grab the first item, it might be faster than the .filter() we currently have.

drag drop a file that is already open does not swap to its tab

on the viewport, a map that relates a model to a View (view matrix). for every viewport. this way if you swap between open files, you return back to your view.

# design patterns

- events only fire if they need to (are requested to fire). this includes UI events, WebGL draw, ..
