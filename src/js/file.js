/**
 *
 */
export const getFilenameParts = (filePath) => {
	let filename = filePath;
	try {
		filename = filePath.match(/[^/]*$/)[0];
	} catch (error) {}
	try {
		const [_, noExtension] = filePath.match(/(.*)\.[^.]+$/);
		const [__, extension] = filename.match(/[^\\]*\.(\w+)$/);
		const [___, name] = filename.match(/(.*)\.[^.]+$/);
		return { filename, name, extension, noExtension };
	} catch (error) {}
	return { filename, name: filename, extension: "", noExtension: filename };
};

export const makeNumberedFilenames = (count, noExtension, extension) => Array
	.from(Array(count))
	.map((_, i) => `0000${i}`)
	.map(str => str.slice(str.length - 4, str.length))
	.map(n => `${noExtension}-${n}.${extension}`);
