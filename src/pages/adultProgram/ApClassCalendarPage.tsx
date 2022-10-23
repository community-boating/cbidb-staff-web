import Calendar from 'components/calendar/Calendar';
import* as moment from 'moment';
import * as React from 'react';

export const ApClassCalendarPage = () => {
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