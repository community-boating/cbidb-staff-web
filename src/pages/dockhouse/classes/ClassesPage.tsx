import { ActionModalContext } from 'components/dockhouse/actionmodal/ActionModal';
import { Card, CardLayout, LayoutDirection } from 'components/dockhouse/Card';
import * as React from 'react';
import ClassesCalendar from './ClassesCalendar';
import { openClassModal } from "./openClassModal";

export default function ClassesPage (props) {
    const modal = React.useContext(ActionModalContext);
    return <CardLayout direction={LayoutDirection.VERTICAL}>
        <Card title="More Classes">
            <ClassesCalendar handleSelectClass={openClassModal(modal)} isDLV={false}/>
        </Card>
    </CardLayout>;
};