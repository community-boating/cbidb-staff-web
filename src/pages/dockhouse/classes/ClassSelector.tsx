import { AllClassesContext } from 'async/providers/AllClassesProvider';
import { ClassTypesContext } from 'async/providers/ClassTypesProvider';
import { SelectInput } from 'components/wrapped/Input';
import { option } from 'fp-ts';
import * as React from 'react';
import { ClassesProps } from './ClassesCalendar';
import { formatsById } from "./formatsById";

import * as Moment from 'moment';

function isToday(moment: moment.Moment){
    const a = Moment();
    return moment.isBetween(Moment().startOf('day'), Moment().endOf('day'));
}

export default function ClassSelector(props: ClassesProps){
    const classes = React.useContext(AllClassesContext);
    const selectOptions = React.useMemo(() => {
        //const formats = formatsById(classTypes);
        //return classes.flatMap((a) => a.$$apClassSessions.filter((a) => isToday(a.sessionDateTime)).map((b) => ({value: b.instanceId, display: formats[a.formatId].b.typeName})))
    }, [classes])
    //return <SelectInput controlledValue={props.classSession} updateValue={props.setClassSession} selectOptions={[]} autoWidth/>
}