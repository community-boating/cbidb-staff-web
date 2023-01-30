import * as React from 'react';

import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import * as moment from 'moment'
import { ClassesContext } from 'components/dockhouse/providers/ClassesProvider';
import { ClassType, SessionType } from 'async/staff/dockhouse/get-classes';
import { ClassTypesContext } from 'components/dockhouse/providers/ClassTypesProvider';
import { ClassTypeType } from 'async/staff/dockhouse/class-types';

const DnDCalendar = withDragAndDrop(Calendar<Event, object>);

const end = new Date()
end.setHours(end.getHours() + 1)

const myEvents: Event[] = [
    {title: "Derp",
    start: new Date(),
    end: end,
    allDay: false
    }
]

const minTime = new Date(2020, 1, 0, 6, 0, 0);

const maxTime = new Date(2020, 1, 0, 19, 0, 0);

const localizer = momentLocalizer(moment)

function makeEvent(instance: ClassType, session: SessionType, formatsById: FormatById): Event{
    const end = session.sessionDateTime.toDate();
    end.setHours(end.getHours() + session.sessionLength);
    return {
        title: formatsById[instance.formatId].b.typeName,
        start: session.sessionDateTime.toDate(),
        end: end
    }
}

export function getEvents(classes: ClassType[], classTypes: ClassTypeType[]){
    const formatsById = classTypes.reduce((a, b) => {
        return b.$$apClassFormats.reduce((c, d) => {
            c[''] = {derp: 0};
            c[d.formatId] = {b: b, d: d};
            return c;
        }, a)
    }, {} as FormatById);
    return classes.flatMap((a) => (a.$$apClassSessions.map((b) => makeEvent(a, b, formatsById))));
}

type FormatById = {
    [key: number]: {
        b: ClassTypeType
        d: ClassTypeType['$$apClassFormats'][number]
    }
}

export default function ClassesCalendar(props){
    const classes = React.useContext(ClassesContext);
    const classTypes = React.useContext(ClassTypesContext);
    const events = React.useMemo(() => getEvents(classes, classTypes), [classes, classTypes]);
    return <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    min={minTime}
    max={maxTime}
    popup
  />
}