import { EditAction } from "components/ActionBasedEditor";
import { option } from "fp-ts";
import { CurrentPeopleType, SignoutCombinedType } from "../signouts/SignoutCombinedType";
import { MemberActionType } from "./MemberActionType";

export class ChangeClassAction extends EditAction<MemberActionType>{
    classSessionId: option.Option<number>
    constructor(classSessionId: option.Option<number>){
        super();
        this.classSessionId = classSessionId;
    }
    applyActionLocal(data: MemberActionType) {
        return {...data, currentClassSessionId: this.classSessionId}
    }
}

export class AddPersonAction extends EditAction<SignoutCombinedType>{
    person: CurrentPeopleType[number]
    constructor(person: CurrentPeopleType[number]){
        super();
        this.person = person;
    }
    applyActionLocal(data: SignoutCombinedType) {
        return {...data, currentPeople: data.currentPeople.concat(this.person)}
    }
}

export class RemovePersonByIdAction extends EditAction<SignoutCombinedType>{
    id: number
    constructor(id: number){
        super();
        this.id = id;
    }
    applyActionLocal(data: SignoutCombinedType) {
        return {...data, currentPeople: data.currentPeople.filter((a) => this.id != a.personId)}
    }
}


export class UpdatePersonByIdAction extends EditAction<SignoutCombinedType>{
    person: Partial<CurrentPeopleType[number]>
    id: number
    constructor(id: number, person: Partial<CurrentPeopleType[number]>){
        super();
        this.person = person;
        this.id = id;
    }
    applyActionLocal(data: SignoutCombinedType) {
        return {...data, currentPeople: data.currentPeople.map((a) => (this.id == a.personId) ? {...a, ...this.person} : a)}
    }
}

export class SetSkipperAction extends EditAction<SignoutCombinedType>{
    index: number
    constructor(index: number){
        super();
        this.index = index;
    }
    applyActionLocal(data: SignoutCombinedType) {
        return {...data, currentPeople: data.currentPeople.map((a, i) => ({...a, isSkipper: (this.index == i)}))}
    }
}

export class UpdateSignoutAction<T extends keyof SignoutCombinedType> extends EditAction<SignoutCombinedType>{
    field: T
    value: SignoutCombinedType[T]
    constructor(field: T, value: SignoutCombinedType[T]){
        super();
        this.field = field;
        this.value = value;
    }
    applyActionLocal(data: SignoutCombinedType) {
        return {...data, [this.field]: this.value}
    }
}