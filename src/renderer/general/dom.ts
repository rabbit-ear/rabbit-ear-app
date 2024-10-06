/**
 * @description Walk up the chain of parents of a DOM element
 * until we find an element with a .nodeName property matching
 * the supplied parameter. Return the matching element, or undefined.
 */
export const findInParents = (
  element: Element,
  nodeName: string,
): Element | undefined => {
  if ((element.nodeName || "") === nodeName) {
    return element;
  }
  return element.parentNode
    ? findInParents(element.parentNode as Element, nodeName)
    : undefined;
};

/**
 * @description Convert a 2D point coordinates from screen/canvas/
 * pixel units, into viewBox units.
 */
export const convertToViewBox = (
  svg: SVGSVGElement,
  [x, y]: [number, number],
): [number, number] => {
  const pt = svg.createSVGPoint();
  // transform: matrix(1, 0, 0, -1, 0, 1);
  pt.x = x;
  pt.y = y;
  const domMatrix = svg.getScreenCTM();
  if (!domMatrix) {
    return [0, 0];
  }
  const svgPoint = pt.matrixTransform(domMatrix.inverse());
  return [svgPoint.x, svgPoint.y];
};

/**
 * @description Query the document.activeElement and depending on
 * which element is active, return true if that element is a form
 * element which typically accepts text input. This includes input
 * type=text, does not include type=radio.
 */
export const isFormElementActive = (): boolean => {
  const element = document.activeElement;
  if (!element) {
    return false;
  }
  const name = (element.nodeName || "").toLowerCase();
  // if these node types are currently active,
  // touches will not be intercepted.
  switch (name) {
    case "textarea":
      return true;
    case "input":
      const formElement = element as HTMLInputElement;
      const type = (formElement.type || "").toLowerCase();
      switch (type) {
        case "date":
        case "datetime-local":
        case "month":
        case "number":
        case "password":
        case "tel":
        case "time":
        case "email":
        case "text":
          return true;
        case "button":
        case "checkbox":
        case "color":
        case "file":
        case "hidden":
        case "image":
        case "radio":
        case "range":
        case "reset":
        case "search":
        case "submit":
        case "url":
        case "week":
        default:
          return false;
      }
    default:
      return false;
  }
  // an alternative approach would be to store a reference
  // to every known form element (which requires generating
  // this list), and the compare directly to these references, like:
  // if (document.activeElement === get(TerminalTextarea))
};
