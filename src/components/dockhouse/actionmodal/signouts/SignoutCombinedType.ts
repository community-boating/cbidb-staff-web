import { ScannedCrewType } from 'models/typerefs';
import { SignoutType } from 'async/staff/dockhouse/signouts';
import { option } from 'fp-ts';

export type CurrentPeopleType = (ScannedCrewType[number] & {isSkipper: boolean, isTesting: boolean, testRatingId: option.Option<number>})[];

export type SignoutCombinedType = {
    currentPeople: CurrentPeopleType
    boatId: option.Option<number>
    boatNum: option.Option<string>
    hullNum: option.Option<string>
    sailNum: option.Option<string>
    signoutType: option.Option<SignoutType>
    testRating: option.Option<number>
    signoutId: number
}

export type EditSignoutState = SignoutCombinedType & {}

export type ActionProps = {
    state: SignoutCombinedType
    setState: React.Dispatch<React.SetStateAction<SignoutCombinedType>>
}