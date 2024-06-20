# Rabbit Ear, origami editor app

## plan for round 2:

- need to be able to select faces. see "square-with-hole.fold" in rabbit ear examples. we need to be able to create this, select the middle face, delete it.

## dev ideas

`<dialog>` is currently the newest feature in use, we need a test like this to ensure that their browser is up to date:

```js
if (typeof HTMLDialogElement === 'function') {
  /** yep */
} else {
  /** nope */
}
```

we need a good way to "unfold". imagine wanting to unfold the second-previous step. if we had more of a visual history, we could say "unfold___" and click "this one" and it reassigns all crease that were assigned during that step.

"click to restart Rabbit Ear" - automatically downloads updates.

creating a new edge can look like:

```js
edge(4, 12, App.edgeAssignment, App.edgeFoldAngle)
```

## How to build this app

### MacOS, Linux, Windows

Prerequisites: install [Rust](https://www.rust-lang.org/), [Node](https://nodejs.org/en/)

1. Clone this repository.
2. Link rabbit-ear nightly (see below)
3. Run `npm i`
4. Run `npm run tauri dev`

### Linking rabbit-ear nightly

1. Clone and build the dev branch of the [rabbit-ear](https://github.com/rabbit-ear/rabbit-ear/tree/dev) repo:

```sh
# Clone the rabbit-ear repo
git clone https://github.com/rabbit-ear/rabbit-ear.git
cd rabbit-ear
# Checkout the dev branch
git checkout dev
# Build the package
npm run build
# Register the package so it can be linked
npm link
```

2. Run `npm link rabbit-ear` inside of the `rabbit-ear-app` folder to link the package

# Dev log

FOLD format challenges:

- [ ] foldAngles and assignment invalid cases, for example, "F" with a fold angle.

Tools

- [x] new tool: rect
- [ ] new tool: circle arc
- [ ] new tool: compass straight edge style ruler marks
- [ ] new tool: rabbit ear. except make it the straight skeleton. convex only.
- [ ] new tool: sink. can go in conjunction with straight skeleton.
- [ ] right mouse click changes to camera to pan around.
- [x] Snap Grid: ability to change grid: triangles, square, rectangle...
- [ ] axioms 5-7 could be coded better
- [-] foldedLine tool should re-assign existing creases that lay along the path.
- [-] when hovering over folded form, dim actions which cannot be used on it.
- [ ] on "select" tool, only show vertices if "vertices" is selected. maybe? idk.
- [ ] can't place an edge with a non-flat foldAngle
- [ ] it's possible to place a valley crease with 0 fold angle. (should change to F)

App Menu

- [ ] "Frames" menu. duplicate frame, delete frame. IMPORT FOLD AS FRAME.
- [ ] somehow "import into frame", drag and drop into frames.
- [ ] cmd+A in a text box is overwritten in Rust to select graph, not text.
- [-] copy/paste in the app menu doesn't make UI sense
- [-] menu boolean, checkmark reflecting state (Show/Hide) (MacOS only)

File System

- [x] new "empty" origami doesn't work. can't draw edges.
- [x] Show `*` when file is modified
- [x] before quitting "Would you like to save before exiting?"
- [ ] svg import bug, path parse error i think
- [ ] export multiple arrangements of crease patterns and folded forms

Model

- [x] modify CP (scale, transform), zoom doesn't work.
- [ ] "undo" with many frames resets the current frame to the last one.
- [ ] duplicate frame, append it after this frame, don't add it to the end.
- [ ] when Svelte 5 comes out, replace GraphUpdate with an effect.
- [ ] slippery slope to maintain precision. need a creative solution
- [ ] snap to SQRT2 points
- [ ] ability to adjust epsilon app-wide
- [ ] nearest snap point search tree, also with graph components
- [ ] Solver for finding correct fold angles. Simulator feedback, and possible single-vertex matrix nudge solver thing.

Layers

- [x] layer order - workflow has been completely refactored
- [x] move calculation onto background web-worker thread.
- [ ] when layer solver cannot solve, show violations between faces.
- [ ] layer order - report multiple solutions, somehow allow them to toggle it.
- [ ] detect when faces are not simple and convex. show a warning that layer order might be buggy.

Panels

- [x] 3D folded forms user can still select "svg" renderer, need to restructure that whole deal.

SVG / WebGL / Simulator

- [ ] origami simulator doesn't work for large imported svgs.
- [ ] glitchy graphics near 1x1 scale. (500px works, scale-transform might not work)
- [ ] hovering on folded form/simulator shows dots on crease pattern
- [ ] svg text in graph indices drifts away when zooming in
- [ ] folded form (svg) is choppy on zoom (even empty, I think).
- [ ] the tool-svg-layer is disappearing. turning simulator on, folding simulator, going back to cp... using the edge tool.

Frames

- [ ] Tall rectangle CPs don't render fully in frame preview.

Unsorted

- [ ] file_ metadata made it into a frame. caused issues when saving
- [ ] bug: many different sized frames, one empty, delete it, auto switches to hexagon frame but does not resize viewport, it does if you press the zoom but not automatically
- [ ] Moosers train, make layers, clear, make again, somehow different

Done

- [x] ability to use line tools on folded form (edge, axioms).
- [x] frames can vertically scroll.
- [x] "There are too many active WebGL contexts on this page, the oldest context will be lost."
- [x] "blintz-frames.fold" possible error when loading more than 17 WebGL contexts.
- [x] "toggleAssignment" to "toggleAssignments"
- [x] better single vertex analysis.
- [x] simulator "reset", or better "reset zoom" should also reset it's camera
- [x] webgl perspective zoom broken.
- [x] if mouse device, toolbar scrollbar covers up buttons
- [x] getFilenameParts does not work with windows paths (backslash not forwardslash)
- [x] in progress tool leaving canvas, reset, causing issues with further ui input.
- [x] "save as" after saving to a Desktop document, weird directory invalid error
- [x] delete all frames and draw edges with no frame. also, make empty frame is buggy.
- [x] reset style defaults
- [x] need new transform: reflect horiz/vert
- [x] rebuild boundary doesn't work when there are two separate crease patterns.
- [x] need a new RecalculateModelMatrix which compensates for changes in ViewMatrix, removing jumping.
- [x] scale-up a crease pattern, reset zoom no longer works (fixed to old size).
- [x] move FF violations below edges
- [x] 3D gap only on 3D
- [x] snapping for large cps, 400x, snap to grid points overrides.
- [x] folded form layer separation distance
- [x] ability to change folded form paper colors
- [x] css style panels
- [x] "new file" should be a simple yes/no and then trigger "new frame" modal
- [x] style modal popups
- [x] create custom UI elements (radio, slider, buttons)
- [x] selecting vertices, vertices are no longer being shown.
- [x] save preferences in localStorage
- [x] finish menu events
- [x] "reassign selected" doesn't work
- [x] bring back keyboard shortcuts (that are not menu items)
- [x] bring back basic drag and drop
- [x] bring back "delete" key to delete frame
- [x] folded form should report when it cannot fold the crease pattern (and not show it)
- [x] recode axioms 4-7 to use new system of embeded execute methods
- [x] file protocol, filename in title. save button
- [x] import, svg, opx, obj
- [x] basic export
- [x] grid lines are messed up when zooming. "viewBoxOrigin" is buggy.
- [x] UI touch interaction on folded form / simulator


## 2024-01-20

couple month break. fresh perspective, especially with the command syntax. pleat has been recoded and re-introduced, in turn, commands reworked and simplified. There are two classes of commands, those which return useful data (FOLD graphs), and those which return human readable data, like a string summary. The pleat command has 3 layers of nested command calls, these methods being the kind that returns geometry data. The result is very nice and elegant. The plan is to continue to redesign the command syntax and hopefully reach a cleaner, simpler, more versatile, more molecular system.

One thing that is still quite hard-coded is the modification of the document model itself. I wonder if it's possible to expose this at least in a get() context. It's likely that the setting of the model will be a bit hidden.

document.model()
document.model().highlighted()

We need to revisit the way that selections work. It would be nice to be able to select a handfull of faces, perform a pleat, and only those selected faces get pleat lines placed inside.

duplicate a portion of the graph:
- keep it selected, do not planarize
- allow transforms, keep it selected, do not planarize


## 2023-11-01

Amazing accomplishments last month. Not only did I introduce the Folded Form 4 weeks ago (which had already been done in previous apps), but UI fold operations are possible to execute on the folded state, not just on the crease pattern. This is a huge step forward to creating a "diagram maker" application.

Generally speaking, I'm extremelly happy how this app is turning out, it's honestly the tool that I've been dreaming of having and it's actually becoming a reality.


## 2023-10-05

Need to start to think about tools for modifying the folded form. some ideas:

- all-layers fold through line, the simplest operation, already implemented in past versions.
- similar, but, segment, segment with "flat" assignment. segment through all layers. the cool thing is that this can be used to draw shapes on the folded form and see it in the crease pattern.

## 2023-09-28

**Folded form**

I have been putting this off- I need to re-introduce the foldedForm rendering of the crease pattern. Origami simulator is good, but origami simulator:

- does not sort layers.
- does not quickly (or is guaranteed to) report flat-foldability validity.
- is energy expensive.
- will be too difficult to perform folded-state fold operations on.

One thing I realized is that origami simulator and the static folded state rendering serve such a similar purpose, they could potentially inhabit the same physical place on screen. And it's likely that a simple switch to toggle between the two will be enough, as most projects will tend to make heavy use of one or the other, not necessarily both at the same time.

I have succesfully re-implemented the folded-form visualizer. The SVG renderer has become abstracted and now "CreasePattern" and "FoldedForm" inherit from it.

Now, folded form needs to take the role of showing the WebGL View if:

- the FOLD file isn't a crease pattern (just don't render a crease pattern).
- the crease pattern's folded form is a 3D model.

It's easy to check if the folded form is a valid flat-foldable model, which includes checking if the folded form has a valid layer-arrangement. What is more difficult is checking if the folded form has a valid 3D folding. Let me try to outline what that requires:

preliminary: check if there are any edges_foldAngle that are not -180, 0, 180. if so the result is 3D. If the model is 3D:

1. check every vertex individually, I think it's possible to check a single-vertex is foldable using transformation matrices. Similarly this is the first step of the flat-foldable check.
2. run the layer solver, and this filter out any cases which do not have a valid layer folding. However, this does not confirm all cases which do not fail.
3. The final step would be something that Erik or Tom mentioned, detecting face-intersections in 3D the expensive way, which is the only way to do this.

**Feature wishlist**

- [ ] drag vertex, ability to shift-lock to a radial line.
- [x] refactor all the stores to be entirely reactive, encapsulating the final event call into the response for setting a "release". not sure if this is possible. with the more advanced axioms.

## 2023-09-22

In which I consider how to add folded-form folding back into the app.

From the beginning, I promised to keep this app simple and make it have less to do with origami, more to do with a simple 2D graph creator/editor with some origami related construction UI tools.

## bug list:

- [x] viewport resize due to show/hide component does not re-scale origami simulator's html canvas.

## 2023-09-18

Advanced feature list:

- to be able to "clip inside crease pattern" more efficiently, create an alternative representation of the graph, using the existing boundary, remove non-important collinear vertices, run earcut algorithm to build a triangulation, then we can clip segments by running clip on every triangle of the new graph.

- scribble tool requires an algorithm like [Ramer Douglas Peucker](like https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm).


## 2023-08-20

new features:

**ray-repeat**: be able to make a crease and have it propagate throughout the crease pattern by way of

but in terms of the folded state. already in rabbit-ear as `flatFold()`, but with a "F" as the assignment.

## 2023-08-15

Amazingly, I can see the finish line. There are still quite a few remaining issues, and then a wealth of small quality of life improvements which would be confusing to a new user.

Here is a list of the remaining features and bugfixes:

- "select" still needs some more features. need to be able to CTRL+C, V, copy and paste selected subgraph and move it around.
- "translate" needs to be implemented.
- "scale" was just completed, and could use some improvements to the UI.
- Menu items under "select": select by assignment, select 3D angles.
- "merge selected vertices"
- Panels, ToolPanel specficially. needs a big re-work. "select" tool needs to say how many components are selected.
- Flat foldable vertices: Maekawa.
- New Frame popover. Better link between frames. (see below)
- scribble: need to implement. need a way of "simplifying" a polyline.
- pleat: need a better solution, I think.

Link between frames: I discussed this in a note elsewhere, a frame can be a child of another frame, for example, but modify the vertices into the folded state. However, if the first frame changes the number of vertices, the child frame needs to dynamically update. So, I think we need a concept of "modifier", which is a dynamic binding between a child and a parent, and the child is constantly refreshing the data by running this modifier function anytime the first frame changes.

Need to fully explore what it would take to keep track of vertices, edges, and faces in between operations, to try to maintain isometry between components which do not move. calling "planarize()" really disrupts this.

### update: usage issues

> UPDATE: I found the issue. It is that `planarize()` was creating circular edges. This issues has been resolved.

I'm encoutering usage issues while making a crease pattern for a new design. It is often the case that two vertices end up as near-epsilon neighbors; there is a duplicate-vertices issue, at least, there might be something else. I think I need better analysis tools, tools to uncover possible issues, like:

- vertices: too close to each other
- edges: circular, or duplicate should be already removed
- edges: degenerate, due to close vertices, which should be handled by the first vertex solution
- faces: degenerate, area is too small
- faces: winding is in the wrong direction

it would be nice to use the terminal output to report "no duplicate vertices found", for example.

additionally: some fixes

## 2023-07-23

### new feature ideas

- select along line: draw a line segment and all of the graph's edges which lie collinear along your segment will be added to the selection. tool parameter to adjust collinearity similarity.

### concepts

drawing an edge along:

- ruler lines
- radial snapping

should be able to snap along a line. thankfully this should be limited to ruler lines. not all lines in the graph.

snapping

- find nearest grid snap point, this way hexagon grid can be implemented
- new snap algorithm when adding a new point should go like this:

a list of snap points includes:
   - intersections between ruler lines and graph edges
   - intersections between ruler lines
   - graph vertices

1. check against all snap points. remember shortest distance.
2. check against all rulers - nearest point on line/ray.
3. whichever is the closest, check if it is within the snap range, if so we have a snap point, if not there is none. snapping should also let you specify force-snapping or not. like, no matter how far, you need to snap. which is used in the radial-edge snap method.

snap points are different from finding the nearest vertex.

should axiom methods be based on vertex only? or also include snap points?

summary, things that use snapping:

- edge draw 1: weak snap points, allowed to not snap
- edge draw 2: strong snap to ruler lines

ruler lines

- needs to include rays

need a better list of visualization things:

ruler lines (line type), and rays (ray type)

---

decoration lines

ruler lines (and rays), and previews of ruler lines (and rays)
previews of new segments
the selected parts of the graph (vertices, edges, faces)

### tools

camera

- re-center needs to include the size of the graph. when there are no vertices or degenerate, size is 1x1.

select

- so much difficult work to do

vertex

- broken. fix it. shouldn't be too hard

edge

- implement radial snapping. radial snapping degree selector (22.5 vs 30), snapping along radial line.

axioms

- implement the last step. drawing a yellow edge between snap points, and non snap points tbh

kawasaki

- need rays in rulers
- same drawing step as in edge (radially snapped) and drawing along axiom rulers.

pleat

- ability to apply all lines to the entire graph. or choose to just make ruler lines

translate, scale

- make these work

### menu things

insert base


## 2023-07-01: new features

continue to refer to 2023-06-22 list which is not done.

copy and paste:

- copy graph. depending on what is selected, we need to copy a different set of components, for example, if an edge is selected it copies its adjacent vertices, but if vertices are selected, it only copies those edges which are fully selected (between two selected vertices) not leaf-adjacent edges.

- pazte: multiple layers would be nice, someday, until then, we can paste the components as new components creating a disjoint section of the one graph, which is fully selected, allowing the user to switch tools to an affine transform and put the selected area into a new place.

axioms:

- performing an axiom will create one (or many) ruler line(s). this ruler line can disappear after the operation is fully completed. the ruler line should be colored differently than everything else, and should be stored as an infinite line and should render as a `<line>` segment that is always clipped to the viewBox. for example axiom 5 the sequence should go like this:

1. click on a point, drag and release on a line
2. click on a second point (which the line is to pass through)
3. two ruler lines are now generated much like the walking-ant line selection line. all of their intersections with the graph are now snappable vertices, and the lines themselves are snappable (away from a vertex but still along the line at an arbitrary location). the user can now click and draw a segment using the rule line and once the user releases, the rulers disappear.

22.5 degree lock:

- no longer selecting between segment, ray, or line. by default "ray" is the only option. you can click on a vertex and if you are holding shift, it will draw the rule line thing from before (axioms section), and you draw along the line until one of the stopping points.

## 2023-06-22: new feature list

menu:

[ ] menu -> window: flip y axis
[ ] menu -> select: "select all connected"
[ ] menu -> graph: resize canvas
[ ] menu -> graph: resize contents

toolbar:

[ ] somehow we need the ability to make a face
[ ] new tool: ruler tool ("select tool" but for ruler lines)
[ ] new tool: rabbit-ear a face
[ ] new tool: universal-molecule a face

UI events

[ ] ctrl-z undo (redo). build an entire undo history thingy
[ ] translate with number typing (like blender. check axis first.)
[ ] select: need to be able to shift-deselect (remove from selection)
[x] scroll to zoom in and out (half done)
[ ] scroll to zoom in and out at the location of the cursor

general

[x] bring back the right panel which can fine tune the arguments for each tool/operation.
[ ] show edge colors (edges_assignment, edges_foldAngle).
[ ] introduce layers. first layer is the ruler layer.
[x] re-think snapping pt 1. dataset should be separate from the vertices of the graph, and include ruler intersections with the graph.
[ ] re-think snapping pt 2. snap points should be inside an easily searchable binary tree data structure.
[x] bring back origami simulator.

## 2023-06-08: idea for new separate UI visualization layer

Everything is going well, I couldn't anticipate the entire pipeline but it's being uncovered easily enough. I've decided to name the "kernel" as the layer that sits between the UI and the application. it processes inputs into functions and sends them to the application to execute. these functions either manipulate the graph, or manipulate the screen to visualize an in-progress operation.

One issue that has arisen is the need for a pipeline for visualization that includes a copy of the data model, able to be modified, but does not affect the actual data model. For example, during a UI drag event where a vertex is being moved across the screen, previously the graph was updated at every step. Which is possible for something as simple as moving a vertex. But for example simply implementing the ability to hold SHIFT to add a new selection box to the previous selection revealed the need for a cached state of not the graph itself, but the data storing the currently selected components. Because for example, if the user has some components selected, then SHIFT draws a new rectangle but changes their mind, we have to be able to highlight the in-progress selections, and then when they change their mind, return the selected set to the set from before this current SHIFT+select operation.

Additionally, it reminded me that I had already run into this issue building a folding visualizer. When folding a paper using the press and drag operation, the new crease line has to be made from the cached state from before the press occurred.

## 2023-05-21: project outline and plan

This will be 2D (for now), rendering in SVG, with a toolbar GUI interface, with keyboard and mouse/touchpad input. The application core can be accessed via terminal, most application and graph-modifying operations can be typed in and manually run. The graph data model is based on FOLD, with vertices, edges, and faces, where edges can contain attributes. SVG file import will be supported. Rabbit Ear will be used for graph operations such as planarizing, vertex merging, face finding. The backend will be built in a manner such that the front end could one day be swapped out for a 3D interface, handle 3D FOLD graph data, with as few changes as possible needed to make this change.

## features: graph operations

### create vertices or edges or faces

- vertex: click to create new vertex. isolated vertex added to graph.
- edge-1: draw a line segment, which creates an edge and 2 vertices, or uses existing vertices.
- edge-2: be selecting two non-adjacent vertices, create an edge between them.
- face-1: be selecting three or more vertices, create a face.
- face-2: be selecting three or more edges, create a face.

faces_vertices and faces_edges will always be in sync. for a face to exist, all edges between adjacent vertices must exist.

### turn on/off vertex snapping to grid

- new vertices will be snapped to the grid (old will be untouched)
- snap all, all vertices are shifted to their nearest grid coordinate.

UI: toggle-new vertex snapping, button-snap all

### delete V/E/F

- deleting a vertex: will delete any adjacent edges, faces.
- deleting an edge: will delete any adjacent faces, and any isolated vertices. (this is a problem, someone might want to keep the isolated vertex.)
- deleting a face: will not delete any edges or vertices.

UI: no new ui. use select tool and keyboard "delete"

### edge attributes

- change assignment
- change fold angle

UI: see solutions in cp.rabbitear.org/beta/

### graph indices stuff

- change face winding
- change index of V/E/F in its array
   - swap one index with another
   - set an index (auto swap)

UI: not sure, some ideas: swap: click one then the other, swap happens. click one, type a number press enter, swap happens. enter into series beginning with 0, click one after another, auto increments.

### planarize the graph

simple. maybe we have options for epsilon or something but probably not needed.

UI: button

## features: application operations

### set canvas size

canvas size is like the photoshop/illustrator canvas. you can still draw outside of the canvas. canvas is more of a designer tool stating "this is the area i would like to create inside."

show grid lines for the canvas

### zoom and move view around

- also reset view

UI: button to reset view. tool item for panning and zooming view but the functionality is duplicated on the trackpad.

### select vertices or edges or faces

- ability to select multiple (of the same) at once.
- rectangular selection

UI: tool button for select.

### export file as

- fully-saturated FOLD
- minimal FOLD

UI: menubar buttons

### import

- load FOLD (warn if 3D)
- import SVG, planarize, etc.

UI: menubar buttons, popup for SVG import. see: foldfile.com

## terminal

all operations described on here can be expressed as a text-based command. as you perform an operation with the UI, the command text is filled into the terminal. the terminal interface is also accessible to the user to be able to write these commands manually. For example this is a feature in Rhino3D, recreate this same functionality.

## outline: code

### signals/stores

- app: the current UI tool.
- app: can select which: V, E, F.
- currently selected graph component indices.
- currently hovered-over graph component indices.
- device input:
   - keyboard, dictionary of currently pressed keys (for shift-clicking).
   - mouse/touch events on SVG canvas. onpress, onrelease, onmove. one array for each.
- preferences:
   - vertex snapping
- app: current view zoom

- the FOLD graph (a single FOLD frame).
- possibly: the FOLD metadata (all "file_" keys).

### InputManager

the manager knows about the currently selected UI tool, and all input is passed through here and converted into commands to be sent to the engine.

input (mouse, keyboard) events are stored into a collection as they arrive, until the proper conditions have been met (based on the current tool), then the command is executed and the event storage is modified, for example, emptied in preparation for the next command.

unsorted notes:

for example the "delete currently selected" should perform the delete call, which, hopefully is a single function call to the Rabbit Ear library which makes a change to the data model, but then contains additional methods for the UI, such as to clear the currently selected set of components. so, an operation on the graph is in most cases actually an encapsulated function that contains the graph modify call, along with other application-specific and UI related calls. as far as what appears inside the "terminal", it should appear as one function call. "delete edge 4"
