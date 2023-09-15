/**
 *
 */
export const formatCommandResult = (result) => {
	if (result == null) { return undefined; }
	const prompt = `<span class="prompt-symbol">&gt;</span>`;
	switch (typeof result) {
	case "boolean": return `${prompt} <span class="return">${result}</span>`;
	case "number": return `${prompt} <span class="return">${result}</span>`;
	case "string": return `${prompt} <span class="return">${result}</span>`;
	case "object": return `${prompt} <span class="return">${JSON.stringify(result)}</span>`;
	case "function": break;
	}
	return undefined;
};
/**
 *
 */
export const formatCommandCall = (name, args) => {
	let params;
	try {
		params = structuredClone(args);
	} catch (error) {
		throw new Error(`<span class="error">${error}</span>`);
	}
	let paramsString = "";
	try {
		paramsString = params
			? params
				.map(arg => JSON.stringify(arg))
				.map(string => string && string.length > 1000 ? "[JSON]" : string)
				.map(a => `<span class="param">${a}</span>`)
				.join(", ")
			: ""
	} catch (error) { }
	return `<span class="function">${name}</span>(${paramsString})`
};
