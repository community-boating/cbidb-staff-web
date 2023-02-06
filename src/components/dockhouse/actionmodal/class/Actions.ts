import { ClassType, SignupType } from "async/staff/dockhouse/get-classes";
import { ScannedPersonType } from "async/staff/dockhouse/scan-card";
import { SignoutTablesState, SignoutType } from "async/staff/dockhouse/signouts";
import { EditAction, ActionActionType } from "components/ActionBasedEditor";
import { option } from "fp-ts";
import { ActionClassType, AttendanceMap } from "./ActionClassType";
import { SignoutCombinedType } from "../signouts/SignoutCombinedType";

export type AddActionType = Pick<ActionActionType<ActionClassType>, 'addAction'>;

export function addPersonAction(person: ScannedPersonType, time: moment.Moment): EditAction<ActionClassType>{
    return {
        applyAction: (data) => {
            return {...data, currentClass: {...data.currentClass, $$apClassSignups: data.currentClass.$$apClassSignups.concat({
                $$person: person,
                instanceId: data.currentClass.instanceId,
                signupId: -1,
                signupDatetime: time,
                signupType: SignupType.WAITLIST,
                personId: person.personId
            })}};
        }
    }
}

export function findLowestId(signouts: SignoutCombinedType[]){
    return signouts.reduce((a, b) => {
        return Math.min(b.signoutId, a);
    }, 0);
}

export function addSignoutAction(signout: Partial<SignoutCombinedType> & Pick<SignoutCombinedType, 'signoutId'>): EditAction<ActionClassType>{
    return {
        applyAction: (data) => {
            
            return {...data, associatedSignouts: data.associatedSignouts.concat({
                hullNum: option.none,
                sailNum: option.none,
                boatNum: option.none,
                boatId: option.none,
                signoutType: option.some(SignoutType.CLASS),
                testRating: option.none,
                currentPeople: [],
                ...signout
            })}
        }
    }
}

export function updateSignoutAction(signout: Partial<SignoutCombinedType>): EditAction<ActionClassType>{
    return {
        applyAction: (data) => {
            return {...data, associatedSignouts: data.associatedSignouts.map((a) => {
                if(a.signoutId == signout.signoutId){
                    return {...a, ...signout};
                }else{
                    return a;
                }
            })}
        }
    }
}

export class UpdateCrewAction { 
}

export class AddCrewAction extends UpdateCrewAction {
    person: ScannedPersonType
    constructor(person: ScannedPersonType){
        super();
        this.person = person;
    }
}

export class RemoveCrewAction extends UpdateCrewAction {
    personId: number
    constructor(personId: number){
        super();
        this.personId = personId;
    }
}



function makeSkipperIfNone(people: SignoutCombinedType['currentPeople']): SignoutCombinedType['currentPeople']{
    return people.some((a) => a.isSkipper) ? people : people.map((a, i) => (i > 0) ? a : {...a, isSkipper: true});
}

export function updateSignoutCrew(actions: UpdateCrewAction[], signoutId: number): EditAction<ActionClassType>{
    const toRemove = actions.reduce((a, b) => {
        if(b instanceof RemoveCrewAction){
            a[b.personId] = true;
        }
        return a;
    }, {} as {[key: number]: boolean});
    const toAdd = actions.filter((a) => a instanceof AddCrewAction).map((a: AddCrewAction) => ({...a.person, isSkipper: false, isTesting: false, testRatingId: option.none}));
    return {
        applyAction: (data) => {
            return {...data, associatedSignouts: data.associatedSignouts.map((a) => {
                if(a.signoutId == signoutId){
                    return {...a, currentPeople: makeSkipperIfNone(a.currentPeople.filter((a) => !toRemove[a.personId]).concat(toAdd))};
                }else{
                    return a;
                }
            })}
        }
    }
}

export function updateClassSignup (classSignup: Partial<ClassType['$$apClassSignups'][number]>): EditAction<ActionClassType>{
    return {
        applyAction: (data) => {
            return {...data, currentClass: {...data.currentClass, $$apClassSignups: data.currentClass.$$apClassSignups.map((a) => {
                if(a.signupId == classSignup.signupId)
                    return {...a, ...classSignup};
                else
                    return a;
            })}}
        }
    };
}

export function updateAttendanceList(attendanceList: AttendanceMap): EditAction<ActionClassType>{
    return {
        applyAction: (data) => {
            return {...data, attendanceMap: {...data.attendanceMap, ...attendanceList}};
        }
    };
}

export function updateClass(updatedClass: Partial<ClassType>): EditAction<ActionClassType>{
    return {
        applyAction: (data) => {
            console.log("applying");
            console.log(updatedClass);
            console.log(data.currentClass);
            console.log({...data.currentClass, ...updatedClass})
            return {...data, currentClass: {...data.currentClass, ...updatedClass}};
        }
    };
}

export function removeSignouts(signoutIds: number[]): EditAction<ActionClassType>{
    return {
        applyAction: (data) => {
            return {...data, associatedSignouts: data.associatedSignouts.filter((a) => !signoutIds.contains(a.signoutId))};
        }
    }
}