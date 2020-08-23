interface Array<T> {
	// find(p: (t: T) => boolean): Optional<T>
	flatten<U>(): U[]
	zipWithIndex(): [T, number][]
	grouped(size: number): T[][]
	contains(e: T): boolean
	flatMap<U>(f: (e: T, i: number) => U[]): U[],
	splitAt(at: number): Array<T>[]
}
	
// Array.prototype.find = function(p: any) {
// 	for (var i=0; i<this.length; i++) {
// 		if (p(this[i])) return Some(this[i]);
// 	}
// 	return None();
// }

Array.prototype.flatten = function() {
	return this.reduce(function(flattened: any, e: any) {
		if (e instanceof Array) flattened = flattened.concat(e);
		else flattened.push(e);
		return flattened;
	}, []);
}

Array.prototype.zipWithIndex = function() {
	return this.map((e: any, i: number) => [e, i]);
}

Array.prototype.grouped = function(size: number) {
	var groups = [];
	var group = [];
	for (var i=0; i<this.length; i++) {
		if (group.length >= size) {
			groups.push(group)
			group = [];
		}
		group.push(this[i]);
	}
	groups.push(group);
	return groups;
}

Array.prototype.contains = function(e: any) {
	for (var i=0; i<this.length; i++) {
		if (this[i] == e) return true;
	}
	return false;
}

Array.prototype.flatMap = function<U>(f: (e: any, i: number) => Array<U>) {
	var ret: U[] = [];
	for (var i=0; i<this.length; i++) {
		var element = this[i];
		ret = ret.concat(f(element, i))
	}
	return ret;
}

Array.prototype.splitAt = function(at: number) {
	const left = this.filter((e: any, i: number) => i < at)
	const right = this.filter((e: any, i: number) => i >= at)
	return [left, right]
}