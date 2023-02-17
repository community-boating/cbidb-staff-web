import * as React from 'react';
import { CardLayout, Card, LayoutDirection, FlexSize, CardProps } from '../../../components/dockhouse/Card';
import { ActionModalContext } from '../../../components/dockhouse/actionmodal/ActionModal';
import { MemberAction } from "../../../components/dockhouse/actionmodal/member-action/MemberActionType";
import { CardNumberScanner } from "../../../components/dockhouse/actionmodal/CardNumberScanner";
import { ProviderState } from 'core/AsyncStateProvider';
import { SignoutType } from 'async/staff/dockhouse/signouts';
import { filterActive, SignoutsTable } from '../signouts/SignoutsTable';
import { makeInitFilter } from '../signouts/input/SignoutsTableFilter';
import { SignoutsTablesExtraState, SignoutsTablesExtraStateDepOnAsync } from '../signouts/StateTypes';
import { makeBoatTypesHR, makeReassignedMaps } from "../signouts/makeReassignedMaps"; 
import { sortRatings } from '../signouts/RatingSorter';
import * as t from "io-ts";
import { BoatsContext } from 'components/dockhouse/providers/BoatsProvider';
import { RatingsContext } from 'components/dockhouse/providers/RatingsProvider';
import { SignoutsTodayContext } from 'components/dockhouse/providers/SignoutsTodayProvider';
import { GoButton } from 'components/wrapped/IconButton';
import { TestType } from 'async/staff/dockhouse/tests';
import * as moment from 'moment';
import { EditTestsAction } from 'components/dockhouse/actionmodal/test/EditTestsType';
import { ActionChooseClass } from 'components/dockhouse/actionmodal/class/ActionClassType';
import { RentalsAction } from 'components/dockhouse/actionmodal/rentals/RentalsType';
import { BoatQueueAction } from 'components/dockhouse/actionmodal/boatqueue/BoatQueueType';
import { ActionCreateIncident, ActionEditIncident } from 'components/dockhouse/actionmodal/incident/IncidentModalType';

type CardOrButtonProps = CardProps & {
    //button: React.ReactNode;
    onAction: () => void
}

export function ActionCard(props: CardOrButtonProps){
    const {children,className,onAction, ...other} = props;
    return <>
        <Card {...other} className={"hidden lg:flex " + (className || "")}>
            <div className="flex flex-row gap-2 grow-[1]">
                {children}
                <GoButton className="mr-1 ml-auto mt-auto mb-1" onClick={(e) => {
                    onAction();
                }}></GoButton>
            </div>
        </Card>
        <div className="lg:hidden basis-0 grow-[1]">MINI BUTTON</div>
    </>
}

function NumberWithLabel(props: {number: number, label: React.ReactNode}){
    return <div className="flex flex-col leading-none">
        <h1 className="text-4xl ml-auto mr-auto font-bold leading-none">{props.number}</h1>
        <h2>{props.label}</h2>
    </div>
}

function Spacer(){
    return <h1 className="text-4xl leading-none">|</h1>;
}

