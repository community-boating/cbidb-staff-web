import * as moment from 'moment';

export function toMomentFromLocalDateTime(input: string): moment.Moment {
	return moment(input, "YYYY-MM-DDTHH:mm:ss")
}