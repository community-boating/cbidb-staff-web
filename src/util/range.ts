export default function range(start: number, end: number): number[] {
	if (end < start) return [];
	var ret = [];
	for (var i=start; i <= end; i++) ret.push(i);
	return ret;
}