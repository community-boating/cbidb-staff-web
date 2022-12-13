import { Tab } from '@headlessui/react';
import Modal from 'components/wrapped/Modal';
import * as React from 'react';

import * as t from "io-ts";

import hold from 'assets/img/icons/hold.svg';
import comments from 'assets/img/icons/comments.svg';
import person from 'assets/img/icons/person.svg';
import { crewValidator, skipperValidator } from 'async/rest/DockHouseModels';
import { option } from 'fp-ts';
import { programsHR } from '../signouts/Constants';
import Button from 'components/wrapped/Button';
import { Input } from 'components/wrapped/Input';

import swap from 'assets/img/icons/buttons/swap.svg';
import x from 'assets/img/icons/buttons/x.svg';
import IconButton from 'components/wrapped/IconButton';

type SkipperType = t.TypeOf<typeof skipperValidator>;

type SkipperInfoProps = {
    skipper: SkipperType;
};

type CrewType = t.TypeOf<typeof crewValidator>;

type CrewProps = {
    crew: CrewType;
};

function getProgramHR(programId: number){
    return ((programsHR.filter((a) => a.value == programId)[0]) || {display: "Invalid Program"}).display;
}

function SkipperInfo(props: SkipperInfoProps){
    const currentMembership = props.skipper.$$memberships[0];
    const programHR = getProgramHR(currentMembership.programId);
    return <div className="flex flex-row grow-0 gap-5">
        <div className="flex flex-col">
            <h3 className="font-bold">Skipper:</h3>
            <div className="flex flex-row">
                {props.skipper.comments.isSome() ? <img src={hold} width={50}/> : <></>}
                {props.skipper.hold ? <img src={comments} width={50}/> : <></>}
            </div>
            <h3 className="text-2xl font-bold">{props.skipper.nameFirst} {props.skipper.nameLast}</h3>
            <h3 className="text-xl">{programHR}</h3>
            <h3 className="text-xl">{currentMembership.type}</h3>
            <h3 className="text-xl">{currentMembership.endDate}</h3>
            <h3 className="text-xl">Guest Privileges: {currentMembership.guestPrivileges ? "Yes" : "No"}</h3>
        </div>
        <div className="flex flex-col">
            <img src={person} className="mt-auto mb-0"></img>
        </div>
    </div>
}

function Crew(props: CrewProps){
    return <div className="flex flex-row grow-[2] gap-5">
        <div className="flex flex-col grow-0 gap-2">
            <h3 className="font-bold">Crew:</h3>
            <div className="flex flex-row gap-2">
                <Button className="bg-gray-200 p-card">Search Phone</Button>
                <Button className="bg-gray-200 p-card">Search Name</Button>
            </div>
            <h3>Add by card #...</h3>
            <Input></Input>
            <Button className="bg-gray-200 p-card">Find Highest Ratings</Button>
            <Button className="bg-gray-200 p-card">Find Highest Privileges</Button>
        </div>
        <div className="grid grid-rows-2 grid-flow-col grow-[1]">
            {props.crew.map((a, i) => <div key={i} className="flex flex-row">
                <div className="w-[1em]">
                    <IconButton src={x}/>
                    <IconButton src={swap}/>
                </div>
                <div>
                    <h3 className="font-medium">{a.nameFirst} {a.nameLast}</h3>
                    <h3 className="font-light">{getProgramHR(1)}</h3>
                    </div>
                </div>
                )}
        </div>
    </div>
}

const testSkipper = {
    $$personRatings: undefined,
    nameFirst: "Evan",
    nameLast: "McCarter",
    personId: 100, $$memberships:[{
            activeDate: "1992",
            endDate: "12/20/2022",
            type:"Full Year",
            programId: 1,
            guestPrivileges: true}],
    comments: option.some("Comment Here"),
    hold: true
};

const b = {
    $$personRatings: undefined,
    nameFirst: "Joon",
    nameLast: "Coal",
    personId: 100,
    $$memberships: [],
    comments: option.none,
    hold: false
}

const c = {
    $$personRatings: undefined,
    nameFirst: "Pawl",
    nameLast: "Gammind",
    personId: 100,
    $$memberships: [],
    comments: option.none,
    hold: false
}

const d = {
    $$personRatings: undefined,
    nameFirst: "Samp",
    nameLast: "Peersin",
    personId: 100,
    $$memberships: [],
    comments: option.none,
    hold: false
}

const testCrew = [testSkipper, b, c, d]


const memberActionTypes = [{
    title: "Sign Out",
    getContent: () => (
    <div className="flex flex-col h-full grow-[1] gap-5">
        <div className="flex flex-row grow-[0] gap-5">
            <SkipperInfo skipper={testSkipper}></SkipperInfo>
            <Crew crew={testCrew}></Crew>
        </div>
        <div className="flex flex-row grow-[1]">
            <div className="bg-card w-full"><p>Dialog Output</p></div>
        </div>
        <div className="flex flex-row grow-[3]">
            <div className="w-full"><p>Boat Type</p></div>
        </div>
    </div>)
},
{
    title: "Testing",
    getContent: () => (<div>Two</div>)
},
{
    title: "Ratings",
    getContent: () => (<div>Other</div>)
},
{
    title: "Instruction",
    getContent: () => (<div>Other</div>)
},
{
    title: "Comments",
    getContent: () => (<div>Other</div>)
}]

export type MemberActionModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MemberActionModal(props: MemberActionModalProps){
    const header = (
        <Tab.List className="flex flex-row gap-primary">
            <h1 className="text-2xl font-bold">Member Actions:</h1>
            {memberActionTypes.map((a, i) => <Tab key={i} as={React.Fragment}>
                
                {({selected}) => (
                    
                    <div className="flex flex-row gap-primary">
                        {(i > 0 ? <h1 className="text-2xl">|</h1> : "")}
                        <h1 className={"text-2xl inline" + (selected ? " text-blue-500" : "")}>{a.title}</h1>
                    </div>
)}
            </Tab>)
            }
        </Tab.List>);
    return (
    <Tab.Group>
        <Modal title={header} {...props} open={true} className="bg-gray-100 rounded-lg">
            <hr className="border-t-1 border-black"/>
            <Tab.Panels className="h-[80vh] w-[80vw] flex flex-col">
                {memberActionTypes.map((a, i) => <Tab.Panel className="grow-[1]" key={i}>{a.getContent()}</Tab.Panel>)}
            </Tab.Panels>
        </Modal>
    </Tab.Group>);
}