import * as moment from 'moment';

export function toMomentFromLocalDateTime(input: string): moment.Moment {
	return moment(input, "YYYY-MM-DDTHH:mm:ss")
}

export function toMomentFromLocalDate(input: string): moment.Moment {
	return moment(input, "YYYY-MM-DD")
}

export function sortOnMoment<T>(f: (e: T) => moment.Moment): ((a: T, b: T) => number) {
	return (a: T, b: T) => {
		const aMoment = f(a);
		const bMoment = f(b);
		return Number(aMoment.format('X')) - Number(bMoment.format('X'));
	}
}

export function padWithZero(s: string) {
	if (s.length == 1) return "0" + s;
	else return s;
}
