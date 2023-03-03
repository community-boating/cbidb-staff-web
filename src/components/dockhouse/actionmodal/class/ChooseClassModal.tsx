import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import ClassesCalendar from 'pages/dockhouse/classes/ClassesCalendar';
import { openClassModal } from "pages/dockhouse/classes/openClassModal";
import * as React from 'react';
import { ActionModalContext } from '../ActionModal';

export default function ChooseClassModal(props){
    const modal = React.useContext(ActionModalContext)
    return <DefaultModalBody>
            <ModalHeader>Choose Class</ModalHeader>
            <ClassesCalendar handleSelectClass={openClassModal(modal)}/>
        </DefaultModalBody>
}