import * as React from 'react';
import { CardLayout, Card, LayoutDirection, FlexSize, CardOrButton } from '../../../components/dockhouse/Card';
import ActionModal, { ActionModalContext } from '../../../components/dockhouse/memberaction/ActionModal';
import { Action, EditSignoutAction, MemberAction, NoneAction } from "../../../components/dockhouse/memberaction/ActionModalProps";
import { CardNumberScanner } from "../../../components/dockhouse/memberaction/CardNumberScanner";
import AsyncStateProvider, { ProviderState } from 'core/AsyncStateProvider';
import { getSignoutsToday } from 'async/staff/dockhouse/signouts';
import { filterActive, SignoutsTable } from '../signouts/SignoutsTable';
import { makeInitFilter } from '../signouts/input/SignoutsTableFilter';
import { SignoutsTablesExtraState, SignoutsTablesExtraStateDepOnAsync } from '../signouts/StateTypes';
import { makeBoatTypesHR, makeReassignedMaps } from '../signouts/SignoutsTablesPage';
import { sortRatings } from '../signouts/RatingSorter';
import * as t from "io-ts";
import { BoatsContext } from 'components/dockhouse/providers/BoatsProvider';
import { RatingsContext } from 'components/dockhouse/providers/RatingsProvider';

export default function DockHousePage (props) {
    const boatTypes = React.useContext(BoatsContext);
    const ratings = React.useContext(RatingsContext);
    const actionModal = React.useContext(ActionModalContext);
    const v = t.type({derp: t.boolean});
    const extraStateAsync: SignoutsTablesExtraStateDepOnAsync = React.useMemo(() => ({
        ratings: ratings,
        ratingsSorted: sortRatings(ratings),
        boatTypes: boatTypes,
        boatTypesHR: makeBoatTypesHR(boatTypes)
        }), [ratings, boatTypes]);
    return (<>
        <CardLayout direction={LayoutDirection.VERTICAL} parentDirection={LayoutDirection.VERTICAL}>
            <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <CardLayout direction={LayoutDirection.VERTICAL}>
                    <CardOrButton title="Member Actions" button={<div><input className="object-fill" type="image" src={""}/></div>}>
                        <CardNumberScanner label="Card Number:" onAction={(a) => {
                            actionModal.setAction(new MemberAction(a.cardNumber));
                        }}></CardNumberScanner>
                    </CardOrButton>
                    <Card title="Boat Queue"></Card>
                    <Card title="Rentals"></Card>
                </CardLayout>
                <CardLayout direction={LayoutDirection.VERTICAL} weight={FlexSize.S_2}>
                    <Card title="Dynamic Large View"></Card>
                </CardLayout>
                <CardLayout direction={LayoutDirection.VERTICAL}>
                    <Card title="Incidents"></Card>
                    <Card title="Schedule"></Card>
                    <Card title="Testing"></Card>
                </CardLayout>
            </CardLayout>
            <AsyncStateProvider apiWrapper={getSignoutsToday} initState={[]} makeChildren={(state, setState, providerState) => {
                const filteredSignouts = (state || []).filter(filterActive(true));
                const reassignedHullsMap = {};
                const reassignedSailsMap = {};
                makeReassignedMaps(filteredSignouts, reassignedHullsMap, reassignedSailsMap);
                const extraState: SignoutsTablesExtraState = {...extraStateAsync, multiSignInSelected: [], reassignedHullsMap, reassignedSailsMap} ;
                return <>
                    <Card title="Active Signouts">
                        {providerState == ProviderState.SUCCESS ? <SignoutsTable state={state} setState={setState} extraState={extraState} isActive={true} filterValue={makeInitFilter()} globalFilter={{} as any} openEditRow={(row) => {actionModal.setAction(new EditSignoutAction(row, ((row) => {return Promise.resolve();})))}}></SignoutsTable> : <>Loading...</>}
                    </Card>
                    <Card title="Completed Signouts">
                        {providerState == ProviderState.SUCCESS ? state.length : "Loading..."}
                    </Card>
                </>
            }}></AsyncStateProvider>
        </CardLayout>
     </>);
};