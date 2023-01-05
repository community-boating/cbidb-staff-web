import asc from 'app/AppStateContainer';
import { ValidatedCheckboxInput, ValidatedSelectInput } from 'components/wrapped/Input';
import { option } from 'fp-ts';
import * as React from 'react';
import { programsHR } from '../signouts/Constants';
import { RatingsType } from '../signouts/StateTypes';
import { ScannedCrewType } from './MemberActionModal';

export type RatingsGridProps = {
    selectedProgram: option.Option<number>
    selectedRatings: {[key: number]: boolean}
    setSelectedRatings: React.Dispatch<React.SetStateAction<{[key: number]: boolean}>>
}

function makeRatingsById(ratings: RatingsType){
    const ratingsById: {[key: number]: RatingsType} = {};
    asc.state.ratings.forEach((a) => {
        a.$$programs.forEach((p) => {
            if(!ratingsById[p.programId])
                ratingsById[p.programId] = [];
            ratingsById[p.programId].push(a);
        });
    })
    return ratingsById;
}

export default function RatingsGrid(props: RatingsGridProps){
    const ratingsById = React.useMemo(() => makeRatingsById(asc.state.ratings), [asc.state.ratings])
    return <>
        <div className="grid grid-cols-4 gap-4">
            {props.selectedProgram.isSome() ? ratingsById[props.selectedProgram.value].map((a, i) => (<div key={a.ratingId}>
                {a.ratingName}
                <ValidatedCheckboxInput initValue={option.some(props.selectedRatings[a.ratingId])} updateValue={(v) => {props.setSelectedRatings((s) => ({...s, ...({[a.ratingId]: v.getOrElse(false)})}))}} validationResults={[]}></ValidatedCheckboxInput>
            </div>)) : <></>}
        </div>
    </>
}