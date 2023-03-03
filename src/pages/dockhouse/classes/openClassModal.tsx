import { ApClassSession } from 'async/staff/dockhouse/ap-class-sessions';
import { ActionClass } from 'components/dockhouse/actionmodal/class/ActionClass';
import { ActionModalProps } from 'components/dockhouse/actionmodal/ActionModalProps';


export const openClassModal = (modal: ActionModalProps) => (s: ApClassSession) => {
    modal.pushAction(new ActionClass(s.sessionId));
};
