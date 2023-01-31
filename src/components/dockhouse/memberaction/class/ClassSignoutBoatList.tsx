import { BoatTypesType } from 'async/staff/dockhouse/boats';
import { SignoutTablesState } from 'async/staff/dockhouse/signouts';
import { BoatsContext } from 'components/dockhouse/providers/BoatsProvider';
import { option } from 'fp-ts';
import * as React from 'react';
import { ActionClassType } from '../ActionModalProps';
import BoatIcon, { BoatIcons, BoatSelect } from '../BoatIcon';
import x from 'assets/img/icons/buttons/x.svg';

function ClassBoat(props: SignoutTablesState & {selected: boolean, setSelected: React.Dispatch<React.SetStateAction<option.Option<number>>>}){
    const boatTypes = React.useContext(BoatsContext);
    const boatsById = React.useMemo(() => boatTypes.reduce((a, b) => {
        a[b.boatId] = b;
        return a;
    }, {} as {[key: number]: BoatTypesType[number]}), [boatTypes]);
    const n = 2 + props.$$crew.length;
    const allPeople = [props.$$skipper].concat(props.$$crew.map((a) => ({...a.$$person, $$personRatings: []})));
    return <div style={{gridColumn: 'span ' + n + ' / span ' + n}} className={"border-2 " + (props.selected ? "border-red-600" : "border")} onClick={(e) => {
        props.setSelected(option.some(props.signoutId));
    }}>
            <div className="flex flex-row w-full h-full">
            <div className="h-full grow-[1] basis-0">
                <img className="w-[50%]" src={BoatIcons.find((a) => a.hr == boatsById[props.boatId].boatName, {src: ''}).src}></img>
                <BoatSelect boatId={option.some(props.boatId)} setBoatId={() => {}} fullWidth/>
            </div>
            {allPeople.map((a) => <div className="grow-[1] basis-0 whitespace-nowrap flex flex-row"><p>{a.nameFirst} {a.nameLast}</p><input className="h-icon_button" type="image" src={x}/></div>)}
        </div>
    </div>
}

export default function ClassSignoutBoatList(props: ActionClassType & {selected: option.Option<number>, setSelected: React.Dispatch<React.SetStateAction<option.Option<number>>>}){
    return <div className="grid gap-2 grid-cols-4 grid-rows-6 h-full w-full">
        <div className="border-2 col-span-2">
            Add
        </div>
        {props.associatedSignouts.map((a) => <ClassBoat key={a.signoutId} {...a} selected={props.selected.getOrElse(-1) == a.signoutId} setSelected={props.setSelected}/>)}
    </div>
}