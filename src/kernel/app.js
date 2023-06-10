import { get } from "svelte/store";
import { history } from "../stores/app.js";
import * as Functions from "./functions.js";

export const execute = (funcName, ...args) => {
	const func = Functions[funcName];
	if (!func) {
		console.error(new Error("no known function with that name"));
		return;
	}
	let res;
	try {
		res = func(...args);
	} catch (error) {
		console.error(error);
		return res;
	}
	history.set([...get(history), { func, args }]);
	return res;
};
