import * as React from 'react';
import { CardLayout, Card, LayoutDirection, FlexSize, CardProps } from '../../../components/dockhouse/Card';
import ActionModal, { ActionModalContext } from '../../../components/dockhouse/memberaction/ActionModal';
import { Action, NoneAction } from "../../../components/dockhouse/memberaction/ActionModalProps";
import { EditSignoutAction, MemberAction } from "../../../components/dockhouse/memberaction/MemberActionType";
import { CardNumberScanner } from "../../../components/dockhouse/memberaction/CardNumberScanner";
import AsyncStateProvider, { ProviderState } from 'core/AsyncStateProvider';
import { getSignoutsToday } from 'async/staff/dockhouse/signouts';
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

type CardOrButtonProps = CardProps & {
    //button: React.ReactNode;
    onAction: () => void
}

export function ActionCard(props: CardOrButtonProps){
    const {children,className,onAction, ...other} = props;
    return <>
        <Card {...other} className={"hidden lg:flex " + (className || "")}>
            <div className="flex flex-row gap-2 mt-auto mb-0">
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
        const extraState: SignoutsTablesExtraState = {...extraStateAsync, multiSignInSelected: [], reassignedHullsMap, reassignedSailsMap} ;
    return (<>
        <CardLayout direction={LayoutDirection.VERTICAL} parentDirection={LayoutDirection.VERTICAL}>
            <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <CardLayout direction={LayoutDirection.VERTICAL}>
                    <ActionCard title="Member Actions" onAction={doScanCard}>
                        <CardNumberScanner label="Card Number:" className="mr-0 ml-auto" onAction={(a) => {
                            actionModal.setAction(new MemberAction(a));
                        }} externalQueueTrigger={externalQueue}></CardNumberScanner>
                    </ActionCard>
                    <ActionCard title="Boat Queue" onAction={undefined}>
                        <NumberWithLabel number={0} label="Signouts"/>
                    </ActionCard>
                    <ActionCard title="One Day Rentals" onAction={undefined}>
                        <div className="flex flex-row gap-2">
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
                    <Card title="Incidents">
                        <div className="flex flex-row gap-2">
                            <NumberWithLabel number={0} label="Pending"/>
                            <Spacer/>
                            <NumberWithLabel number={3} label="Assigned"/>
                        </div>
                    </Card>
                    <ActionCard title="Schedule" onAction={undefined}></ActionCard>
                    <ActionCard title="testing" onAction={undefined}>
                        <div className="flex flex-row gap-2">
                            <NumberWithLabel number={0} label="Queue"/>
                            <Spacer/>
                            <NumberWithLabel number={3} label="Active"/>
                        </div>
                    </ActionCard>
                </CardLayout>
            </CardLayout>
            <Card title="Active Signouts">
                {signoutsToday.providerState == ProviderState.SUCCESS ? <SignoutsTable state={signoutsToday.signouts} setState={signoutsToday.setSignouts} extraState={extraState} isActive={true} filterValue={makeInitFilter()} globalFilter={{} as any} openEditRow={(row) => {actionModal.setAction(new EditSignoutAction(row))}}></SignoutsTable> : <>Loading...</>}
            </Card>
            <Card title="Completed Signouts">
                {signoutsToday.providerState == ProviderState.SUCCESS ? signoutsToday.signouts.length : "Loading..."}
            </Card>
        </CardLayout>
     </>);
};