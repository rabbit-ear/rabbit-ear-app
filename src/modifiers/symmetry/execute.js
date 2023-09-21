import { get } from "svelte/store";
import {
	multiplyMatrix2Vector2,
	makeMatrix2Reflect,
} from "rabbit-ear/math/matrix2.js";
import { parseToTokens } from "../general.js";
import { ReflectionLines } from "../../tools/symmetry/stores.js";

const repeatableMethods = {
	"segment": true,
};

// const inject = (js) => {
// 	const tokens = parseToTokens(js)
// 		.filter(el => el.type === "WhiteSpace");
// 	console.log("tokens", tokens);
// 	for (let i = 0; i < tokens.length; i += 1) {
// 		if (tokens[i].type === "IdentifierName"
// 			&& repeatableMethods[tokens[i].value]) {
// 			console.log("found", i, tokens[i].value);
// 		}
// 	}
// 	return js;
// }

// const execute = (commands = []) => {
// 	// console.log("symmetry", commands);
// 	for (let i = 0; i < commands.length; i += 1) {
// 		commands[i] = inject(commands[i]);
// 	}
// };

// segment([0.3478008508682251,0.2496945858001709], [0.6468234658241272,0.4983201324939728])

const applicableMethod = (tokens) => tokens
	.filter(el => el.type === "IdentifierName")
	.map(el => el.value)
	.filter(value => repeatableMethods[value])
	.shift();

const copyMethod = (commandName, tokens) => {
	const paramTokens = tokens
		.filter(el => el.type !== "IdentifierName")
		.filter(el => el.type !== "WhiteSpace");
	// we removed the function name, now remove the () parenthesis.
	paramTokens.shift();
	paramTokens.pop();
	const paramsString = `[${paramTokens.map(el => el.value).join("")}]`;
	const params = JSON.parse(paramsString);
	// console.log("paramTokens", paramTokens);
	// console.log("paramsString", paramsString);
	// console.log("params", params);
	switch (commandName) {
	case "segment":
		const reflections = get(ReflectionLines);
		const transforms = reflections
			.map(({ vector, origin }) => makeMatrix2Reflect(vector, origin));
		const point0 = params[0];
		const point1 = params[1];
		const newSegments = transforms
			.map(matrix => params.map(p => multiplyMatrix2Vector2(matrix, p)));
		return newSegments
			.map(segment => segment
				.map(point => `[${point.join(",")}]`)
				.join(", "))
			.map(coords => `segment(${coords})`);
	}
	// const tokens = parseToTokens(command);
	// console.log(tokens);
	return [];
};

const execute = (commands = []) => {
	const commandsTokens = commands.map(parseToTokens);
	for (let i = commands.length - 1; i >= 0; i -= 1) {
		const match = applicableMethod(commandsTokens[i]);
		if (match === undefined) { continue; }
		const clones = copyMethod(match, commandsTokens[i]);
		commands.splice(i, 0, ...clones);
	}
};

export default execute;
