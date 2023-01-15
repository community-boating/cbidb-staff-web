import * as React from 'react';
import { CardLayout, Card, LayoutDirection, FlexSize, CardOrButton } from '../../../components/dockhouse/Card';
import { CustomInput as Input } from 'components/wrapped/Input';
import { GoButton } from 'components/wrapped/IconButton';
import MemberActionModal from '../memberaction/MemberActionModal';
import AsyncStateProvider, { ProviderState } from 'core/AsyncStateProvider';
import { getSignoutsToday } from 'async/staff/dockhouse/signouts-tables';
import { filterActive, SignoutsTable } from '../signouts/SignoutsTable';
import { makeInitFilter } from '../signouts/input/SignoutsTableFilter';
import { SignoutsTablesExtraState, SignoutsTablesExtraStateDepOnAsync } from '../signouts/StateTypes';
import { makeBoatTypesHR, makeReassignedMaps } from '../signouts/SignoutsTablesPage';
import { sortRatings } from '../signouts/RatingSorter';
import Form from 'components/wrapped/Form';
import * as t from "io-ts";
import Button from 'components/wrapped/Button';
import { AppStateContext } from 'app/state/AppStateContext';

export default function DockHousePage (props) {
    const [inputState, setInputState] = React.useState("");
    const asc = React.useContext(AppStateContext);
    const [open, setOpen] = React.useState(false);
    const v = t.type({derp: t.boolean});
    const extraStateAsync: SignoutsTablesExtraStateDepOnAsync = React.useMemo(() => ({
        ratings: asc.state.ratings,
        ratingsSorted: sortRatings(asc.state.ratings),
        boatTypes: asc.state.boatTypes,
        boatTypesHR: makeBoatTypesHR(asc.state.boatTypes)
        }), [asc.state.ratings, asc.state.boatTypes]);
    return (<>
     <CardLayout direction={LayoutDirection.VERTICAL} parentDirection={LayoutDirection.VERTICAL}>
        <CardLayout direction={LayoutDirection.HORIZONTAL}>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <CardOrButton title="Member Actions" button={<div><input className="object-fill" type="image" src={""}/></div>}>
                    <Input label={"Card Number:"} end={<GoButton onClick={() => {setOpen(true);}}/>} isEnd={true} groupClassName="mt-auto" value={inputState} onChange={(e) => {setInputState(e.target.value)}} onEnter={() => {setOpen(true);}}/>
                </CardOrButton>
                <Card title="One Day Rentals"></Card>
                <Card title="Testing"></Card>
            </CardLayout>
            <CardLayout direction={LayoutDirection.VERTICAL} weight={FlexSize.S_2}>
                <Card title="Dynamic Large View"></Card>
            </CardLayout>
            <CardLayout direction={LayoutDirection.VERTICAL}>
                <Card title="Incidents"></Card>
                <Card title="UAP Schedule"></Card>
                <Card title="Forms"></Card>
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
                    <SignoutsTable state={state} setState={setState} extraState={extraState} isActive={true} filterValue={makeInitFilter()} globalFilter={{} as any}></SignoutsTable>
                </Card>
                <Card title="Completed Signouts">
                    {providerState == ProviderState.SUCCESS ? state.length : "Loading..."}
                </Card>
            </>
        }}></AsyncStateProvider>
     </CardLayout>
     <MemberActionModal open={open} setOpen={setOpen}/>
     </>);
};