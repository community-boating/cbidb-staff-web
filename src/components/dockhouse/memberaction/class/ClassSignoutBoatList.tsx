import { BoatTypesType } from 'async/staff/dockhouse/boats';
import { SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { BoatsContext } from 'components/dockhouse/providers/BoatsProvider';
import { option } from 'fp-ts';
import * as React from 'react';
import { ActionClassType } from '../ActionModalProps';
import BoatIcon, { BoatIcons, BoatSelect } from '../BoatIcon';
import x from 'assets/img/icons/buttons/x.svg';
import { OptionalStringInput, SimpleInput } from 'components/wrapped/Input';
import Button from 'components/wrapped/Button';
import { buttonClassActive, buttonClasses, buttonClassInactive } from '../styles';

function ClassBoat(props: SignoutTablesState & {selected: boolean, setSelected: React.Dispatch<React.SetStateAction<option.Option<number>>>}){
    const boatTypes = React.useContext(BoatsContext);
    const boatsById = React.useMemo(() => boatTypes.reduce((a, b) => {
        a[b.boatId] = b;
        return a;
    }, {} as {[key: number]: BoatTypesType[number]}), [boatTypes]);
    const allPeople = [props.$$skipper].concat(props.$$crew.map((a) => ({...a.$$person, $$personRatings: []}))).concat(props.$$crew.map((a) => ({...a.$$person, $$personRatings: []}))).concat(props.$$crew.map((a) => ({...a.$$person, $$personRatings: []}))).concat(props.$$crew.map((a) => ({...a.$$person, $$personRatings: []}))).concat(props.$$crew.map((a) => ({...a.$$person, $$personRatings: []}))).concat(props.$$crew.map((a) => ({...a.$$person, $$personRatings: []}))).concat(props.$$crew.map((a) => ({...a.$$person, $$personRatings: []})));
    return <div className={"border-2 " + (allPeople.length > 4 ? "col-span-3 " : "col-span-2 ") + (props.selected ? "border-red-600" : "border")} onClick={(e) => {
        props.setSelected(option.some(props.signoutId));
    }}>
            <div className="flex flex-row w-full h-full">
            <div className="h-full grow-[1] basis-0">
                <div className="flex flex-row basis-0 grow-0">
                    <BoatSelect boatId={option.some(props.boatId)} setBoatId={() => {}} useBoatImage className="h-[8vh]"/>
                    <OptionalStringInput controlledValue={props.sailNumber} updateValue={(v) => {}} label={"#"} customStyle className="bg-transparent border-0 text-[8vh] leading-none p-0 m-0 w-[8vh] h-[8vh]"></OptionalStringInput>
                </div>
            </div>
            <div className={"grid grid-cols-2 grid-rows-4 basis-0 " + (allPeople.length > 4 ? "grow-[2]" : "grow-[1]")}>
                {allPeople.map((a) => <div className="grow-0 basis-0 whitespace-nowrap flex flex-row w-full">
                    <input className="h-icon_button ml-0 mr-auto basis-1 grow-[1]" type="image" src={x}/>
                    <p className="ml-2 basis-3 grow-[3]">{a.nameFirst}</p>
                    <p className="basis-3 grow-[3]">{a.nameLast}</p>
                </div>)}
            </div>
        </div>
    </div>
}

export function ClassActionsList(props: {signin, incident, cancel, new}){
    return <div className="flex flex-row gap-2">
        <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => props.signin()}>Sign In</Button>
        <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => props.incident()}>Incident</Button>
        <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => props.cancel()}>Cancel</Button>
        <Button className={buttonClasses + " " + buttonClassActive} onClick={(e) => props.signin()}>Add</Button>
    </div>
}

export default function ClassSignoutBoatList(props: ActionClassType & {selected: option.Option<number>, setSelected: React.Dispatch<React.SetStateAction<option.Option<number>>>}){
    return <div className="grid gap-2 grid-cols-4 grid-rows-6 grow-[1] max-h-full h-full">
        {props.associatedSignouts.map((a) => <ClassBoat key={a.signoutId} {...a} selected={props.selected.getOrElse(-1) == a.signoutId} setSelected={props.setSelected}/>)}
    </div>
}