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

export function validMilitaryTime(time: string): boolean {
	const regex = /^([01][0-9]|20|21|22|23):[012345][0-9]$/
	return !!regex.exec(time)
}

export function padWithZero(s: string) {
	if (s.length == 1) return "0" + s;
	else return s;
}
