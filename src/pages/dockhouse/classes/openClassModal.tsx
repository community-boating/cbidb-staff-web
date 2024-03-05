import { ApClassSessionWithInstance } from 'models/typerefs';
import { ActionClass } from 'components/dockhouse/actionmodal/class/ActionClass';
import { ActionModalProps } from 'components/dockhouse/actionmodal/ActionModalProps';


export const openClassModal = (modal: ActionModalProps) => (s: ApClassSessionWithInstance) => {
    modal.pushAction(new ActionClass(s.sessionId));
};
