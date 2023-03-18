import { IncidentsContext } from 'async/providers/IncidentsProvider';
import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import IncidentsPage from 'pages/dockhouse/incidents/IncidentsPage';
import * as React from 'react';
import { ViewIncidentsType } from './ViewIncidentsType';

export default function ViewIncidentsModal(props: ViewIncidentsType & {isDLV: boolean}){
    const incidents = React.useContext(IncidentsContext);
    return !props.isDLV ? <DefaultModalBody>
        <ModalHeader>
            <span className="text-2xl font-bold">New Incident:</span>
        </ModalHeader>
        <IncidentsPage {...props}/>
    </DefaultModalBody> : <IncidentsPage {...props}/>
}