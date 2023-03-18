import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import ClassesCalendar from 'pages/dockhouse/classes/ClassesCalendar';
import { openClassModal } from "pages/dockhouse/classes/openClassModal";
import * as React from 'react';
import { ActionModalContext } from '../ActionModal';

export default function ChooseClassModal(props: {isDLV: boolean}){
    const modal = React.useContext(ActionModalContext)
    return !props.isDLV ? <DefaultModalBody>
            <ModalHeader>Choose Class</ModalHeader>
            <ClassesCalendar handleSelectClass={openClassModal(modal)} isDLV={false}/>
        </DefaultModalBody> : <ClassesCalendar handleSelectClass={openClassModal(modal)} isDLV={true}/>
}