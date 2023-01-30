import { ClassTypeType } from 'async/staff/dockhouse/class-types';
import { ClassType, SessionType } from 'async/staff/dockhouse/get-classes';
import { ClassesContext } from 'components/dockhouse/providers/ClassesProvider';
import { ClassTypesContext } from 'components/dockhouse/providers/ClassTypesProvider';
import { SelectInput } from 'components/wrapped/Input';
import { option } from 'fp-ts';
import * as React from 'react';
import { Event } from 'react-big-calendar';

function makeEvent(instance: ClassType, session: SessionType, formatsById: FormatById): Event{
    const end = session.sessionDateTime.toDate();
    end.setHours(end.getHours() + session.sessionLength);
    return {
        title: formatsById[instance.formatId].b.typeName,
        start: session.sessionDateTime.toDate(),
        end: end,
        resource: instance.instanceId
    }
}

export function getEvents(classes: ClassType[], classTypes: ClassTypeType[]): Event[]{
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


export default function ClassSelector(props){
    const classes = React.useContext(ClassesContext);
    const classTypes = React.useContext(ClassTypesContext);
    const events = React.useMemo(() => getEvents(classes, classTypes), [classes, classTypes]);
    const [value, setValue] = React.useState<option.Option<number>>(option.none);
    return <SelectInput controlledValue={value} updateValue={setValue} selectOptions={events.map((a) => ({value: a.resource as number, display: a.title}))} autoWidth/>
}