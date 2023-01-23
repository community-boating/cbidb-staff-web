import { option } from 'fp-ts';


export type MemberActionState = {
    currentPeople: {
        cardNum: string
        isSkipper: boolean
        isTesting: boolean
        sortOrder: number
    }[]
    boatId: option.Option<number>
    boatNum: option.Option<string>
    hullNum: option.Option<string>
    sailNum: option.Option<string>
    signoutType: option.Option<string>
    testType: option.Option<string>
    testRating: option.Option<number>
}

export type EditSignoutState = MemberActionState & {}

export type ActionProps = {
    state: MemberActionState
    setState: React.Dispatch<React.SetStateAction<MemberActionState>>
}

export enum UpdateCrewType {
    ADD,
    REMOVE,
    ADD_TESTING,
    REMOVE_TESTING,
    SET_SKIPPER
}

export type EditCrewProps = {
    index: number
    cardNum: string
    updateCrew: (action: UpdateCrewType) => any
}

export type MemberActionProps = ActionProps & {mode: SignoutActionMode}

export enum SignoutActionMode {
    SIGNOUT, TESTING, CLASSES, RACING, RATINGS, COMMENTS
}
