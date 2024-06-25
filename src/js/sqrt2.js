/**
 *  a     b
 * --- + ---  ×  √2
 *  c     c
 */

const RANGE = 64;

export const Sqrt2LookupToFloat = (a, b, c) => a / c + (b / c) * Math.SQRT2;

export const MakeSqrt2Lookup = (precision = 7) => {
	const results = [];
	for (let a = -RANGE; a <= RANGE; a += 1) {
		for (let b = -RANGE; b <= RANGE; b += 1) {
			for (let c = -RANGE; c <= RANGE; c += 1) {
				const result = Sqrt2LookupToFloat(a, b, c);
				if (result <= 1 && result >= -1) {
					results.push({ a, b, c, result });
				}
			}
		}
	}
	results.sort((a, b) => a.result - b.result);
	const map = {};
	results.forEach(({ result, a, b, c }) => {
		const key = result.toFixed(precision);
		if (!map[key]) {
			map[key] = [];
		}
		map[key].push([a, b, c]);
	});
	Object.keys(map).forEach((key) => {
		map[key].sort((one, two) => {
			const oneSum = Math.abs(one[0]) + Math.abs(one[1]) + Math.abs(one[2]);
			const twoSum = Math.abs(two[0]) + Math.abs(two[1]) + Math.abs(two[2]);
			return oneSum - twoSum;
		});
	});
	const singleMap = {};
	Object.keys(map).forEach((key) => {
		// one more step, if the first 2 elements absolute value sum to the same number,
		// of the first 2 elements get the one that has more positive integers
		const el = map[key];
		const oneSum = Math.abs(el[0][0]) + Math.abs(el[0][1]) + Math.abs(el[0][2]);
		const twoSum = Math.abs(el[1][0]) + Math.abs(el[1][1]) + Math.abs(el[1][2]);
		if (oneSum === twoSum) {
			const oneCount =
				(el[0][0] < 0 ? 0 : 1) +
				(el[0][1] < 0 ? 0 : 1) +
				(el[0][2] < 0 ? 0 : 1);
			const twoCount =
				(el[1][0] < 0 ? 0 : 1) +
				(el[1][1] < 0 ? 0 : 1) +
				(el[1][2] < 0 ? 0 : 1);
			singleMap[key] = oneCount > twoCount ? map[key][0] : map[key][1];
		} else {
			// first 2 elements aren't the same. give me the first one, it's the smallest
			singleMap[key] = map[key][0];
		}
	});
	return singleMap;
};
