import app from "../../../app/App.svelte";

export default (vector: [number, number]): void => {
  app.invoker.executeJavascript(`translate(${vector.join(", ")})`);
  //app.model.shapes.forEach((shape) => {
  //  if (shape.name === "circle") {
  //    shape.params.cx += vector[0];
  //    shape.params.cy += vector[1];
  //  }
  //});
};
