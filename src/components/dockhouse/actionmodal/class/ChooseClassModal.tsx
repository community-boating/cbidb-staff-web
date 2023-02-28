import { DefaultModalBody, ModalHeader } from 'components/wrapped/Modal';
import ClassesCalendar from 'pages/dockhouse/classes/ClassesCalendar';
import * as React from 'react';

export default function ChooseClassModal(props){
    return <DefaultModalBody>
            <ModalHeader>Choose Class</ModalHeader>
            <ClassesCalendar/>
        </DefaultModalBody>
}