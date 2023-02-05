import { MAGIC_NUMBERS } from 'app/magicNumbers';
import { ClassType, SignupType } from 'async/staff/dockhouse/get-classes';
import * as React from 'react';
import { ActionClassType, AttendanceMap } from "./ActionClassType";
import { SignoutCombinedType } from '../SignoutCombinedType';
import { AddActionType, AddCrewAction, updateAttendanceList, updateClassSignup, updateSignoutCrew } from './Actions';
import { ClassBoatListActions, SelectableDiv, SelectedType, selectKeyRosterPerson, selectKeySignout } from './ClassSelectableDiv';
import { makeNewSignout, NameWithRatingHover } from './ClassSignoutBoatList';
import RadioGroup from 'components/wrapped/RadioGroup';
import { AttendanceEntry } from 'async/staff/dockhouse/attendance';
import { option } from 'fp-ts';
import { getSelectedSignouts } from "./getSelected";
import { BoatSelect, boatTypesMapped } from '../BoatIcon';
import { BoatsContext } from 'components/dockhouse/providers/BoatsProvider';

function SetAttendance(props: {signup: ClassType['$$apClassSignups'][number], attendance: AttendanceMap} & AddActionType){
    const current = props.attendance[props.signup.$$person.personId];
    return <RadioGroup<AttendanceEntry> className="flex flex-row gap-2" value={(current != undefined) ? option.some(current) : option.none} setValue={(v) => {
        props.addAction(updateAttendanceList({[props.signup.$$person.personId]: v.isSome() ? v.value : undefined}))
    }} makeChildren={Object.values(AttendanceEntry).filter((a) => typeof a == "string").map((a) => ({value: a as AttendanceEntry, makeNode: (b, c) => {
        return <div className={((a == AttendanceEntry.ABSENT) ? "text-red-500" : ((a == AttendanceEntry.HERE) ? "text-green-500" : "")) + (b ? " border-white border" : "") }>{a.toString()}</div>
    }}))}/>
}

function RosterRows(props: {signups: ClassType['$$apClassSignups']} & ClassBoatListActions & AddActionType & {singleSelectedSignout: SignoutCombinedType, isWaitlist: boolean, maxSignups?: number, attendance?: AttendanceMap, allBoatType: option.Option<number>, makeNewSignout: (boatId: option.Option<number>) => number}){
    const boatTypes = React.useContext(BoatsContext);
    const [boatsByHR, boatsById] = boatTypesMapped(boatTypes);
    return <>{props.signups.map((a, i) => <SelectableDiv isInner={false} onClick={() => {
        const addTo = (signoutId: number) => props.addAction(updateSignoutCrew([new AddCrewAction(({...a.$$person, personRatings: []}) as any)], signoutId));
        const addToCurrent = () => addTo(props.singleSelectedSignout.signoutId);
        const addToNew = () => {
            const newId = props.makeNewSignout(props.allBoatType);
            addTo(newId);
            props.set({[selectKeySignout(newId)]: true});
        }
        if(props.isWaitlist){
            if(props.signups.filter((a) => a.signupType == SignupType.ACTIVE).length + 1 <= props.maxSignups){
                props.addAction(updateClassSignup({signupId: a.signupId, signupType: SignupType.ACTIVE}));
            }else{
                alert("Max number of people reached");
            }
        }else{
            if(props.singleSelectedSignout){
                if(props.singleSelectedSignout.boatId.isSome()){
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
                    addToCurrent();
                }
            }else if(props.allBoatType.isSome()){
                addToNew();
            }else{
                alert("Select a boat, or a boat for all");
            }
        }
    }} key={i}
    thisSelect={{[selectKeyRosterPerson(a.$$person.personId)]: true}} {...props} makeNoSelectChildren={(ref) => 
        <div ref={ref} className="w-full flex flex-row">
            <div className="grow-[2] basis-0">
                <NameWithRatingHover {...{...a.$$person, personRatings: []} as any} programId={MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM}/>
            </div>
            <div className="grow-[1] basis-0">
                {props.isWaitlist ? "Waitlisted" : <SetAttendance signup={a} attendance={props.attendance} addAction={props.addAction}/>}
            </div>
        </div>}>
        </SelectableDiv>)}</>
}

export default function ClassRosterTable(props: ActionClassType & ClassBoatListActions & AddActionType){
    const [boatTypeForAll, setBoatTypeForAll] = React.useState<option.Option<number>>(option.none);
    const singleSelectedSignout = getSelectedSignouts(props.associatedSignouts, props.selected)[0];
    const personIdsOnWater = props.associatedSignouts.flatMap((a) => a.currentPeople).reduce((a, b) => {
        a[b.personId] = true;
        return a;
    }, {} as {[key: number]: true})
    const makeNew = (boatId: option.Option<number>) => {
        const newId = makeNewSignout(props.associatedSignouts, boatId, props.addAction);
        return newId;
    }
    return <div className="flex flex-col gap-2">
            <BoatSelect label="Boat for all:" boatId={boatTypeForAll} setBoatId={setBoatTypeForAll} autoWidth/>
            <div className="flex flex-row w-full">
                <div className="grow-[2] basis-0">
                    Name
                </div>
                <div className="grow-[1] basis-0">
                    Attendance
                </div>
            </div>
            <RosterRows signups={props.currentClass.$$apClassSignups.filter((a) => a.signupType == SignupType.ACTIVE && !personIdsOnWater[a.$$person.personId])} {...props} singleSelectedSignout={singleSelectedSignout} isWaitlist={false} attendance={props.attendanceMap} allBoatType={boatTypeForAll} makeNewSignout={makeNew}/>
            <hr className="border-b-2 border-black"/>
            <RosterRows signups={props.currentClass.$$apClassSignups.filter((a) => a.signupType == SignupType.WAITLIST && !personIdsOnWater[a.$$person.personId])} {...props} singleSelectedSignout={singleSelectedSignout} isWaitlist maxSignups={props.currentClass.signupMax} allBoatType={boatTypeForAll} makeNewSignout={makeNew}/>
        </div>;
}