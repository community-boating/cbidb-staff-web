import { AppStateContext } from 'app/state/AppStateContext';
import { getWrapper } from 'async/staff/dockhouse/get-classes';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { option } from 'fp-ts';
import * as React from 'react';
import ClassesCalendar from './ClassesCalendar';
import ClassSelector from './ClassSelector';

export default function ClassesPage (props) {
    return <CardLayout direction={LayoutDirection.VERTICAL}>
        <Card title="Select Class" weight={FlexSize.S_0}>
            <ClassSelector></ClassSelector>
        </Card>
        <Card title="More Classes">
            <ClassesCalendar></ClassesCalendar>
        </Card>
    </CardLayout>;
};