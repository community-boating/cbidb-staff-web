import { RatingsType } from 'async/staff/dockhouse/ratings';
import { SignoutTablesState, TestType } from 'async/staff/dockhouse/signouts';
import { EditAction } from 'components/ActionBasedEditor';
import { option } from 'fp-ts';
import { none } from 'fp-ts/lib/Option';
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
        programId: programId
    }
}

export function adaptPerson(scannedPerson: Partial<SignoutCombinedType['currentPeople'][number]>): SignoutCombinedType['currentPeople'][number]{
    return {personId: -1,
        cardNumber: "",
        nameFirst: none,
        nameLast: none,
        bannerComment: option.none,
        specialNeeds: option.none,
        signoutBlockReason: option.none,
        personRatings: [],
        isSkipper: false,
        isTesting: false,
        testRatingId: option.none,
        maxBoatFlags: [],
        apClassSignupsToday: [],
        jpClassSignupsToday: [],
        activeMemberships: [defaultMembership(0)],
        ...scannedPerson}
        //sortOrder: 0, ...scannedPerson}
}

function convertPersonToTest(personId: number, testsByPersonId: {[key: number]: TestType}){
    return {
    isTesting: testsByPersonId[personId] != undefined,
    testRatingId: testsByPersonId[personId] != undefined ? option.some(testsByPersonId[personId].testId) : option.none
    }
}

export function adaptSignoutState(state: SignoutTablesState, ratings: RatingsType): EditSignoutState {
    const testsByPersonId: {[key: number]: TestType} = state.$$tests.reduce((a, b) => {
        a[b.personId] = b;
        return a;
    }, {})
    return {
        currentPeople: [adaptPerson({
            personId: state.$$skipper.personId,
            cardNumber: state.cardNum.getOrElse(undefined),
            nameFirst: state.$$skipper.nameFirst,
            nameLast: state.$$skipper.nameLast,
            bannerComment: state.comments,
            personRatings: state.$$skipper.$$personRatings.map((a) => ({ ...a, ratingName: (ratings.find((b) => b.ratingId == a.ratingId) || {ratingName: ""}).ratingName, status: "" })),
            isSkipper: true,
            ...convertPersonToTest(state.$$skipper.personId, testsByPersonId),
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
            ...convertPersonToTest(a.$$person.personId, testsByPersonId),
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
