import { MAGIC_NUMBERS } from 'app/magicNumbers';
import * as React from 'react';
import { AttendanceMap } from "./ActionClassType";
import { SignoutCombinedType } from '../signouts/SignoutCombinedType';
import { AddActionType} from './Actions';
import { ClassBoatListActions, SelectableDiv, selectKeyRosterPerson, selectKeySignout } from './ClassSelectableDiv';
import { NameWithRatingHover } from './ClassSignoutBoatList';
import RadioGroup from 'components/wrapped/RadioGroup';
import { AttendanceEntry } from 'async/staff/dockhouse/attendance';
import { option } from 'fp-ts';
import { getSelectedSignouts } from "./getSelected";
import { boatTypesMapped } from '../BoatIcon';
import { BoatsContext } from 'async/providers/BoatsProvider';
import { ApClassSignup, SignupType } from 'async/staff/dockhouse/ap-class-sessions';
import { ActionClassType } from "./ActionClassType";

function SetAttendance(props: {signup: ApClassSignup, attendance: AttendanceMap} & AddActionType){
    const current = props.attendance[props.signup.$$person.personId];
    return <RadioGroup<AttendanceEntry> className="flex flex-row gap-2" value={(current != undefined) ? option.some(current) : option.none} setValue={(v) => {
        //props.addAction(updateAttendanceList({[props.signup.$$person.personId]: v.isSome() ? v.value : undefined}))
    }} makeChildren={Object.values(AttendanceEntry).filter((a) => typeof a == "string").map((a) => ({value: a as AttendanceEntry, makeNode: (b, c) => {
        return <div className={((a == AttendanceEntry.ABSENT) ? "text-red-500" : ((a == AttendanceEntry.HERE) ? "text-green-500" : "")) + (b ? " border-white border" : "") }>{a.toString()}</div>
    }}))}/>
}

type AddToType = {addTo: (signoutId: number, person: {personId: number, nameFirst: string, nameLast: string}) => void};

function RosterRows(props: {signups: ApClassSignup[]} & ClassBoatListActions & AddToType & {singleSelectedSignout: SignoutCombinedType, isWaitlist: boolean, maxSignups?: number, attendance?: AttendanceMap, allBoatType: option.Option<number>, makeNewSignout: (boatId: option.Option<number>) => number, personIdsOnWater: {[key: number]: true}}){
    const boatTypes = React.useContext(BoatsContext);
    const [boatsByHR, boatsById] = boatTypesMapped(boatTypes);
    return <>{props.signups.map((a, i) => <SelectableDiv isInner={false} onClick={() => {
        const addTo = (signoutId: number) => props.addTo(signoutId, a.$$person);
        const addToCurrent = () => addTo(props.singleSelectedSignout.signoutId);
        const addToNew = () => {
            const newId = props.makeNewSignout(props.allBoatType);
            addTo(newId);
            props.set({[selectKeySignout(newId)]: true});
        }
        if(props.isWaitlist){
            if(props.signups.filter((a) => a.signupType == SignupType.ACTIVE).length + 1 <= props.maxSignups){
                //props.addAction(updateClassSignup({signupId: a.signupId, signupType: SignupType.ACTIVE}));
            }else{
                alert("Max number of people reached");
            }
        }else{
            if(props.singleSelectedSignout){
                if(props.personIdsOnWater[a.$$person.personId]){
                    alert("person already in a boat")
                }else if(props.singleSelectedSignout.boatId.isSome()){
                    console.log(boatsById[props.singleSelectedSignout.boatId.value].maxCrew);
                    if(boatsById[props.singleSelectedSignout.boatId.value].maxCrew < props.singleSelectedSignout.currentPeople.length + 1){
                        if(props.allBoatType.isSome()){
                            addToNew();
                        }else{
                            alert("Boat is full");
                        }
                    }else{
                        addToCurrent();
                    }
                }else{
                    if(props.singleSelectedSignout.currentPeople.length + 1 <= 8){
                        addToCurrent();
                    }else{
                        alert("Boat is full");
                    }
                }
            }else{
                alert("Select a boat");
            }
        }
    }} key={i}
    thisSelect={{[selectKeyRosterPerson(a.$$person.personId)]: true}} {...props} makeNoSelectChildren={(ref) => 
        <div ref={ref} className="w-full flex flex-row">
            <div className="grow-[2] basis-0">
                <NameWithRatingHover {...{...a.$$person, personRatings: []} as any} programId={MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM}/>
            </div>
            <div className="grow-[1] basis-0">
                {props.isWaitlist ? <p className="text-yellow-700">Waitlisted</p> : props.personIdsOnWater[a.personId] ? <p className="text-blue-700">On Water</p> : <SetAttendance signup={a} attendance={props.attendance} addAction={undefined}/>}
            </div>
        </div>}>
        </SelectableDiv>)}</>
}

export function getPersonIdsOnWater(associatedSignouts: SignoutCombinedType[]){
    return associatedSignouts.flatMap((a) => a.currentPeople).reduce((a, b) => {
        a[b.personId] = true;
        return a;
    }, {} as {[key: number]: true})
}

export default function ClassRosterTable(props: ActionClassType & ClassBoatListActions & AddToType & {makeNewSignout: (boatId: option.Option<number>) => number}){
    const [boatTypeForAll] = React.useState<option.Option<number>>(option.none);
    const singleSelectedSignout = getSelectedSignouts(props.associatedSignouts, props.selected)[0];
    const personIdsOnWater = getPersonIdsOnWater(props.associatedSignouts);
    //<BoatSelect label="Boat for all:" boatId={boatTypeForAll} setBoatId={setBoatTypeForAll} autoWidth/>
    return <div className="flex flex-col gap-2">
            <div className="flex flex-row w-full">
                <div className="grow-[2] basis-0">
                    Name
                </div>
                <div className="grow-[1] basis-0">
                    Attendance
                </div>
            </div>
            <RosterRows signups={props.currentClass.$$apClassInstance.$$apClassSignups.filter((a) => a.signupType == SignupType.ACTIVE)} {...props} singleSelectedSignout={singleSelectedSignout} isWaitlist={false} attendance={props.attendanceMap} allBoatType={boatTypeForAll} personIdsOnWater={personIdsOnWater}/>
            <hr className="border-b-2 border-black"/>
            <RosterRows signups={props.currentClass.$$apClassInstance.$$apClassSignups.filter((a) => a.signupType == SignupType.WAITLIST)} {...props} singleSelectedSignout={singleSelectedSignout} isWaitlist maxSignups={props.currentClass.$$apClassInstance.signupMax.getOrElse(undefined)} allBoatType={boatTypeForAll} personIdsOnWater={personIdsOnWater}/>
        </div>;
}