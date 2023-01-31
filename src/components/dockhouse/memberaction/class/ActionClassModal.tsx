import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { ClassTypesContext } from 'components/dockhouse/providers/ClassTypesProvider';
import { ModalHeader } from 'components/wrapped/Modal';
import { option } from 'fp-ts';
import { formatsById } from 'pages/dockhouse/classes/ClassesCalendar';
import * as React from 'react';
import { ActionClassType } from '../ActionModalProps';
import { CardNumberScanner } from '../CardNumberScanner';
import ClassRosterTable from './ClassRosterTable';
import ClassSignoutBoatList from './ClassSignoutBoatList';

export default function ActionClassModal(props: ActionClassType){
    const classTypes = React.useContext(ClassTypesContext);
    const formats = formatsById(classTypes);
    const [state, setState] = React.useState(props);
    const [selected, setSelected] = React.useState(option.none);
    return <div className="min-h-[calc(100vh-10vw)] min-w-[90vw] flex flex-col">
        <ModalHeader>
            <h2 className="font-bold text-2xl">
                Class {formats[state.currentClass.formatId].b.typeName} @ {state.currentSession.sessionDateTime.format()}
            </h2>
        </ModalHeader>
        <CardLayout direction={LayoutDirection.HORIZONTAL}>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <Card title="Class Roster (On Land)" weight={FlexSize.S_5}>
                    <ClassRosterTable {...state}/>
                </Card>
                <Card title="Add person" weight={FlexSize.S_1}>
                    <CardNumberScanner label="" onAction={(a) => {
                        console.log("adding");
                    }}></CardNumberScanner>
                </Card>
            </CardLayout>
            <Card title="On the water">
                <ClassSignoutBoatList {...state} selected={selected} setSelected={setSelected}/>
            </Card>
        </CardLayout>
    </div>
}