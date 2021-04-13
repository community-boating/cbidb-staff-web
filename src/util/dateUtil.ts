import * as moment from 'moment';

export function toMomentFromLocalDateTime(input: string): moment.Moment {
	return moment(input, "YYYY-MM-DDTHH:mm:ss")
}

export function tableSortByDate(fieldName: string) {
	return (a, b, order, dataField, rowA, rowB) => {
		const momentA = rowA[fieldName] as moment.Moment;
		const momentB = rowB[fieldName] as moment.Moment;
		const delta = Number(momentA.format('X')) - Number(momentB.format('X'));
		if (order === 'asc') {
		  return delta;
		} else {
			return -1 * delta;
		}
	}
}