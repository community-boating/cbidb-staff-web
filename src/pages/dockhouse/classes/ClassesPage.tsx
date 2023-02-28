import { Card, CardLayout, LayoutDirection } from 'components/dockhouse/Card';
import * as React from 'react';
import ClassesCalendar from './ClassesCalendar';

export default function ClassesPage (props) {
    return <CardLayout direction={LayoutDirection.VERTICAL}>
        <Card title="More Classes">
            <ClassesCalendar/>
        </Card>
    </CardLayout>;
};