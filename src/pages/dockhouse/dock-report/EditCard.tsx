import { Card } from 'components/dockhouse/Card';
import * as React from 'react';
import { Edit } from 'react-feather';

export type EditCardProps = {
    children?: React.ReactNode;
    title: React.ReactNode;
    openModal: (node: React.ReactNode) => void;
    editModal: React.ReactNode;
}

export default function EditCard(props: EditCardProps){
    return (<div className="grow-[1] bg-card p-card">
         <div className="flex flex-row"><h4>{props.title}</h4><Edit height="18px" className="ml-auto mr-0" style={{ cursor: "pointer" }} onClick={() => props.openModal(props.editModal)} /></div>
        <div>
            {props.children}
        </div>
    </div>);
}