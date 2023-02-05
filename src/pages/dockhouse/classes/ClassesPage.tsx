import { AppStateContext } from 'app/state/AppStateContext';
import { getWrapper } from 'async/staff/dockhouse/get-classes';
import { SignoutType } from 'async/staff/dockhouse/signouts';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { ActionModalContext, adaptSignoutState } from 'components/dockhouse/memberaction/ActionModal';
import { ActionClass } from "components/dockhouse/memberaction/class/ActionClassType";
import { ClassesContext } from 'components/dockhouse/providers/ClassesProvider';
import { RatingsContext } from 'components/dockhouse/providers/RatingsProvider';
import { SignoutsTodayContext } from 'components/dockhouse/providers/SignoutsTodayProvider';
import { option } from 'fp-ts';
import * as React from 'react';
import ClassesCalendar from './ClassesCalendar';
import ClassSelector from './ClassSelector';

export default function ClassesPage (props) {
    const modal = React.useContext(ActionModalContext);
    const classes = React.useContext(ClassesContext);
    const signoutsToday = React.useContext(SignoutsTodayContext);
    const [classSession, setClassSession] = React.useState(option.none as option.None<number>);
    const ratings = React.useContext(RatingsContext);
    const openModal = (s) => {
        classes.every((a) => {
            return a.$$apClassSessions.every((b) => {
                if(b.sessionId == s.getOrElse(undefined)){
                    const allPersons = a.$$apClassSignups.reduce((a, b) => {
                        a[b.personId] = true;
                        return a;
                    }, {})
                    modal.setAction(new ActionClass(a, b, signoutsToday.signouts.filter((a) => a.signoutType == SignoutType.CLASS).map((a) => adaptSignoutState(a, ratings)).filter((a) => a.currentPeople.some((b) => allPersons[b.personId])), []));
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