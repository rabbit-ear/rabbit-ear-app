const keysStartingWith = (fold, prefix) => Object.keys(fold)
	.filter(key => key.slice(0, prefix.length) === prefix);

const keysEndingWith = (fold, suffix) => Object.keys(fold)
	.filter(key => key.slice(-suffix.length) === suffix);

const remapField = (fold, field, old2new) => {
	const new2old = [];
	// later overwrites earlier
	for (let i = 0; i < old2new.length; i += 1) {
		const j = old2new[i];
		// null means throw away that object
		if (j != null) {
			new2old[j] = i;
		}
	}
	const prefixes = keysStartingWith(fold, `${field}_`);
	for (let i = 0; i < prefixes.length; i += 1) {
		fold[prefixes[i]] = new2old.map(val => fold[prefixes[i]][val]);
	}
	const suffixes = keysEndingWith(fold, `_${field}`);
	for (let i = 0; i < suffixes.length; i += 1) {
		fold[suffixes[i]] = fold[suffixes[i]].map(arr => arr.map(val => old2new[val]));
	}
	return fold;
};

export default remapField;
