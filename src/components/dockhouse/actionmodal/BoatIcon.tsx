import * as React from 'react';

import sup from 'assets/img/icons/boats/sup.svg';
import kayak from 'assets/img/icons/boats/kayak.svg';
import b420 from 'assets/img/icons/boats/b420.svg';
import ideal from 'assets/img/icons/boats/ideal.svg';
import keelmerc from 'assets/img/icons/boats/keelmerc.svg';
import laser from 'assets/img/icons/boats/laser.svg';
import mercury from 'assets/img/icons/boats/mercury.svg';
import windsurf from 'assets/img/icons/boats/windsurf.svg';
import sonar from 'assets/img/icons/boats/sonar.svg';
import IconButton from 'components/wrapped/IconButton';
import { option } from 'fp-ts';
import RadioGroup from 'components/wrapped/RadioGroup';
import { SelectInput } from 'components/wrapped/Input';
import { makeBoatTypesHR } from "../../../pages/dockhouse/signouts/makeReassignedMaps";
import { BoatsContext } from 'components/dockhouse/providers/BoatsProvider';
import { BoatTypesType } from 'async/staff/dockhouse/boats';
export type BoatIconProps = {
    boatId: option.Option<number>
    setBoatId: (boatId: option.Option<number>) => void
}

export const BoatIcons = [{
    hr: "Stand Up Paddleboard",
    key: "P",
    src: sup
},
{
    hr: "Kayak",
    key: "K",
    src: kayak
},
{
    hr: "420",
    key: "4",
    src: b420
},
{
    hr: "Ideal 18",
    key: "I",
    src: ideal
},
{
    hr: "Keel Mercury",
    key: "F",
    src: keelmerc
},
{
    hr: "Laser",
    key: "L",
    src: laser
},
{
    hr: "Sonar",
    key: "S",
    src: sonar
},
{
    hr: "Mercury",
    key: "C",
    src: mercury
},
{
    hr: "Windsurfer",
    key: "W",
    src: windsurf
}]

export const boatIconsByHR = BoatIcons.reduce((a, b) => {
    a[b.hr] = b;
    return a;
}, {} as {[key: string]: typeof BoatIcons[number]});

export const boatIconsByKey = BoatIcons.reduce((a, b) => {
    a[b.key] = b;
    return a;
}, {} as {[key: string]: typeof BoatIcons[number]});

export function boatTypesMapped(boatTypes: BoatTypesType): [{[key: string]: BoatTypesType[number]}, {[key: number]: BoatTypesType[number]}]{
    const boatsByHR = {};
    const boatsById = {};
    boatTypes.forEach((a) => {
        boatsByHR[a.boatName] = a;
        boatsById[a.boatId] = a;
    });
    return [boatsByHR, boatsById];
}

export default function(props: BoatIconProps){
    const boatTypes = React.useContext(BoatsContext);
    const [boatsByHR, boatsById] = boatTypesMapped(boatTypes);
    return (
    <RadioGroup value={props.boatId} setValue={(value) => props.setBoatId(value)} className="flex flex-row gap-5" keyListener={(key) => {
        const boat = boatIconsByKey[key.toUpperCase()];
        if(boat){
            props.setBoatId(option.some(boatsByHR[boat.hr].boatId));
        }
    }} makeChildren={BoatIcons.map((a, i) => {const boatType = (boatsByHR[a.hr] || {boatId: -1}); return({
        value: boatType.boatId,
        makeNode: (checked) => <IconButton key={i} src={a.src} onClick={() => props.setBoatId(option.some(boatType.boatId))} className={"min-w-[100px] min-h-[100px] text-black rounded-2 border border-[#00507d]" + (checked? " bg-blue-200 border-gray-200" : "")}/>
    }) }
    )}/>
    )
}

export function BoatSelect(props: BoatIconProps & {label?: string, autoWidth?: boolean, nowrap?: boolean, fullWidth?: boolean, useBoatImage?: boolean, className?: string, tabIndex?: number}){
    const boatTypes = React.useContext(BoatsContext);
    const boatTypesSelectOptions = React.useMemo(() => makeBoatTypesHR(boatTypes), [boatTypes]);
    const [boatsByHR, boatsById] = boatTypesMapped(boatTypes);
    return <SelectInput tabIndex={props.tabIndex} label={props.label} controlledValue={props.boatId} updateValue={props.setBoatId} validationResults={[]} selectOptions={boatTypesSelectOptions} selectNone={false} nowrap={props.nowrap} autoWidth={props.autoWidth} fullWidth={props.fullWidth}
    makeButton={props.useBoatImage ? (a) => a.value.isSome() ? <img src={boatIconsByHR[boatsById[a.value.value].boatName].src} className="h-[8vh] min-w-[8vh]"/> : <>Boat Type</> : undefined} customStyle={props.useBoatImage} className={props.className}></SelectInput>
}