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
    dialogOutput: option.Option<string>
}

export type EditSignoutState = MemberActionState & {}

export type ActionProps = {
    state: MemberActionState
    setState: React.Dispatch<React.SetStateAction<MemberActionState>>
}


export type AddEditCrewProps = MemberActionProps & {
    add: (newCrew: MemberActionState['currentPeople'][number]) => void
    remove: (index: number) => void
    setSkipper: (index: number) => void
    setTesting: (index: number, testing: boolean) => void
}

export type MemberActionProps = ActionProps & {mode: SignoutActionMode}

export enum SignoutActionMode {
    SIGNOUT, TESTING, CLASSES, RACING, RATINGS, COMMENTS
}
