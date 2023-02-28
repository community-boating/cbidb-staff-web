import { ScannedPersonType } from "async/staff/dockhouse/scan-card";
import { EditAction } from "components/ActionBasedEditor";
import { option } from "fp-ts";
import { CurrentPeopleType, SignoutCombinedType } from "../signouts/SignoutCombinedType";

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

export class RemovePersonAction extends EditAction<SignoutCombinedType>{
    index: number
    constructor(index: number){
        super();
        this.index = index;
    }
    applyActionLocal(data: SignoutCombinedType) {
        return {...data, currentPeople: data.currentPeople.filter((a, i) => this.index != i)}
    }
}

export class UpdatePersonAction extends EditAction<SignoutCombinedType>{
    person: Partial<CurrentPeopleType[number]>
    index: number
    constructor(person: Partial<CurrentPeopleType[number]>, index: number){
        super();
        this.person = person;
        this.index = index;
    }
    applyActionLocal(data: SignoutCombinedType) {
        return {...data, currentPeople: data.currentPeople.map((a, i) => (this.index == i) ? {...a, ...this.person} : a)}
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