export default function DockHousePage (props) {
    const boatTypes = React.useContext(BoatsContext);
    const ratings = React.useContext(RatingsContext);
    const actionModal = React.useContext(ActionModalContext);
    const v = t.type({derp: t.boolean});
    const signoutsToday = React.useContext(SignoutsTodayContext);
    const [externalQueue, setExternalQueue] = React.useState(0);
    const doScanCard = () => {
        setExternalQueue((s) => s+1);
    }
    const extraStateAsync: SignoutsTablesExtraStateDepOnAsync = React.useMemo(() => ({
        ratings: ratings,
        ratingsSorted: sortRatings(ratings),
        boatTypes: boatTypes,
        boatTypesHR: makeBoatTypesHR(boatTypes)
        }), [ratings, boatTypes]);
        const filteredSignouts = (signoutsToday.signouts || []).filter(filterActive(true));
        const reassignedHullsMap = {};
        const reassignedSailsMap = {};
        makeReassignedMaps(filteredSignouts, reassignedHullsMap, reassignedSailsMap);
        const extraState: SignoutsTablesExtraState = {...extraStateAsync, reassignedHullsMap, reassignedSailsMap} ;
    return (<>
        <CardLayout direction={LayoutDirection.VERTICAL} parentDirection={LayoutDirection.VERTICAL}>
            <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <CardLayout direction={LayoutDirection.VERTICAL}>
                    <ActionCard title="Member Actions" onAction={doScanCard}>
                        <CardNumberScanner label="Card Number:" className="ml-0 mr-auto" onAction={(a) => {
                            actionModal.pushAction(new MemberAction(a));
                        }} externalQueueTrigger={externalQueue}></CardNumberScanner>
                    </ActionCard>
                    <ActionCard title="Boat Queue" onAction={() => {
                        actionModal.pushAction(new BoatQueueAction(signoutsToday.signouts.filter((a) => true)))
                    }}>
                        <NumberWithLabel number={0} label="Signouts"/>
                    </ActionCard>
                    <ActionCard title="One Day Rentals" onAction={() => {
                        actionModal.pushAction(new RentalsAction(signoutsToday.signouts.filter((a) => true)))
                    }}>
                        <div className="flex flex-row gap-2 mt-0 mb-auto">
                            <NumberWithLabel number={0} label="Sail"/>
                            <Spacer/>
                            <NumberWithLabel number={1} label="Paddle"/>
                        </div>
                    </ActionCard>
                </CardLayout>
                <CardLayout direction={LayoutDirection.VERTICAL} weight={FlexSize.S_2}>
                    <Card title="Dynamic Large View"></Card>
                </CardLayout>
                <CardLayout direction={LayoutDirection.VERTICAL}>
                    <ActionCard title="Schedule" onAction={() => {
                        actionModal.pushAction(new ActionChooseClass());
                    }}></ActionCard>
                    <ActionCard title="Incidents" onAction={() => {
                        actionModal.pushAction(new ActionCreateIncident());
                    }}>
                        <div className="flex flex-row gap-2">
                            <NumberWithLabel number={0} label="Pending"/>
                            <Spacer/>
                            <NumberWithLabel number={3} label="Assigned"/>
                        </div>
                    </ActionCard>
                    <ActionCard title="testing" onAction={() => {
                        const testingSignouts = signoutsToday.signouts.filter((a) => a.signoutType == SignoutType.TEST);
                        const testsToday: TestType[] = testingSignouts.flatMap((a) => [{signoutId: a.signoutId, personId: a.$$skipper.personId, nameFirst: a.$$skipper.nameFirst, nameLast: a.$$skipper.nameLast, testResult: a.testResult, createdBy: 0, createdOn: moment()}].concat(a.$$crew.map((b) => ({signoutId: a.signoutId, testResult: a.testResult, ...b.$$person, createdBy: 0, createdOn: moment()}))));
                        actionModal.pushAction(new EditTestsAction(testingSignouts, testsToday));
                    }}>
                        <div className="flex flex-row gap-2">
                            <NumberWithLabel number={0} label="Queue"/>
                            <Spacer/>
                            <NumberWithLabel number={3} label="Active"/>
                        </div>
                    </ActionCard>
                </CardLayout>
            </CardLayout>
            <Card title="Active Signouts">
                {signoutsToday.providerState == ProviderState.SUCCESS ? <SignoutsTable state={signoutsToday.signouts.filter((a) => a.signinDatetime.isNone())} setState={signoutsToday.setSignouts} extraState={extraState} isActive={true} filterValue={makeInitFilter()} globalFilter={{} as any}/> : <>Loading...</>}
            </Card>
            <Card title="Completed Signouts">
                {signoutsToday.providerState == ProviderState.SUCCESS ? <SignoutsTable state={signoutsToday.signouts.filter((a) => a.signinDatetime.isSome())} setState={signoutsToday.setSignouts} extraState={extraState} isActive={true} filterValue={makeInitFilter()} globalFilter={{} as any}/> : "Loading..."}
            </Card>
        </CardLayout>
     </>);
};