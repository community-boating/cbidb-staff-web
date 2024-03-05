import * as React from 'react';

import { Calendar, Event, momentLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import * as moment from 'moment'
import { ClassTypesContext } from 'async/providers/ClassTypesProvider';
import { option } from 'fp-ts';
import { ApClassInstanceWithSignups, ApClassInstance, ApClassSession, ApClassSessionWithInstance, ApClassType } from 'models/typerefs';
import { ActionModalContext } from 'components/dockhouse/actionmodal/ActionModal';
import { ClassesTodayContext } from 'async/providers/ClassesTodayProvider';
import { formatsById } from './formatsById';
import { AllClassesContext } from 'async/providers/AllClassesProvider';

const DnDCalendar = withDragAndDrop(Calendar<Event, object>);

function makeEvent(session: ApClassSession, instance: ApClassInstanceWithSignups | ApClassInstance/*, formatsById: FormatById*/): Event{
    const end = session.sessionDatetime.toDate();
    end.setHours(end.getHours() + session.sessionLength);
    return {
        title: (formatsById[instance.formatId] || {b: {}}).b.typeName +
        "", 
        start: session.sessionDatetime.toDate(),
        end: end,
        resource: session
    }
}

export function getEvents(classesToday: ApClassSessionWithInstance[], allClasses: ApClassInstance[], classTypes: ApClassType[]): Event[]{
    //const formats = formatsById(classTypes);
    console.log(allClasses);
    return allClasses.flatMap((a) => a.$$apClassSessions.map((b) => makeEvent(b, a/*, formats*/)))
}

export type FormatById = {
    [key: number]: {
        b: ApClassType
        //d: ApClassType['$$apClassFormats'][number]
    }
}


const minTime = new Date(2020, 1, 0, 6, 0, 0);

const maxTime = new Date(2020, 1, 0, 19, 0, 0);

const localizer = momentLocalizer(moment);

export type ClassesProps = {
    handleSelectClass: (s: ApClassSessionWithInstance) => void
    //classSession: option.Option<number>
    //setClassSession: React.Dispatch<React.SetStateAction<option.Option<number>>>
}

export default function ClassesCalendar(props: ClassesProps & {isDLV: boolean}){
    const modal = React.useContext(ActionModalContext);
    const classes = React.useContext(ClassesTodayContext);
    const [classSession, setClassSession] = React.useState<option.Option<number>>(option.none);
    
    const allClasses = React.useContext(AllClassesContext);
    const classTypes = React.useContext(ClassTypesContext);
    const events = React.useMemo(() => getEvents(classes.state, allClasses, classTypes), [classes, classTypes]);
    const current = events.filter((a) => a.resource == classSession.getOrElse(undefined))[0];
        return <div className="flex flex-col grow-[1] basis-1 w-full h-full">
            <div className="flex flex-col basis-1 grow-[1] w-full">
            <Calendar
        className={"h-full overflow-y-scroll basis-1 grow-[1] w-full"}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.DAY}
        views={props.isDLV ? {day: true} : {month: true, week: true, day: true, agenda: true}}
        selected={current}
        min={minTime}
        max={maxTime}
        scrollToTime={new Date()}
        onSelectEvent={(e) => {
            props.handleSelectClass(e.resource);
        }}
        popup
        toolbar={!props.isDLV}
    />
    </div>
  </div>
}