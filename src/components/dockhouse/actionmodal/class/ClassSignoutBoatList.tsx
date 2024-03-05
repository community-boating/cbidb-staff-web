import { BoatTypesType } from 'async/staff/dockhouse/boats';;
import { BoatsContext } from 'async/providers/BoatsProvider';
import { option } from 'fp-ts';
import * as React from 'react';
import { BoatSelect } from '../BoatIcon';
import add from 'assets/img/icons/buttons/add.svg';
import { OptionalStringInput } from 'components/wrapped/Input';
import Button from 'components/wrapped/Button';
import { buttonClasses, buttonClassInactive } from '../styles';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { ClassBoatListActions, SelectableDiv, selectKeySignout } from './ClassSelectableDiv';
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { AddActionType, AddSignoutAction, findLowestId } from './Actions';
import { ScannedPersonType } from 'models/typerefs';
import { RatingsHover } from 'components/dockhouse/actionmodal/signouts/RatingSorter';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import { ActionClassType } from "./ActionClassType";
import x from 'assets/img/icons/buttons/x.svg';

function InputWithDelay<T_Value>(props: {makeInput: (value: T_Value, updateValue: (value: T_Value) => void) => JSX.Element, delay: number, value: T_Value, updateValue: (value: T_Value) => void}){
    const [value, updateValue] = React.useState(props.value);
    const ref = React.useRef<NodeJS.Timeout>();
    React.useEffect(() => {
        updateValue(props.value);
    }, [props.value]);
    React.useEffect(() => {
        return () => {
            if(ref.current){
                clearTimeout(ref.current);
            }
        }
    }, []);
    const updateValueDelayed = (value: T_Value) => {
        updateValue(value);
        if(ref.current){
            clearTimeout(ref.current);
        }
        ref.current = setTimeout(() => {
            props.updateValue(value);
        }, props.delay);
    }
    return props.makeInput(value, updateValueDelayed);
}

export function NameWithRatingHover(props: ScannedPersonType & {programId: number, isBig?: boolean}){
    return <RatingsHover person={props} programId={props.programId} orphanedRatingsShownByDefault={[]} label={
        <p className={(props.isBig ? "text-[50px]" : "") + " truncate"}>{props.nameFirst.getOrElse("")} {props.nameLast.getOrElse("")}</p>
    }/>
}

type SetSignoutType = {
    setSignout: (signoutId: number, key: keyof SignoutCombinedType, value: SignoutCombinedType[typeof key]) => void
}

export function ClassBoat(props: SignoutCombinedType & ClassBoatListActions & SetSignoutType &
{isBig?: boolean, removePerson: (personId: number, signoutId: number) => void}){
    const boatTypes = React.useContext(BoatsContext);
    const boatsById = React.useMemo(() => boatTypes.reduce((a, b) => {
        a[b.boatId] = b;
        return a;
    }, {} as {[key: number]: BoatTypesType[number]}), [boatTypes]);
    const ratings = React.useContext(RatingsContext);
    const long = props.currentPeople.length > 4;
    return <div className={(props.isBig ? "grow-[1] h-[600px]" : (long ? "col-span-3 " : "col-span-2 "))}>
                        <SelectableDiv className="w-full max-h-full" isInner={false} thisSelect={{[selectKeySignout(props.signoutId)]: true}} {...props} makeNoSelectChildren={(ref) =>
                            <div ref={ref} className="flex flex-row basis-0 grow-[1] my-auto">
                                <BoatSelect boatId={props.boatId} setBoatId={(v) => {
                                    props.setSignout(props.signoutId, 'boatId', v);
                                }} useBoatImage className={(props.isBig ? "h-[300px] w-[300px]" : "h-[8vh] w-[8vh]")} inputClassName={(props.isBig ? "h-[300px] w-[300px]" : "h-[8vh] w-[8vh]")}/>
                                <InputWithDelay value={props.sailNum} updateValue={(v) => {
                                    props.setSignout(props.signoutId, 'sailNum', v);
                                }} delay={800} makeInput={(value, updateValue) => 
                                    <OptionalStringInput controlledValue={value} updateValue={updateValue} label={<p className={(props.isBig ? "text-[50px]" : "")}>#</p>} placeholder="#" customStyle className={(props.isBig ? "text-[300px] h-[300px] w-[350px]" : "text-[8vh] h-[8vh] w-[10vh]") + " bg-transparent border-0 leading-none p-0 m-0 overflow-x-visible w-full"}></OptionalStringInput>
                                }></InputWithDelay>
                            </div>
                        }>
                <div className={"grid grid-rows-4 basis-0 gap-1 p-1 " + (long ? "grow-[2] grid-cols-2" : "grow-[1] grid-cols-1")}>
                    {props.currentPeople.map((a, i) => <div key={i} className="grow-0 basis-0 whitespace-nowrap flex flex-row w-full">
                        <div className="flex flex-row basis-3 min-w-full max-w-full leading-none text-overflow-ellipsis border-1 border-gray-200"><NameWithRatingHover {...a} isBig={props.isBig} programId={MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM}/><input className={(props.isBig ? "h-[60px]" : "h-[20px]")} type="image" src={x} onClick={(e) => {
                            e.preventDefault();
                            props.removePerson(a.personId, props.signoutId);
                        }}/></div>
                    </div>)}
                </div>
        </SelectableDiv>
    </div>
}

export function ClassActionsList(props: {signin, incident, cancel}){
    return <div className="flex flex-row gap-2">
        <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => props.signin()}>Sign In</Button>
        <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => props.incident()}>Incident</Button>
        <Button className={buttonClasses + " " + buttonClassInactive} onClick={(e) => props.cancel()}>Cancel</Button>
    </div>
}

export function makeNewSignout(associatedSignouts: {signoutId: number}[], newBoatId: option.Option<number>, addAction: AddActionType['addAction']){
    const newId = findLowestId(associatedSignouts) - 1;
    addAction(new AddSignoutAction({signoutId: newId, boatId: newBoatId}));
    return newId;
}

export default function ClassSignoutBoatList(props: ActionClassType & ClassBoatListActions & SetSignoutType & {makeNewSignout: (boatId: option.Option<number>) => number, removePerson: (personId: number, signoutId: number) => void}){
    return <div className="flex flex-col grow-[1]">
        <div className={"grid gap-2 grid-cols-6 grid-rows-6 grow-[1] max-h-full"}>
            <div className="relative col-span-2 border-2 select-none cursor-pointer" onClick={(e) => {
                e.preventDefault();
                const newId = props.makeNewSignout(option.none);
                props.set({[selectKeySignout(newId)]: true});
            }}>
                <div className="relative w-full h-full">
                    <input type="image" className="absolute h-[90%] m-auto right-0 left-0 top-0 bottom-0" src={add}/>
                </div>
            </div>
            {props.associatedSignouts.map((a) => <ClassBoat key={a.signoutId} {...a} {...props}/>)}
        </div>
    </div>
}