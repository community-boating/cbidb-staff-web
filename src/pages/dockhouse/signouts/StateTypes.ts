import { BoatTypesValidatorState, signoutsValidator, SignoutTablesState, signoutValidator, skipperValidator } from 'async/staff/dockhouse/signouts';
import { RatingsType, ratingsValidator } from "async/staff/dockhouse/ratings";
import { SelectOption } from 'components/wrapped/Input';

import * as t from "io-ts";
import { SortedRatings } from './RatingSorter';

export type ReassignedMapType = { [key: string]: { [key: number]: number[] } };

export type EditSignoutType = {
    currentSignout: SignoutTablesState
}

export type SignoutsTablesExtraState = {
	multiSignInSelected: number[]
	setUpdateCrewModal?: (signoutId: number) => void
	setUpdateCommentsModal?: (signoutId: number) => void
	setMultiSignInSelected?: (selected: number[]) => void
} & SignoutsTablesExtraStateDepOnMainState & SignoutsTablesExtraStateDepOnAsync
export type SignoutsTablesExtraStateDepOnMainState = {
	reassignedHullsMap: ReassignedMapType
	reassignedSailsMap: ReassignedMapType
	handleSingleSignIn?: (signoutId: number, isUndo: boolean) => void
	handleMultiSignIn?: (signoutsSelected: number[]) => Promise<any>
}
export type SignoutsTablesExtraStateDepOnAsync = {
	ratingsSorted: SortedRatings
	boatTypesHR: SelectOption<number>[]
} & AsyncPageState
export type AsyncPageState = {
	ratings: RatingsType,
	boatTypes: BoatTypesValidatorState
}