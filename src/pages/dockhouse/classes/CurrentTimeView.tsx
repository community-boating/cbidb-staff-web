import * as React from "react"
import { Calendar, momentLocalizer, Navigate } from "react-big-calendar"
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import * as PropTypes from 'prop-types';
import * as moment from "moment";
import { ClassesTodayContext } from "async/providers/ClassesTodayProvider";
import { ClassTypesContext } from "async/providers/ClassTypesProvider";
import { getEvents } from "./ClassesCalendar";

function CurrentTimeView({
    date,
    localizer,
    max = localizer.endOf(new Date(), 'hour'),
    min = localizer.startOf(new Date(), 'hour'),
    scrollToTime = localizer.startOf(new Date(), 'day'),
    ...props
}) {
    const currRange = React.useMemo(
        () => CurrentTimeView.range(date, { localizer }),
        [date, localizer]
    )

    console.log(currRange);

    return (
        <TimeGrid
            date={date}
            localizer={localizer}
            max={max}
            min={min}
            range={currRange}
            scrollToTime={scrollToTime}
            {...props}
        />
    )
}

CurrentTimeView.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    localizer: PropTypes.object,
    max: PropTypes.instanceOf(Date),
    min: PropTypes.instanceOf(Date),
    scrollToTime: PropTypes.instanceOf(Date),
}

CurrentTimeView.range = (date, { localizer }) => {
    console.log("calling");
    const start = localizer.startOf(new Date(), 'day')
    const end = localizer.endOf(new Date(), 'week');

    let current = start
    const range = []

    while (localizer.lte(current, end, 'day')) {
        console.log("pushing");
        range.push(current)
        current = localizer.add(current, 1, 'hour')
    }

    return range
}

CurrentTimeView.navigate = (date, action, { localizer }) => {
    switch (action) {
        case Navigate.PREVIOUS:
            return localizer.add(date, -3, 'day')

        case Navigate.NEXT:
            return localizer.add(date, 3, 'day')

        default:
            return date
    }
}

CurrentTimeView.title = (date) => {
    return `My awesome week: ${date.toLocaleDateString()}`
}


const localizer = momentLocalizer(moment);


export default function CurrentTimeCalendar() {
    const classesToday = React.useContext(ClassesTodayContext);
    const classTypes = React.useContext(ClassTypesContext);
    const events = React.useMemo(() => getEvents(classesToday, classTypes), [classesToday, classTypes]);
    return <Calendar
        className="overflow-y-scroll max-h-full w-full"
        defaultView={'agenda'}
        events={events}
        localizer={localizer}
        views={{ agenda: true }}
        toolbar={false}
        

    />
}



CurrentTimeCalendar.propTypes = {
}