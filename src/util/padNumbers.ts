export const padNumber = (num: number, places: number) => {
	let result = String(num);
	while (result.length < places) {
		result = '0' + result;
	}
	return result;
}