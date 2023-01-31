import * as React from 'react';

import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import * as moment from 'moment'
import { ClassesContext } from 'components/dockhouse/providers/ClassesProvider';
import { ClassType, SessionType } from 'async/staff/dockhouse/get-classes';
import { ClassTypesContext } from 'components/dockhouse/providers/ClassTypesProvider';
import { ClassTypeType } from 'async/staff/dockhouse/class-types';
import { option } from 'fp-ts';

const DnDCalendar = withDragAndDrop(Calendar<Event, object>);

function makeEvent(instance: ClassType, session: SessionType, formatsById: FormatById): Event{
    const end = session.sessionDateTime.toDate();
    end.setHours(end.getHours() + session.sessionLength);
    return {
        title: formatsById[instance.formatId].b.typeName + " " + instance.$$apClassSignups.length,
        start: session.sessionDateTime.toDate(),
        end: end,
        resource: session.sessionId
    }
}

export function formatsById(classTypes: ClassTypeType[]){
    return classTypes.reduce((a, b) => {
        return b.$$apClassFormats.reduce((c, d) => {
            c[''] = {derp: 0};
            c[d.formatId] = {b: b, d: d};
            return c;
        }, a)
    }, {} as FormatById);
}

export function getEvents(classes: ClassType[], classTypes: ClassTypeType[]): Event[]{
    const formats = formatsById(classTypes);
    return classes.flatMap((a) => (a.$$apClassSessions.map((b) => makeEvent(a, b, formats))));
}

type FormatById = {
    [key: number]: {
        b: ClassTypeType
        d: ClassTypeType['$$apClassFormats'][number]
    }
}


const minTime = new Date(2020, 1, 0, 6, 0, 0);

const maxTime = new Date(2020, 1, 0, 19, 0, 0);

const localizer = momentLocalizer(moment);

export type ClassesProps = {
    classSession: option.Option<number>
    setClassSession: React.Dispatch<React.SetStateAction<option.Option<number>>>
}

export default function ClassesCalendar(props: ClassesProps){
    const classes = React.useContext(ClassesContext);
    const classTypes = React.useContext(ClassTypesContext);
    const events = React.useMemo(() => getEvents(classes, classTypes), [classes, classTypes]);
    const current = events.filter((a) => a.resource == props.classSession.getOrElse(undefined))[0];
    return <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    selected={current}
    min={minTime}
    max={maxTime}
    onSelectEvent={(e) => {
        props.setClassSession(option.some(e.resource));
    }}
    popup
  />
}