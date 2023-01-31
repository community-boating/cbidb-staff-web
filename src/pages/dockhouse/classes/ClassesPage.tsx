import { AppStateContext } from 'app/state/AppStateContext';
import { getWrapper } from 'async/staff/dockhouse/get-classes';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { ActionModalContext } from 'components/dockhouse/memberaction/ActionModal';
import { ActionClass } from 'components/dockhouse/memberaction/ActionModalProps';
import { ClassesContext } from 'components/dockhouse/providers/ClassesProvider';
import { option } from 'fp-ts';
import * as React from 'react';
import ClassesCalendar from './ClassesCalendar';
import ClassSelector from './ClassSelector';

export default function ClassesPage (props) {
    const modal = React.useContext(ActionModalContext);
    const classes = React.useContext(ClassesContext);
    const [classSession, setClassSession] = React.useState(option.none as option.None<number>);
    const openModal = (s) => {
        classes.every((a) => {
            return a.$$apClassSessions.every((b) => {
                if(b.sessionId == s.getOrElse(undefined)){
                    console.log("doing it");
                    modal.setAction(new ActionClass(a, b));
                    return false;
                }
                return true;
            });
        })
        setClassSession(s);
    }
    return <CardLayout direction={LayoutDirection.VERTICAL}>
        <Card title="Select Class" weight={FlexSize.S_0}>
            <ClassSelector classSession={classSession} setClassSession={openModal}></ClassSelector>
        </Card>
        <Card title="More Classes">
            <ClassesCalendar classSession={classSession} setClassSession={openModal}></ClassesCalendar>
        </Card>
    </CardLayout>;
};