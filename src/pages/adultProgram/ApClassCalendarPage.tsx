import { ApClassInstance } from 'async/rest/ap-class-instances';
import Calendar from 'components/calendar/Calendar';
import* as moment from 'moment';
import * as React from 'react';

export const ApClassCalendarPage = (props: {instances: ApClassInstance[]}) => {
	return <Calendar 
		today={moment()}
		monthStartOnDate={0}
		days={[{
			dayMoment: moment(),
			elements: [{
				id: 1,
				display: "Event",
				onClick: () => { alert("hi")}
			}]
		}]}
		showElementsInAdjacentMonths
	/>
}