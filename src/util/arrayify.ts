export function arrayifyCollection<T extends Element>(coll: HTMLCollectionOf<T>) {
	var ret: T[] = [];
	for (var i=0; i<coll.length; i++) {
		ret[i] = coll[i];
	}
	return ret;
}