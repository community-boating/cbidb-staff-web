import { ClassTypeType } from 'async/staff/dockhouse/class-types';
import { ClassType, SessionType } from 'async/staff/dockhouse/get-classes';
import { ClassesContext } from 'components/dockhouse/providers/ClassesProvider';
import { ClassTypesContext } from 'components/dockhouse/providers/ClassTypesProvider';
import { SelectInput } from 'components/wrapped/Input';
import { option } from 'fp-ts';
import * as React from 'react';
import { ClassesProps, formatsById } from './ClassesCalendar';

import * as Moment from 'moment';

function isToday(moment: moment.Moment){
    const a = Moment();
    return moment.isBetween(Moment().startOf('day'), Moment().endOf('day'));
}

export default function ClassSelector(props: ClassesProps){
    const classes = React.useContext(ClassesContext);
    const classTypes = React.useContext(ClassTypesContext);
    const selectOptions = React.useMemo(() => {
        const formats = formatsById(classTypes);
        return classes.flatMap((a) => a.$$apClassSessions.filter((a) => isToday(a.sessionDateTime)).map((b) => ({value: b.instanceId, display: formats[a.formatId].b.typeName})))
    }, [classes, classTypes])
    return <SelectInput controlledValue={props.classSession} updateValue={props.setClassSession} selectOptions={selectOptions} autoWidth/>
}