import * as React from 'react';
import { CardLayout, Card, LayoutDirection, FlexSize, CardProps } from '../../../components/dockhouse/Card';
import { ActionModalContext } from '../../../components/dockhouse/actionmodal/ActionModal';
import { defaultSignout, MemberAction } from "../../../components/dockhouse/actionmodal/member-action/MemberActionType";
import { CardNumberScanner } from "../../../components/dockhouse/actionmodal/CardNumberScanner";
import { ProviderState } from 'core/AsyncStateProvider';
import { SignoutType } from 'async/staff/dockhouse/signouts';
import { filterActive, SignoutsTable } from '../signouts/SignoutsTable';
import { makeInitFilter } from '../signouts/input/SignoutsTableFilter';
import { SignoutsTablesExtraState, SignoutsTablesExtraStateDepOnAsync } from '../signouts/StateTypes';
import { makeBoatTypesHR, makeReassignedMaps } from "../signouts/functions"; 
import { sortRatings } from '../../../components/dockhouse/actionmodal/signouts/RatingSorter';
import * as t from "io-ts";
import { BoatsContext } from 'async/providers/BoatsProvider';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { SignoutsTodayContext } from 'async/providers/SignoutsTodayProvider';
import { GoButton } from 'components/wrapped/IconButton';
import { TestType } from 'async/staff/dockhouse/tests';
import * as moment from 'moment';
import { EditTestsAction } from 'components/dockhouse/actionmodal/test/EditTestsType';
import { ActionChooseClass } from "components/dockhouse/actionmodal/class/ActionChooseClassType";
import { RentalsAction } from 'components/dockhouse/actionmodal/rentals/RentalsType';
import { BoatQueueAction } from 'components/dockhouse/actionmodal/boatqueue/BoatQueueType';
import { IncidentsContext } from 'async/providers/IncidentsProvider';
import { isAssigned, isPending } from '../incidents/IncidentsPage';
import { ActionViewIncidents } from 'components/dockhouse/actionmodal/view-incidents/ViewIncidentsType';
import CurrentTimeCalendar from '../classes/CurrentTimeView';

type CardOrButtonProps = CardProps & {
    //button: React.ReactNode;
    onAction: () => void
}

export function ActionCard(props: CardOrButtonProps){
    const {children,className,onAction, ...other} = props;
    return <div className="h-[33%]" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAction();
            }}>
            <Card {...other} className={"hidden lg:flex h-full w-full " + (className || "")}>
                <div className="flex flex-row grow-[1] min-h-0 w-full" >
                    <div className="flex flex-row gap-2 w-full">
                        {children}
                    </div>
                </div>
            </Card>
            <div className="lg:hidden basis-0 grow-[1]">MINI BUTTON</div>
    </div>
}

function NumberWithLabel(props: {number: number, label: React.ReactNode}){
    return <div className="flex flex-col leading-none">
        <h1 className={"text-4xl ml-auto mr-auto font-bold leading-none" + (props.number >= 5 ? " text-red-700" : "")}>{props.number}</h1>
        <h2>{props.label}</h2>
    </div>
}

function Spacer(){
    return <h1 className="text-4xl leading-none">|</h1>;
}

function PreventClick(props: {children?: React.ReactNode}){
    return <div onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
    }}>{props.children}</div>;
}

export default function DockHousePage (props) {
    const boatTypes = React.useContext(BoatsContext);
    const ratings = React.useContext(RatingsContext);
    const actionModal = React.useContext(ActionModalContext);
    const incidents = React.useContext(IncidentsContext);
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
    //const addNewIncident = ()
    makeReassignedMaps(filteredSignouts, reassignedHullsMap, reassignedSailsMap);
    const extraState: SignoutsTablesExtraState = {...extraStateAsync, reassignedHullsMap, reassignedSailsMap} ;
    return (<>
        <CardLayout direction={LayoutDirection.VERTICAL} parentDirection={LayoutDirection.VERTICAL}>
            <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <CardLayout direction={LayoutDirection.VERTICAL}>
                    <ActionCard title="Member Actions" onAction={doScanCard}>
                        <PreventClick>
                            <CardNumberScanner label="Card Number:" className="ml-0 mr-auto" autoFocus onAction={(a) => {
                                actionModal.pushAction(new MemberAction(defaultSignout(a)));
                            }} externalQueueTrigger={externalQueue}></CardNumberScanner>
                        </PreventClick>
                    </ActionCard>
                    <ActionCard title="Boat Queue" onAction={() => {
                        actionModal.pushAction(new BoatQueueAction(signoutsToday.signouts.filter((a) => true)))
                    }}>
                        <NumberWithLabel number={signoutsToday.signouts.length} label="Signouts"/>
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
                    }}>
                        <PreventClick>
                            <CurrentTimeCalendar />
                        </PreventClick>
                    </ActionCard>
                    <ActionCard title="Incidents" onAction={() => {
                        actionModal.pushAction(new ActionViewIncidents());
                    }}>
                        <div className="flex flex-row gap-2">
                            <NumberWithLabel number={incidents.state.filter((a) => isPending(a.status)).length} label="Pending"/>
                            <Spacer/>
                            <NumberWithLabel number={incidents.state.filter((a) => isAssigned(a.status)).length} label="Assigned"/>
                        </div>
                    </ActionCard>
                    <ActionCard title="Testing" onAction={() => {
                        const testingSignouts = signoutsToday.signouts.filter((a) => a.signoutType == SignoutType.TEST);
                        const testsToday: TestType[] = testingSignouts.flatMap((a) => [{signoutId: a.signoutId, personId: a.$$skipper.personId, nameFirst: a.$$skipper.nameFirst, nameLast: a.$$skipper.nameLast, testResult: a.testResult, createdBy: 0, createdOn: moment()}].concat(a.$$crew.map((b) => ({signoutId: a.signoutId, testResult: a.testResult, ...b.$$person, createdBy: 0, createdOn: moment()}))));
                        actionModal.pushAction(new EditTestsAction(testingSignouts, testsToday));
                    }}>
                        <div className="flex flex-row gap-2">
                            <NumberWithLabel number={0} label="Queue"/>
                            <Spacer/>
                            <NumberWithLabel number={signoutsToday.signouts.filter((a) => a.signoutType == SignoutType.TEST).length} label="Active"/>
                        </div>
                    </ActionCard>
                </CardLayout>
            </CardLayout>
            <Card title="Active Signouts">
                {signoutsToday.providerState == ProviderState.SUCCESS ? <SignoutsTable state={signoutsToday.signouts} setState={signoutsToday.setSignouts} extraState={extraState} isActive={true} filterValue={makeInitFilter()} globalFilter={{} as any}/> : <>Loading...</>}
            </Card>
            <Card title="Completed Signouts">
                {signoutsToday.providerState == ProviderState.SUCCESS ? <SignoutsTable state={signoutsToday.signouts} setState={signoutsToday.setSignouts} extraState={extraState} isActive={false} filterValue={makeInitFilter()} globalFilter={{} as any}/> : "Loading..."}
            </Card>
        </CardLayout>
     </>);
};