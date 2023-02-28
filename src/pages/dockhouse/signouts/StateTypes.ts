import { BoatTypesValidatorState, signoutsValidator, SignoutTablesState, signoutValidator, skipperValidator } from 'async/staff/dockhouse/signouts';
import { RatingsType, ratingsValidator } from "async/staff/dockhouse/ratings";
import { SelectOption } from 'components/wrapped/Input';

import * as t from "io-ts";
import { SortedRatings } from '../../../components/dockhouse/actionmodal/signouts/RatingSorter';

export type ReassignedMapType = { [key: string]: { [key: number]: number[] } };

export type EditSignoutType = {
    currentSignout: SignoutTablesState
}

export type SignoutsTablesExtraState = {
	setUpdateCrewModal?: (signoutId: number) => void
} & SignoutsTablesExtraStateDepOnMainState & SignoutsTablesExtraStateDepOnAsync
export type SignoutsTablesExtraStateDepOnMainState = {
	reassignedHullsMap: ReassignedMapType
	reassignedSailsMap: ReassignedMapType
	handleSingleSignIn?: (signoutId: number, isUndo: boolean) => void
}
export type SignoutsTablesExtraStateDepOnAsync = {
	ratingsSorted: SortedRatings
	boatTypesHR: SelectOption<number>[]
} & AsyncPageState
export type AsyncPageState = {
	ratings: RatingsType,
	boatTypes: BoatTypesValidatorState
}