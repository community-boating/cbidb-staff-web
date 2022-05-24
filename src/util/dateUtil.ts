import * as moment from 'moment';

export const DATE_FORMAT_LOCAL_DATETIME = "YYYY-MM-DDTHH:mm:ss";
export const DATE_FORMAT_LOCAL_DATE = "YYYY-MM-DD"

export function toMomentFromLocalDateTime(input: string): moment.Moment {
	return moment(input, DATE_FORMAT_LOCAL_DATETIME)
}

export function toMomentFromLocalDate(input: string): moment.Moment {
	return moment(input, DATE_FORMAT_LOCAL_DATE)
}

export function sortOnMoment<T>(f: (e: T) => moment.Moment): ((a: T, b: T) => number) {
	return (a: T, b: T) => {
		const aMoment = f(a);
		const bMoment = f(b);
		return Number(aMoment.format('X')) - Number(bMoment.format('X'));
	}
}
