import { Tab } from '@headlessui/react';
import Modal from 'components/wrapped/Modal';
import * as React from 'react';

const memberActionTypes = [{
    title: "One",
    getContent: () => (<div>One</div>)
},
{
    title: "Two",
    getContent: () => (<div>Two</div>)
},
{
    title: "Other",
    getContent: () => (<div>Other</div>)
}]

export type MemberActionModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MemberActionModal(props: MemberActionModalProps){
    const header = (
        <Tab.List>
            {memberActionTypes.map((a, i) => <Tab key={i}>{a.title}</Tab>)}
        </Tab.List>);
    return (
    <Tab.Group>
        <Modal title={header} {...props} className="bg-gray-100 h-[80vh] w-[80vw]">
            <Tab.Panels>
                {memberActionTypes.map((a, i) => <Tab.Panel key={i}>{a.getContent()}</Tab.Panel>)}
            </Tab.Panels>
        </Modal>
    </Tab.Group>);
}