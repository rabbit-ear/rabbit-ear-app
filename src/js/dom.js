/**
 * @description Walk up the chain of parents of a DOM element
 * until we find an element with a .nodeName property matching
 * the supplied parameter. Return the matching element, or undefined.
 */
export const findInParents = (element, nodeName) => {
	if ((element.nodeName || "") === nodeName) {
		return element;
	}
	return element.parentNode
		? findInParents(element.parentNode, nodeName)
		: undefined;
};
/**
 * @description Convert a 2D point coordinates from screen/canvas/
 * pixel units, into viewBox units.
 */
export const convertToViewBox = function (svg, [x, y]) {
	const pt = svg.createSVGPoint();
	// transform: matrix(1, 0, 0, -1, 0, 1);
	pt.x = x;
	pt.y = y;
	// todo: i thought this threw an error once. something about getScreenCTM.
	const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [svgPoint.x, svgPoint.y];
};
/**
 * @description Query the document.activeElement and depending on
 * which element is active, return true if that element is a form
 * element which typically accepts text input. This includes input
 * type=text, does not include type=radio.
 */
export const isFormElementActive = () => {
	const node = document.activeElement;
	if (!node) {
		return false;
	}
	const name = (node.nodeName || "").toLowerCase();
	const type = (node.type || "").toLowerCase();
	// if these node types are currently active,
	// touches will not be intercepted.
	switch (name) {
		case "textarea":
			return true;
		case "input":
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
/**
 * @description Check if one of the frames in the frame-timeline
 * is selected. This is useful to add keyboard features to the frames,
 * like the ability to delete or duplicate frames.
 */
export const isFrameElementSelected = () =>
	document.activeElement &&
	document.activeElement.classList &&
	(document.activeElement.classList.contains("button-frame-item") ||
		document.activeElement.classList.contains("frames"));
