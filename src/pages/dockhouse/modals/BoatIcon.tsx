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
export type BoatIconProps = {
    boatId: option.Option<number>
    setBoatId: (boatId: number) => void
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
    const currentBoatHR = (boatsById[props.boatId.getOrElse(-1)] || {}).boatName;
    return (
    <RadioGroup value={currentBoatHR} setValue={(value) => props.setBoatId(boatsByHR[value].boatId)} className="flex flex-row gap-5" children={BoatIcons.map((a, i) => ({
        value: a.hr,
        makeNode: (checked) => <IconButton key={i} src={a.src} className={"max-h-[100px] text-black rounded-2 border border-[#00507d]" + (checked? " bg-blue-200 border-gray-200" : "")} onClick={() => {
            props.setBoatId(boatsByHR[a.hr].boatId);
        }}/>
    })
    )}/>
    )
}