import { Popover } from 'components/wrapped/Popover';
import * as React from 'react';
import settings from 'assets/img/icons/header/settings.svg';
import { DirectionX } from 'components/wrapped/Menu';

export enum LayoutDirection {
    VERTICAL = "layout-vertical",
    HORIZONTAL = "layout-horizontal"
}

export enum FlexSize{
    S_0 = "grow-0",
    S_1 = "grow-[1]",
    S_2 = "grow-[2]",
    S_3 = "grow-[3]",
    S_4 = "grow-[4]",
    S_5 = "grow-[5]",
    S_6 = "grow-[6]",
    S_7 = "grow-[7]",
    S_8 = "grow-[8]",
    S_9 = "grow-[9]",
    S_10 = "grow-[10]",
    S_25 = "grow-[25]",
    S_50 = "grow-[50]",
    S_75 = "grow-[75]",
    S_100 = "grow-[100]",
    S_1000 = "grow-[1000]"
}

type CardLayoutChildProps = {
    weight?: FlexSize,
    total?: number,
    parentDirection?: LayoutDirection
};

export type CardProps = CardLayoutChildProps & {
    children?: React.ReactNode,
    title: React.ReactNode,
    className?: string
}

export function Card(props: CardProps){
    return <div className={(props.weight || FlexSize.S_1) + " rounded-md flex flex-col basis-0 bg-card p-card " + (props.className || "")}><h2 className="text-xl font-bold leading-none w-full">{props.title}</h2>{props.children}</div>;
}

type CardLayoutProps = CardLayoutChildProps & {
    children?: React.ReactNode
    direction: LayoutDirection
    className?: string
}

export function CardLayout(props: CardLayoutProps){
    var total = 0;
    return <div className={(props.className ? (props.className + " ") : "" ) + (props.direction == LayoutDirection.HORIZONTAL ? "flex flex-row w-full basis-0 space-x-primary " : "flex flex-col h-full basis-0 space-y-primary ") + (props.weight || FlexSize.S_1)}>{props.children}</div>;
}

export function CardTitleWithGearDropdown(props: {title: React.ReactNode, gearMenu?: React.ReactNode}){
    return <div className="w-full">
            <div className="inline-block">
                <p>{props.title}</p>
            </div>
            <div className="inline-block float-right">
                <Popover makeChildren={() => props.gearMenu} hoverProps={{}} openDisplay={<img className="h-[20px]" src={settings}/>} x={DirectionX.RIGHT}/>
            </div>
        </div>
}