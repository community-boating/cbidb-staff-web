import { Card, CardLayout, LayoutDirection } from 'components/dockhouse/Card';
import { ClassTypesContext } from 'components/dockhouse/providers/ClassTypesProvider';
import { ModalHeader } from 'components/wrapped/Modal';
import { formatsById } from 'pages/dockhouse/classes/ClassesCalendar';
import * as React from 'react';
import { ActionClassType } from '../ActionModalProps';
import ClassRosterTable from './ClassRosterTable';

export default function ActionClassModal(props: ActionClassType){
    const classTypes = React.useContext(ClassTypesContext);
    const formats = formatsById(classTypes);
    return <div className="min-h-[calc(100vh-10vw)] min-w-[90vw] flex flex-col">
        <ModalHeader>
            <h2 className="font-bold text-2xl">
                Class {formats[props.currentClass.formatId].b.typeName} @ {props.currentSession.sessionDateTime.format()}
            </h2>
        </ModalHeader>
        <CardLayout direction={LayoutDirection.HORIZONTAL}>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <Card title="Class Roster (On Land)">
                    <ClassRosterTable {...props}/>
                </Card>
                <Card title="Waitlist">

                </Card>
                <Card title="Add person">

                </Card>
            </CardLayout>
            <Card title="On the water">
            </Card>
        </CardLayout>
    </div>
}