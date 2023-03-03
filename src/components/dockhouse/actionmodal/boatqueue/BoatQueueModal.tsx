import { Card, CardLayout, LayoutDirection } from 'components/dockhouse/Card';
import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import { SignoutsTable } from 'pages/dockhouse/signouts/SignoutsTable';
import * as React from 'react';
import { BoatQueueType } from './BoatQueueType';

function BoatQueueSignoutsTable(props: BoatQueueType){
    return <SignoutsTable state={props.boatQueueSignouts} setState={() => {}} extraState={{} as any} filterValue={undefined} isActive={true} globalFilter={undefined}/>
}

export default function BoatQueueModal(props: BoatQueueType){
    var i = 0;
    return <DefaultModalBody>
        <ModalHeader>
            <span className="text-2xl font-bold">Boat Queue</span>
        </ModalHeader>
        <CardLayout direction={LayoutDirection.VERTICAL}>
            <Card title="Queued Boats">
                <BoatQueueSignoutsTable {...props}/>
            </Card>
            <Card title="Active Rentals">

            </Card>
            <Card title="Completed Rentals">

            </Card>
        </CardLayout>
    </DefaultModalBody>
}