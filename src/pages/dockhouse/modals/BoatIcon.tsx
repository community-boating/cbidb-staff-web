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

export type BoatIconProps = {
}

const BoatIcons = [{
    hr: "SUP",
    src: sup
},
{
    hr: "Kayak",
    src: kayak
},
{
    hr: "420",
    src: b420
},
{
    hr: "Ideal",
    src: ideal
},
{
    hr: "Keel Merc",
    src: keelmerc
},
{
    hr: "Laser",
    src: laser
},
{
    hr: "Sonar",
    src: sonar
},
{
    hr: "Mercury",
    src: mercury
},
{
    hr: "Windsurf",
    src: windsurf
}]


export default function(props: BoatIconProps){
    return (<div className="flex flex-row gap-5">
        {BoatIcons.map((a, i) => <IconButton key={i} src={a.src} className="max-h-[100px]"/>)}
    </div>
    )
}