export function sortOnCol<T, U>(a: T, b: T, col: (x: T) => U): number {
	const cola = col(a);
	const colb = col(b);
	if (cola > colb) return 1;
	else if (cola < colb) return -1;
	else return 0;
}