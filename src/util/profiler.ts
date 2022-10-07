export function Profiler() {
	var last = Date.now();

	this.lap = function(msg: string) {
		const newLast = Date.now();
		const delta = newLast - last;
		last = newLast;
		return msg + " " + delta
	}
}