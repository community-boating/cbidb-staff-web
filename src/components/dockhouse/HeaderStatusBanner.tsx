import * as React from 'react';
import { Flag, FlagStatusIcon, FlagStatusIcons } from './FlagStatusIcons';
import boat from 'assets/img/icons/header/boat.svg';
import * as moment from "moment";
import asc from 'app/AppStateContainer';
import { logout } from 'async/logout';
import Menu from 'components/wrapped/Menu';

import settings from 'assets/img/icons/header/settings.svg';

type HeaderFlagProps = {flag: Flag};

type HeaderImageProps = {src: string, half?: boolean};

type HeaderTimeProps = {time: moment.Moment};

type HeaderSunsetProps = {sunset: moment.Moment};

type HeaderWindProps = {speed: number, direction: string};

type Announcement = {title: string, message: string};

type HeaderAnnouncementsProps = {high: Announcement, medium: Announcement, low: Announcement[]};

type HeaderAnnouncementProps = Announcement & { className: string};

type HeaderButtonProps = {
    src: any,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

type HeaderButtonsProps = {
    buttons: HeaderButtonProps[];
}

type HeaderGridProps = {
    cols?: boolean,
    children: React.ReactNode
}

type HeaderProps = HeaderFlagProps & HeaderTimeProps & HeaderSunsetProps & HeaderWindProps & HeaderAnnouncementsProps & HeaderButtonsProps;

const TIME_FORMAT = "HH:mm";

export default function HeaderStatusBanner(props: HeaderProps) {
    return (<div className="flex flex-row h-status_banner_height gap-1 mt-primary">
        <HeaderGrid>
            <CBIBoatIcon {...props}/>
            <FlagIcon {...props}/>
        </HeaderGrid>
        <HeaderTime {...props}/>
        <HeaderSunset {...props}/>
        <HeaderWindSpeed {...props}/>
        <HeaderWindDirection {...props}/>
        <HeaderAnnouncements {...props}/>
        <HeaderButtons {...props}/>
        <HeaderLogout/>
        </div>);
}

function HeaderLogout(props){
    const sudo = asc.state.sudo;
    //onMouseLeave={() => {if(state.open) setState(closePopover)}}
    
    const menuItems: React.ReactNode[] = [];

    if(sudo){
        menuItems.push(<p>Superuser Active</p>);
        menuItems.push(<a onClick={(e) => {asc.updateState.setSudo(false);e.preventDefault();}}>Suspend Superpowers</a>);
    }else{
        menuItems.push(<a onClick={(e) => {asc.sudoModalOpener();e.preventDefault();}}>Elevate Session</a>);
    }

    menuItems.push(<a onClick={(e) => {e.preventDefault(); logout.send(); console.log("logged out");}}>Logout</a>);

    return <Menu title={<HeaderImage half={true} src={settings}/>} items={menuItems}/>;
}

function HeaderGrid(props: HeaderGridProps){
    return <div className={"shrink-0 h-full grid lg:grid-rows-none lg:grid-cols-none lg:flex " + (props.cols ? "grid-rows-2 grid-cols-2" : "grid-rows-2 grid-cols-1")}>{props.children}</div>;
}

function HeaderButtons(props: HeaderButtonsProps){
    return <HeaderGrid cols={true}>{props.buttons.map((a, i) => <HeaderButton {...a} key={i}/>)}</HeaderGrid>;
}

function HeaderButton(props: HeaderButtonProps){
    return <div className="object-cover"><input type="image" className="h-full w-full" src={props.src}/></div>;
}

function HeaderAccountment(props: HeaderAnnouncementProps){
    return <h1 className={"leading-none text-status_banner_height_half " + props.className}>{props.title} : {props.message}</h1>
}

function HeaderAnnouncements(props: HeaderAnnouncementsProps){
    return (<div className="grow-[1] shrink-[10] overflow-x-hidden overflow-y-hidden">
        <div className="overflow-x-scroll overflow-y-hidden hidden-scrollbar">
            <div className="whitespace-nowrap">
                <HeaderAccountment {...props.high} className="text-red-500 font-medium"/>
            </div>
        </div>
        <div className="overflow-x-scroll overflow-y-hidden hidden-scrollbar">
            <div className="flex flex-row whitespace-nowrap">
                <HeaderAccountment {...props.medium} className="text-yellow-500 font-medium"/>
                {props.low.map((a, i) => <HeaderAccountment {...a} key={i} className="text-green-500 font-medium"/>)}
            </div>
        </div>
    </div>);
}

function HeaderWindDirection(props: HeaderWindProps){
    return (<span>
        <h1 className="text-status_banner_height_quarter font-thin">KTS</h1>
        <h1 className="text-status_banner_height_half font-bold">{props.direction}</h1>
    </span>)
}

function HeaderWindSpeed(props: HeaderWindProps){
    return (
        <h1 className="text-status_banner_height leading-none font-bold">{props.speed}</h1>
    );
}

function HeaderSunset(props: HeaderSunsetProps){
    return (<span className="text-status_banner_height_half leading-none whitespace-nowrap font-medium text-right">
        <h1>Sunset: {props.sunset.format(TIME_FORMAT)}</h1>
        <h1>Call In: {props.sunset.subtract(30, "minutes").format(TIME_FORMAT)}</h1>
    </span>);
}

function HeaderTime(props: HeaderTimeProps){
    return <h1 className="text-status_banner_height leading-none font-bold">{props.time.format(TIME_FORMAT)}</h1>;
}

function CBIBoatIcon(props: HeaderProps){
    return <HeaderImage {...props} src={boat}/>;
}

function FlagIcon(props: HeaderProps){
    return <FlagStatusIcon flag={props.flag}></FlagStatusIcon>;
}

function HeaderImage(props: HeaderImageProps){
    return <div className={(props.half ? "h-[50%]" : "h-full")}><img className="h-full w-full" src={props.src}/></div>;
}