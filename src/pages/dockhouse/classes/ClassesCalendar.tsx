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
import { AllClassesContext } from 'async/providers/AllClassesProvider';
import { ModalContextType } from 'components/wrapped/Modal';
import { ActionModalProps } from 'components/dockhouse/actionmodal/ActionModalProps';

const DnDCalendar = withDragAndDrop(Calendar<Event, object>);

function makeEvent(session: ApClassSession, formatsById: FormatById, isToday: boolean): Event{
    const end = session.sessionDateTime.toDate();
    end.setHours(end.getHours() + session.sessionLength);
    return {
        title: (formatsById[session.$$apClassInstance.formatId] || {b: {}}).b.typeName + (isToday ? ( " [Instructor]" + (session.$$apClassInstance.locationString.isSome() ? " @ " + session.$$apClassInstance.locationString.getOrElse("") : "") + " " + session.$$apClassInstance.$$apClassSignups.length) : ""), 
        start: session.sessionDateTime.toDate(),
        end: end,
        resource: session
    }
}

export function getEvents(classesToday: ApClassSession[], allClasses: ApClassSession[], classTypes: ClassTypeType[]): Event[]{
    const formats = formatsById(classTypes);
    return allClasses.filter((a) => !classesToday.some((b) => b.sessionId == a.sessionId)).map((a) => makeEvent(a, formats, false)).concat(
        classesToday.map((a) => makeEvent(a, formats, true))
    )
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
    handleSelectClass: (s: ApClassSession) => void
    //classSession: option.Option<number>
    //setClassSession: React.Dispatch<React.SetStateAction<option.Option<number>>>
}

export const openClassModal = (modal: ActionModalProps) => (s: ApClassSession) => {
    modal.pushAction(new ActionClass(s.sessionId));
}

export default function ClassesCalendar(props: ClassesProps){
    const modal = React.useContext(ActionModalContext);
    const classes = React.useContext(ClassesTodayContext);
    const [classSession, setClassSession] = React.useState<option.Option<number>>(option.none);
    
    const allClasses = React.useContext(AllClassesContext);
    const classTypes = React.useContext(ClassTypesContext);
    const events = React.useMemo(() => getEvents(classes.state, allClasses, classTypes), [classes, classTypes]);
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
        props.handleSelectClass(e.resource);
    }}
    popup
  />
}