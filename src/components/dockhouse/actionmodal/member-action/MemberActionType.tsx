import { ScannedPersonType } from 'async/staff/dockhouse/scan-card';
import { ActionProps, CurrentPeopleType, SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { option } from 'fp-ts';
import { EditAction } from 'components/ActionBasedEditor';
import { ProviderWithSetState } from 'async/providers/ProviderType';
import { ApClassSession } from 'async/staff/dockhouse/ap-class-sessions';
import { SignoutType } from 'async/staff/dockhouse/signouts';

export type AddEditCrewProps = {
    currentPeople: CurrentPeopleType
    mode: MemberActionMode
    add: (newCrew: SignoutCombinedType['currentPeople'][number]) => void
    remove: (index: number) => void
    setSkipper: (index: number) => void
    setTesting: (index: number, testing: boolean) => void
}

export enum MemberActionMode {
    SIGNOUT, TESTING, CLASSES, RACING, RATINGS, COMMENTS
}

export type MemberActionType = SignoutCombinedType & {
    currentClassSessionId: option.Option<number>
}

export type MemberActionModalStateType = {
    actions: EditAction<MemberActionType>[]
    mode: MemberActionMode
}

export const defaultMemberAction: (scannedPerson: ScannedPersonType, classes: ProviderWithSetState<ApClassSession[]>) => {signout: MemberActionType, mode: MemberActionMode} = (scannedPerson, classes) => ({signout: {
    currentPeople: [{ ...scannedPerson, isSkipper: true, isTesting: true, testRatingId: option.none}],
    boatId: option.none,
    boatNum: option.none,
    hullNum: option.none,
    sailNum: option.none,
    signoutType: option.none,
    testRating: option.none,
    signoutId: -1,
    currentClassSessionId: scannedPerson.apClassSignupsToday.length > 0 ? option.some(classes.state.find((a) => a.instanceId == scannedPerson.apClassSignupsToday[0].instanceId).sessionId) : option.none,
    mode: MemberActionMode.SIGNOUT
}, mode: scannedPerson.apClassSignupsToday.length > 0 ? MemberActionMode.CLASSES : MemberActionMode.SIGNOUT,})

export const defaultSignout: (scannedPerson: ScannedPersonType, classes: ProviderWithSetState<ApClassSession[]>) => MemberActionType = (scannedPerson, classes) => ({
    currentPeople: [{ ...scannedPerson, isSkipper: true, isTesting: true, testRatingId: option.none}],
    boatId: option.none,
    boatNum: option.none,
    hullNum: option.none,
    sailNum: option.none,
    signoutType: scannedPerson.apClassSignupsToday.length > 0 ? option.some(SignoutType.CLASS) : option.none,
    testRating: option.none,
    signoutId: -1,
    currentClassSessionId: scannedPerson.apClassSignupsToday.length > 0 ? option.some(classes.state.find((a) => a.instanceId == scannedPerson.apClassSignupsToday[0].instanceId).sessionId) : option.none,
    mode: MemberActionMode.SIGNOUT
})