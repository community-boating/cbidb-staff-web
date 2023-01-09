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
import asc from 'app/AppStateContainer';
import RadioGroup from 'components/wrapped/RadioGroup';
import { ValidatedSelectInput } from 'components/wrapped/Input';
import { makeBoatTypesHR } from '../signouts/SignoutsTablesPage';
export type BoatIconProps = {
    boatId: option.Option<number>
    setBoatId: (boatId: option.Option<number>) => void
}

const BoatIcons = [{
    hr: "Stand Up Paddleboard",
    key: "P",
    src: sup
},
{
    hr: "Kayak",
    key: "Y",
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
    key: "K",
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
    key: "M",
    src: mercury
},
{
    hr: "Windsurfer",
    key: "W",
    src: windsurf
}]

export default function(props: BoatIconProps){
    const boatsByHR = {};
    const boatsById = {};
    asc.state.boatTypes.forEach((a) => {
        boatsByHR[a.boatName] = a;
        boatsById[a.boatId] = a;
    });
    return (
    <RadioGroup value={props.boatId} setValue={(value) => props.setBoatId(value)} className="flex flex-row gap-5" keyListener={(key) => {
        const boat = BoatIcons.filter((a) => a.key.toLowerCase() == key.toLowerCase());
        if(boat.length > 0){
            props.setBoatId(option.some(boatsByHR[boat[0].hr].boatId));
        }
    }} makeChildren={BoatIcons.map((a, i) => ({
        value: boatsByHR[a.hr].boatId,
        makeNode: (checked) => <IconButton key={i} src={a.src} onClick={() => props.setBoatId(option.some(boatsByHR[a.hr].boatId))} className={"min-w-[100px] text-black rounded-2 border border-[#00507d]" + (checked? " bg-blue-200 border-gray-200" : "")}/>
    })
    )}/>
    )
}

export function BoatSelect(props: BoatIconProps){
    const boatTypesHR = React.useMemo(() => makeBoatTypesHR(asc.state.boatTypes), [asc.state.boatTypes]);
    return <ValidatedSelectInput initValue={props.boatId} updateValue={props.setBoatId} validationResults={[]} selectOptions={boatTypesHR} selectNone={false} label={"Boat Type:"}></ValidatedSelectInput>
}