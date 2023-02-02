import { InstructorType } from 'async/rest/class-instructor';
import { InstructorsContext } from 'components/dockhouse/providers/InstructorsProvider';
import { SelectInput } from 'components/wrapped/Input';
import { option } from 'fp-ts';
import * as React from 'react';
import { ActionClassType } from '../ActionModalProps';

export function AddInstructor(props: {onAdd: (instructor: InstructorType) => {}}){
    const instructors = React.useContext(InstructorsContext);
    const [value, setValue] = React.useState<option.Option<number>>(option.none);
    const options = React.useMemo(() => instructors.map((a) => ({value: a.INSTRUCTOR_ID, display: (a.NAME_FIRST + " " + a.NAME_LAST)})), [instructors]);
    return <SelectInput controlledValue={value} updateValue={setValue} selectOptions={options} autoWidth/>
}

export function InstructorsList(props: ActionClassType){
    return <div className="flex flex-row">
        <div className="">

        </div>
        <div>

        </div>
    </div>
}