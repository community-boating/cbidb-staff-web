import { ScannedCrewType } from 'async/staff/dockhouse/scan-card';
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


export type AddEditCrewProps = {
    currentPeople: CurrentPeopleType
    mode: SignoutActionMode
    add: (newCrew: SignoutCombinedType['currentPeople'][number]) => void
    remove: (index: number) => void
    setSkipper: (index: number) => void
    setTesting: (index: number, testing: boolean) => void
}

export type MemberActionProps = ActionProps & {mode: SignoutActionMode}

export enum SignoutActionMode {
    SIGNOUT, TESTING, CLASSES, RACING, RATINGS, COMMENTS
}
