let count = 0;

addEventListener("message", ({ data }) => {
  count++;
  postMessage({ count, data, message: "simple worker received a message" });
});

addEventListener("error", ({ error }) =>
  console.warn("simple.worker.js, unhandled error"),
);

addEventListener("messageerror", () =>
  console.warn("simple.worker.js, unhandled messageerror"),
);

