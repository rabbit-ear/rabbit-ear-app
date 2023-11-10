export function exposeWorker(func) {
	/* eslint-disable-next-line no-restricted-globals */
	self.onmessage = async (e) => {
		const r = func(e.data);
		if (r && r[Symbol.asyncIterator]) {
			/* eslint-disable-next-line no-restricted-globals */
			for await (const i of r) self.postMessage(i);
		} else if (r && r[Symbol.iterator]) {
			/* eslint-disable-next-line no-restricted-globals */
			for (const i of r) self.postMessage(i);
		} else {
			/* eslint-disable-next-line no-restricted-globals */
			self.postMessage(await r);
		}
	};
}
