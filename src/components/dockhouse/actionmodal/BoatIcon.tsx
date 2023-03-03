import * as React from 'react';

import sup from 'assets/img/icons/boats/boatPaddleboard.svg';
import kayak from 'assets/img/icons/boats/boatKayak.svg';
import b420 from 'assets/img/icons/boats/boat420.svg';
import ideal from 'assets/img/icons/boats/boatIdeal.svg';
import keelmerc from 'assets/img/icons/boats/boatKeelMerc.svg';
import laser from 'assets/img/icons/boats/boatLaser.svg';
import mercury from 'assets/img/icons/boats/boatCenterboardMerc.svg';
import windsurf from 'assets/img/icons/boats/boatWindsurf.svg';
import sonar from 'assets/img/icons/boats/boatSonar.svg';
import IconButton from 'components/wrapped/IconButton';
import boatUnselected from 'assets/img/icons/boats/boatUnselected.svg';
import { option } from 'fp-ts';
import RadioGroup from 'components/wrapped/RadioGroup';
import { SelectInput } from 'components/wrapped/Input';
import { makeBoatTypesHR } from "../../../pages/dockhouse/signouts/functions";
import { BoatsContext } from 'async/providers/BoatsProvider';
import { BoatTypesType } from 'async/staff/dockhouse/boats';

export type BoatIconProps = {
    boatId: option.Option<number>
    setBoatId: (boatId: option.Option<number>) => void
}

export const BoatIcons = [{
    hr: "Mercury",
    key: "C",
    src: mercury
},
{
    hr: "Keel Mercury",
    key: "F",
    src: keelmerc
},
{
    hr: "Sonar",
    key: "S",
    src: sonar
},
{
    hr: "Ideal 18",
    key: "I",
    src: ideal
},
{
    hr: "420",
    key: "4",
    src: b420
},
{
    hr: "Laser",
    key: "L",
    src: laser
},
{
    hr: "Windsurfer",
    key: "W",
    src: windsurf
},
{
    hr: "Stand Up Paddleboard",
    key: "P",
    src: sup
},
{
    hr: "Kayak",
    key: "K",
    src: kayak
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

export function BoatSelect(props: BoatIconProps & {label?: string, autoWidth?: boolean, nowrap?: boolean, fullWidth?: boolean, useBoatImage?: boolean, className?: string, tabIndex?: number, inputClassName?: string}){
    const boatTypes = React.useContext(BoatsContext);
    const boatTypesSelectOptions = React.useMemo(() => makeBoatTypesHR(boatTypes), [boatTypes]);
    const [boatsByHR, boatsById] = boatTypesMapped(boatTypes);
    return <SelectInput tabIndex={props.tabIndex} label={props.label} controlledValue={props.boatId} updateValue={props.setBoatId} validationResults={[]} selectOptions={boatTypesSelectOptions} selectNone={false} nowrap={props.nowrap} autoWidth={props.autoWidth} fullWidth={props.fullWidth}
    makeButton={props.useBoatImage ? (a) =>  <img src={a.value.isSome() ? boatIconsByHR[boatsById[a.value.value].boatName].src : boatUnselected} className={props.inputClassName}/> : undefined} customStyle={props.useBoatImage} className={props.className} notWhiteBG />
}