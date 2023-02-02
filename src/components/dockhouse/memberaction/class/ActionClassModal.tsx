import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { ClassTypesContext } from 'components/dockhouse/providers/ClassTypesProvider';
import { ModalHeader } from 'components/wrapped/Modal';
import { option } from 'fp-ts';
import { formatsById } from 'pages/dockhouse/classes/ClassesCalendar';
import * as React from 'react';
import { ActionClassType } from '../ActionModalProps';
import { CardNumberScanner } from '../CardNumberScanner';
import { AddInstructor, InstructorsList } from './AddEditInstructors';
import ClassRosterTable from './ClassRosterTable';
import ClassSignoutBoatList, { ClassActionsList } from './ClassSignoutBoatList';

export default function ActionClassModal(props: ActionClassType){
    const classTypes = React.useContext(ClassTypesContext);
    const formats = formatsById(classTypes);
    const [state, setState] = React.useState(props);
    const [selected, setSelected] = React.useState(option.none);
    return <div className="h-[calc(100vh-10vw)] w-[90vw] flex flex-col">
        <ModalHeader>
            <h2 className="font-bold text-2xl">
                Class {formats[state.currentClass.formatId].b.typeName} @ {state.currentSession.sessionDateTime.format()}
            </h2>
        </ModalHeader>
        <CardLayout direction={LayoutDirection.HORIZONTAL} className="min-h-0">
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <Card title="Add instructor" weight={FlexSize.S_1}>
                    <AddInstructor onAdd={undefined}/>
                </Card>
                <Card title="Instructors" weight={FlexSize.S_1}>
                    <InstructorsList {...state}/>
                </Card>
                <Card title="Class Roster (On Land)" weight={FlexSize.S_5}>
                    <ClassRosterTable {...state}/>
                </Card>
                <Card title="Add person" weight={FlexSize.S_1}>
                    <CardNumberScanner label="" onAction={(a) => {
                        console.log("adding");
                    }}></CardNumberScanner>
                </Card>
            </CardLayout>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <Card title="On the water">
                    <ClassSignoutBoatList {...state} selected={selected} setSelected={setSelected}/>
                </Card>
                <Card title="Actions" weight={FlexSize.S_0}>
                    <ClassActionsList signin={undefined} incident={undefined} cancel={undefined} new={undefined}/>
                </Card>
            </CardLayout>
        </CardLayout>
    </div>
}