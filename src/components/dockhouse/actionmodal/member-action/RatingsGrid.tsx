import { RatingsType } from 'async/staff/dockhouse/ratings';
import { RatingsContext } from 'async/providers/RatingsProvider';
import { CheckboxInput} from 'components/wrapped/Input';
import { option } from 'fp-ts';
import * as React from 'react';

export type RatingsGridProps = {
    selectedProgram: option.Option<number>
    selectedRatings: {[key: number]: boolean}
    setSelectedRatings: React.Dispatch<React.SetStateAction<{[key: number]: boolean}>>
}

function makeRatingsById(ratings: RatingsType){
    const ratingsById: {[key: number]: RatingsType} = {};
    /*ratings.forEach((a) => {
        a.$$programs.forEach((p) => {
            if(!ratingsById[p.programId])
                ratingsById[p.programId] = [];
            ratingsById[p.programId].push(a);
        });
    })
    return ratingsById;*/
}

export default function RatingsGrid(props: RatingsGridProps){
    const ratings = React.useContext(RatingsContext);
    //const ratingsById = React.useMemo(() => makeRatingsById(ratings), [ratings])
    return <>
        <div className="grid grid-cols-8 gap-4">
            {props.selectedProgram.isSome() ? ratings.map((a, i) => (<div key={a.ratingId} className="flex flex-col items-end">
                <CheckboxInput className="" label={a.ratingName + ":"} controlledValue={option.some(props.selectedRatings[a.ratingId])} updateValue={(v) => {props.setSelectedRatings((s) => ({...s, ...({[a.ratingId]: v.getOrElse(false)})}))}} validationResults={[]}></CheckboxInput>
            </div>)) : <></>}
        </div>
    </>
}