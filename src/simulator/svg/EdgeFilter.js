/**
 * Created by amandaghassaei on 2/25/17.
 */

function typeForStroke(stroke) {
  if (stroke === "#000000" || stroke === "#000" || stroke === "black" || stroke === "rgb(0,0,0)") return "border";
  if (stroke === "#ff0000" || stroke === "#f00" || stroke === "red" || stroke === "rgb(255,0,0)") return "mountain";
  if (stroke === "#0000ff" || stroke === "#00f" || stroke === "blue" || stroke === "rgb(0,0,255)") return "valley";
  if (stroke === "#00ff00" || stroke === "#0f0" || stroke === "green" || stroke === "rgb(0,255,0)") return "cut";
  if (stroke === "#ffff00" || stroke === "#ff0" || stroke === "yellow" || stroke === "rgb(255,255,0)") return "triangulation";
  if (stroke === "#ff00ff" || stroke === "#f0f" || stroke === "magenta" || stroke === "rgb(255,0,255)") return "hinge";
  return null;
}

function getStroke(obj) {
  let stroke = obj.getAttribute("stroke");
  if (stroke === undefined) {
    if (obj.style && obj.style.stroke) {
      stroke = obj.style.stroke.toLowerCase();
      stroke = stroke.replace(/\s/g, ""); // remove all whitespace
      return stroke;
    }
    return null;
  }
  stroke = stroke.replace(/\s/g, ""); // remove all whitespace
  return stroke.toLowerCase();
}

function getOpacity(obj) {
  let opacity = obj.getAttribute("opacity");
  if (opacity === undefined) {
    if (obj.style && obj.style.opacity) {
      opacity = obj.style.opacity;
    }
    if (opacity === undefined) {
      opacity = obj.getAttribute("stroke-opacity");
      if (opacity === undefined) {
        if (obj.style && obj.style["stroke-opacity"]) {
          opacity = obj.style["stroke-opacity"];
        }
      }
    }
  }
  opacity = parseFloat(opacity);
  if (isNaN(opacity)) { return 1; }
  return opacity;
}

// filter for svg parsing
function borderFilter(el) {
  const stroke = getStroke(el);
  return typeForStroke(stroke) === "border";
}

function mountainFilter(el) {
  const stroke = getStroke(el);
  if (typeForStroke(stroke) === "mountain") {
    const opacity = getOpacity(el);
    el.targetAngle = -opacity * 180;
    return true;
  }
  return false;
}

function valleyFilter(el) {
  const stroke = getStroke(el);
  if (typeForStroke(stroke) === "valley") {
    const opacity = getOpacity(el);
    el.targetAngle = opacity * 180;
    return true;
  }
  return false;
}

function cutFilter(el) {
  const stroke = getStroke(el);
  return typeForStroke(stroke) === "cut";
}

function triangulationFilter(el) {
  const stroke = getStroke(el);
  return typeForStroke(stroke) === "triangulation";
}

function hingeFilter(el) {
  const stroke = getStroke(el);
  return typeForStroke(stroke) === "hinge";
}

export {
  borderFilter,
  mountainFilter,
  valleyFilter,
  cutFilter,
  triangulationFilter,
  hingeFilter,
}