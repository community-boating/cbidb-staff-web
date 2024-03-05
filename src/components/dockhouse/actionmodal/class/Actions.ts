import { ScannedPersonType } from 'models/typerefs';
import { SignoutType } from "async/staff/dockhouse/signouts";
import { EditAction, ActionActionType } from "components/ActionBasedEditor";
import { option } from "fp-ts";
import { SignoutCombinedType } from "../signouts/SignoutCombinedType";
import { ApClassSessionWithInstance, ApClassSignup } from 'models/typerefs';
import { ActionClassType } from "./ActionClassType";

export type AddActionType = Pick<ActionActionType<ActionClassType>, 'addAction'>;

export function findLowestId(signouts: {signoutId: number}[]){
    return signouts.reduce((a, b) => {
        return Math.min(b.signoutId, a);
    }, 0);
}

export class AddSignoutAction extends EditAction<ActionClassType>{
    signout: Partial<SignoutCombinedType> & Pick<SignoutCombinedType, 'signoutId'>
    constructor (signout: Partial<SignoutCombinedType> & Pick<SignoutCombinedType, 'signoutId'>){
        super();
        this.signout = signout;
    }
    applyActionLocal(data) {
        return {...data, associatedSignouts: data.associatedSignouts.concat({
            hullNum: option.none,
            sailNum: option.none,
            boatNum: option.none,
            boatId: option.none,
            signoutType: option.some(SignoutType.CLASS),
            testRating: option.none,
            currentPeople: [],
            ...this.signout
        })}
    }
}

export class UpdateSignoutAction extends EditAction<ActionClassType>{
    signout: Partial<SignoutCombinedType>;
    constructor (signout: Partial<SignoutCombinedType>){
        super();
        this.signout = signout;
    }
    applyActionLocal(data) {
        return {...data, associatedSignouts: data.associatedSignouts.map((a) => {
            if(a.signoutId == this.signout.signoutId){
                return {...a, ...this.signout};
            }else{
                return a;
            }
        })}
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

export class UpdateSignoutCrew extends EditAction<ActionClassType>{
    actions: UpdateCrewAction[]
    signoutId: number
    constructor(actions: UpdateCrewAction[], signoutId: number){
        super();
        this.actions = actions;
        this.signoutId = signoutId;
    }
    applyActionLocal(data) {
        const toRemove = this.actions.reduce((a, b) => {
            if(b instanceof RemoveCrewAction){
                a[b.personId] = true;
            }
            return a;
        }, {} as {[key: number]: boolean});
        const toAdd = this.actions.filter((a) => a instanceof AddCrewAction).map((a: AddCrewAction) => ({...a.person, isSkipper: false, isTesting: false, testRatingId: option.none}));
        return {...data, associatedSignouts: data.associatedSignouts.map((a) => {
            if(a.signoutId == this.signoutId){
                return {...a, currentPeople: makeSkipperIfNone(a.currentPeople.filter((a) => !toRemove[a.personId]).concat(toAdd))};
            }else{
                return a;
            }
        })}
    }
}

export class UpdateClassSignup extends EditAction<ActionClassType>{
    classSignup: Partial<ApClassSignup>;
    constructor(classSignup: Partial<ApClassSignup>){
        super();
        this.classSignup = classSignup;
    }
    applyActionLocal(data) {
        return {...data, currentClass: {...data.currentClass, $$apClassInstance: {...data.currentClass.$$apClassInstance, $$apClassSignups: data.currentClass.$$apClassInstance.$$apClassSignups.map((a) => {
            if(a.signupId == this.classSignup.signupId)
                return {...a, ...this.classSignup};
            else
                return a;
        })}}}
    }
}

/*export class UpdateAttendanceList EditAction<ActionClassType>{
    return {
        applyActionLocal: (data) => {
            return {...data, attendanceMap: {...data.attendanceMap, ...attendanceList}};
        }
    };
}*/

export class UpdateClass extends EditAction<ActionClassType>{
    updatedClass: Partial<ApClassSessionWithInstance>
    constructor (updatedClass: Partial<ApClassSessionWithInstance>){
        super();
        this.updatedClass = updatedClass;
    }
    applyActionLocal(data) {
        return {...data, currentClass: {...data.currentClass, ...this.updatedClass}};
    }
}

export class RemoveSignouts extends EditAction<ActionClassType>{
    signoutIds: number[]
    constructor(signoutIds: number[]){
        super();
        this.signoutIds = signoutIds;
    }
    applyActionLocal(data) {
        return {...data, associatedSignouts: data.associatedSignouts.filter((a) => !this.signoutIds.contains(a.signoutId))};
    }
}