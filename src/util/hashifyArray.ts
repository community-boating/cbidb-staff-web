export function hashifyArray<T extends number|string>(ts: T[]) {
	return ts.reduce((hash, e) => {
		hash[e] = true;
		return hash;
	}, {} as {[K: number|string]: true});
}