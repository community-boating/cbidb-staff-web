import { Card, CardLayout, LayoutDirection } from 'components/dockhouse/Card';
import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import { SignoutsTable } from 'pages/dockhouse/signouts/SignoutsTable';
import * as React from 'react';
import { RentalsType } from './RentalsType';

function RentalsSingoutsTable(props: RentalsType){
    return <SignoutsTable state={props.rentedSignouts} setState={() => {}} extraState={{} as any} filterValue={undefined} isActive={true} globalFilter={undefined}/>
}

export default function RentalsModal(props: RentalsType){
    var i = 0;
    return <DefaultModalBody>
        <ModalHeader>
            <span className="text-2xl font-bold">Rentals</span>
        </ModalHeader>
        <CardLayout direction={LayoutDirection.VERTICAL}>
            <Card title="Pending Rentals">
                <RentalsSingoutsTable {...props}/>
            </Card>
            <Card title="Active Rentals">

            </Card>
            <Card title="Completed Rentals">

            </Card>
        </CardLayout>
    </DefaultModalBody>
}