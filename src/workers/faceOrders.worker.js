// Upon new Worker() initialization, this one import line takes about 200ms.
// This implies that we want to initialize a web worker ahead of time,
// and call into it whenever we want to use it. This led to the use of a hash,
// where in the "message" data event, the user can supply a hash string,
// which will be returned in the postMessage upon success or error.
// The user can match the hash from the return event to the event they started.
import { layer3D } from "rabbit-ear/layer/layer.js";

// Not needed anymore, now that everything is encapsulated in "message" handler.
// Used in the event of an error.
// When the user starts the worker, we hold onto the "hash" property passed in.
// This gets sent back in the return, and in the case of an error,
// the error is outside the message scope, we need to hold onto the hash here.
// let cachedHash = "";

addEventListener("message", ({ data }) => {
  const { graph, epsilon, uuid } = data;
  // cachedHash = hash;
  try {
    // fail 1: this fires when an empty graph is supplied,
    // as happens on boot before a frame has been initialized.
    if (
      !graph ||
      !graph.vertices_coords ||
      !graph.edges_vertices ||
      !graph.faces_vertices
    ) {
      postMessage({ uuid, error: "empty graph" });
      return;
    }
    postMessage({ uuid, result: layer3D(graph, epsilon).faceOrders() });
  } catch (error) {
    // fail 2: this fires when the layer solver fails.
    // console.warn("+++ solver fail +++", hash);
    postMessage({ uuid, error: error.message });
    // strangely, forming the return event as below changes the return event.
    // it seems the engine is able to detect the presence of an Error object
    // type, it returns that Error object alone instead, triggering the
    // "on error" event listed below. hence, just kind of moving the error
    // to be handled in a more proper setting. by not including the Error
    // type, we prevent the calling of the "on error" event altogether,
    // allowing us to encapsulate all message sending inside of this one function.
    // postMessage({ hash, error });
  }
});

// from the try-catch above, if we post a message that contains an Error
// object type somewhere inside of it, it triggers this event to be called.
// if we don't ever include an Error, this will never be called, but we
// can still handle a custom "error" event in the "on message" event above.
// addEventListener("error", ({ error }) => (
// 	postMessage({ error, hash: cachedHash })
// ));
addEventListener("error", ({ error }) =>
  console.warn("orders.worker.js, unhandled error"),
);

// haven't seen this one yet. event object is type MessageEvent,
// https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
// but, not sure if the event object has an "error".
addEventListener("messageerror", () =>
  console.warn("orders.worker.js, unhandled messageerror"),
);

// ////////////////////////////////////////
// things I learned:
// from inside the Web Worker, if the graph is an empty object, meaning
// "faces_vertices" doesn't exist, then calling each method results in:
// Test1: "DataCloneError: The object can not be cloned."
// Test2: no error.
//
const Test1 = ({ faces_vertices }) => faces_vertices.length;
const Test2 = ({ faces_vertices }) => "hi";

