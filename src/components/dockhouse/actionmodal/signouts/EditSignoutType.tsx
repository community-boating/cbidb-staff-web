import { RatingsType } from 'async/staff/dockhouse/ratings';
import { ScannedPersonType } from 'async/staff/dockhouse/scan-card';
import { SignoutTablesState, SignoutType } from 'async/staff/dockhouse/signouts';
import { EditAction } from 'components/ActionBasedEditor';
import { option } from 'fp-ts';
import * as moment from 'moment';
import { EditSignoutState, SignoutCombinedType } from './SignoutCombinedType';

export type EditSignoutActionModalState = {
    actions: EditAction<SignoutCombinedType>[]
}

export function defaultMembership(programId: number){
    return {
        assignId: 0,
        membershipTypeId: 0,
        startDate: option.some(moment()),
        expirationDate: option.none,
        discountName: option.none,
        isDiscountFrozen: false,
        hasGuestPrivs: true,
        programId: option.some(programId)
    }
}

export function adaptPerson(scannedPerson: Partial<SignoutCombinedType['currentPeople'][number]>): SignoutCombinedType['currentPeople'][number]{
    return {personId: -1,
        cardNumber: "",
        nameFirst: "",
        nameLast: "",
        bannerComment: option.none,
        specialNeeds: option.none,
        personRatings: [],
        isSkipper: false,
        isTesting: false,
        testRatingId: option.none,
        maxFlagsPerBoat: [],
        apClassSignupsToday: [],
        activeMemberships: [defaultMembership(0)],
        ...scannedPerson}
        //sortOrder: 0, ...scannedPerson}
}

export function adaptSignoutState(state: SignoutTablesState, ratings: RatingsType): EditSignoutState {
    return {
        currentPeople: [adaptPerson({
            personId: state.$$skipper.personId,
            cardNumber: state.cardNum.getOrElse(undefined),
            nameFirst: state.$$skipper.nameFirst,
            nameLast: state.$$skipper.nameLast,
            bannerComment: state.comments,
            personRatings: state.$$skipper.$$personRatings.map((a) => ({ ...a, ratingName: (ratings.find((b) => b.ratingId == a.ratingId) || {ratingName: ""}).ratingName, status: "" })),
            isSkipper: true,
            isTesting: state.signoutType == SignoutType.TEST,
            testRatingId: state.testRatingId,
            activeMemberships: [defaultMembership(state.programId)],
            //sortOrder: 0
        })].concat((state.$$crew.map((a, i) => (adaptPerson({
            personId: a.$$person.personId,
            cardNumber: a.cardNum.getOrElse(undefined),
            nameFirst: a.$$person.nameFirst,
            nameLast: a.$$person.nameLast,
            bannerComment: option.none,
            specialNeeds: option.none,
            isSkipper: false,
            isTesting: state.signoutType == SignoutType.TEST,
            testRatingId: state.testRatingId,
            activeMemberships: [defaultMembership(state.programId)],
            //sortOrder: 1 + i
        }))))),
        boatId: option.some(state.boatId),
        signoutType: option.some(state.signoutType),
        boatNum: option.none,
        hullNum: state.hullNumber,
        sailNum: state.sailNumber,
        testRating: state.testRatingId,
        signoutId: state.signoutId
    };
}
