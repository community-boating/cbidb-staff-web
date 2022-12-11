import * as React from 'react';

export const FlagStatusIcons = {
    "R":{fill:"#a61e1e", sortOrder:3, hr:"Red"},
    "G":{fill:"#007d1d", sortOrder:5, hr:"Green"},
    "Y":{fill:"#ffbf1c", sortOrder:4, hr:"Yellow"},
    "B":{fill:"#000000", sortOrder:2, hr:"Black"},
    "W":{fill:"#ffffff", sortOrder:1, hr:"White"},
}

export type Flag = keyof typeof FlagStatusIcons;

export function FlagStatusIcon(props: {flag: Flag}){
    const fill = FlagStatusIcons[props.flag].fill;
    return (
        <svg stroke-miterlimit="10" style={{fillRule:'nonzero',clipRule:'evenodd',strokeLinecap:'round',strokeLinejoin:'round'}} version="1.1" viewBox="0 0 144 144" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs/>
            <g id="Layer-1">
                <g opacity="1">
                    <path d="M144 30.0733C144 30.0733 132.9 25.8325 120.144 32.9975C110.881 38.2002 101.443 51.2711 91.3694 55.8014C67.8418 66.3827 63.6733 48.5217 45.2942 57.1621C26.9151 65.8024 24.2671 83.362 24.2671 83.362C24.2671 83.362 21.2481 62.8731 16.6172 43.9686C11.9864 25.0641 5.74362 7.74409 5.74362 7.74409C5.74362 7.74409 18.5173 0 40.0817 0C61.1918 0 57.8503 18.2179 83.5515 22.8855C94.578 24.888 108.674 18.0113 119.539 18.5638C134.092 19.3039 144 30.0733 144 30.0733Z" fill={fill} fill-rule="nonzero" opacity="1" stroke="none"/>
                    <path d="M19.7719 74.675C10.8663 37.8213 4.05491 7.85542 4.55823 7.7444C5.06156 7.63338 12.689 37.4192 21.5946 74.2729C30.5002 111.127 37.3116 141.092 36.8083 141.203C36.305 141.315 28.6775 111.529 19.7719 74.675Z" fill={fill} fill-rule="nonzero" opacity="1" stroke="none"/>
                </g>
            </g>
        </svg>
    );
}