import { boatTypesValidator, ratingsValidator, signoutsValidator, signoutValidator } from 'async/rest/signouts-tables';
import { SelectOption } from 'components/wrapped/Input';

import * as t from "io-ts";
import { SortedRatings } from './RatingSorter';

export type SignoutTablesState = t.TypeOf<typeof signoutValidator>;
export type SignoutsTablesState = (SignoutTablesState[]);
export type SignoutsTablesStateRaw = t.TypeOf<typeof signoutsValidator>;
export type BoatTypesValidatorState = t.TypeOf<typeof boatTypesValidator>;
export type RatingsValidatorState = t.TypeOf<typeof ratingsValidator>;

export type BoatTypesType = t.TypeOf<typeof boatTypesValidator>;
export type RatingsType = t.TypeOf<typeof ratingsValidator>;

export type ReassignedMapType = { [key: string]: { [key: number]: number[] } };

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
	boatTypesHR: SelectOption[]
} & AsyncPageState
export type AsyncPageState = {
	ratings: RatingsValidatorState
	boatTypes: BoatTypesValidatorState
}