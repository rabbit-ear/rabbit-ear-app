export const findInParents = (element, nodeName) => {
	if ((element.nodeName || "") === nodeName) {
		return element;
	}
	return element.parentNode
		? findInParents(element.parentNode, nodeName)
		: undefined;
};

export const convertToViewBox = function (svg, x, y) {
	const pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	// todo: i thought this threw an error once. something about getScreenCTM.
	const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [svgPoint.x, svgPoint.y];
};

// form element that take in text input (type=text, number, etc..)
// form elements like radio do not count,
// keyboard event should bubble through.
export const isFormElementActive = () => {
	const node = document.activeElement;
	if (!node) { return false; }
	const name = (node.nodeName || "").toLowerCase();
	const type = (node.type || "").toLowerCase();
	// if these node types are currently active,
	// touches will not be intercepted.
	switch (name) {
	case "textarea": return true;
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
		case "text": return true;
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
	}
	// an alternative approach would be to store a reference
	// to every known form element (which requires generating
	// this list), and the compare directly to these references, like:
	// if (document.activeElement === get(TerminalTextarea))
};
