import {
	isFormElementActive,
	isFrameElementSelected,
} from "../../js/dom.js";

export const keyboardCopy = () => {
	console.log("keyboardCopy", isFormElementActive(), isFrameElementSelected());
};

export const keyboardPaste = () => {
	console.log("keyboardPaste", isFormElementActive(), isFrameElementSelected());
};
