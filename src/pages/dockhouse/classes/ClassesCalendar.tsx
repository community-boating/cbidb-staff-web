import * as React from 'react';

import { Calendar, Event, momentLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import * as moment from 'moment'
import { ClassTypesContext } from 'async/providers/ClassTypesProvider';
import { ClassTypeType } from 'async/staff/dockhouse/class-types';
import { option } from 'fp-ts';
import { ApClassSession } from 'async/staff/dockhouse/ap-class-sessions';
import { ActionModalContext } from 'components/dockhouse/actionmodal/ActionModal';
import { ActionClass } from 'components/dockhouse/actionmodal/class/ActionClass';
import { ClassesTodayContext } from 'async/providers/ClassesTodayProvider';
import { formatsById } from './formatsById';

const DnDCalendar = withDragAndDrop(Calendar<Event, object>);

function makeEvent(session: ApClassSession, formatsById: FormatById): Event{
    const end = session.sessionDateTime.toDate();
    end.setHours(end.getHours() + session.sessionLength);
    return {
        title: (formatsById[session.$$apClassInstance.formatId] || {b: {}}).b.typeName + " [Instructor]" + (session.$$apClassInstance.locationString.isSome() ? " @ " + session.$$apClassInstance.locationString.getOrElse("") : ""), 
        start: session.sessionDateTime.toDate(),
        end: end,
        resource: session
    }
}

export function getEvents(classes: ApClassSession[], classTypes: ClassTypeType[]): Event[]{
    const formats = formatsById(classTypes);
    return classes.map((a) => makeEvent(a, formats));
}

export type FormatById = {
    [key: number]: {
        b: ClassTypeType
        d: ClassTypeType['$$apClassFormats'][number]
    }
}


const minTime = new Date(2020, 1, 0, 6, 0, 0);

const maxTime = new Date(2020, 1, 0, 19, 0, 0);

const localizer = momentLocalizer(moment);

export type ClassesProps = {
    //classSession: option.Option<number>
    //setClassSession: React.Dispatch<React.SetStateAction<option.Option<number>>>
}

export default function ClassesCalendar(props: ClassesProps){
    const modal = React.useContext(ActionModalContext);
    const classes = React.useContext(ClassesTodayContext);
    const [classSession, setClassSession] = React.useState<option.Option<number>>(option.none);
    const openModal = (s) => {
        const found = !classes.every((a) => {
                if(a.sessionId == s.getOrElse(undefined)){
                    modal.pushAction(new ActionClass(a.sessionId));
                    return false;
                }
                return true;
        });
        if(found){
            //setClassSession(s);
        }else{
            //TODO
        }
    }
    const classTypes = React.useContext(ClassTypesContext);
    const events = React.useMemo(() => getEvents(classes, classTypes), [classes, classTypes]);
    const current = events.filter((a) => a.resource == classSession.getOrElse(undefined))[0];
    return <Calendar
    className="max-h-[calc(100vh-200px)] overflow-y-scroll"
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    defaultView={Views.DAY}
    
    views={{month: true, week: true, day: true, agenda: true}}
    selected={current}
    min={minTime}
    max={maxTime}
    scrollToTime={new Date()}
    onSelectEvent={(e) => {
        openModal(option.some(e.resource.sessionId))
    }}
    popup
  />
}