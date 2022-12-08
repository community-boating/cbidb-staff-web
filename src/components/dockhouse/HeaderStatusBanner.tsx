import * as React from 'react';
import { Flag, FlagStatusIcons } from './FlagStatusIcons';
import boat from 'assets/img/icons/header/boat.svg';
import * as moment from "moment";
import asc from 'app/AppStateContainer';
import { logout } from 'async/logout';
import Menu from 'components/wrapped/Menu';

type HeaderFlagProps = {flag: Flag};

type HeaderImageProps = {src: string};

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

type HeaderProps = HeaderFlagProps & HeaderTimeProps & HeaderSunsetProps & HeaderWindProps & HeaderAnnouncementsProps & HeaderButtonsProps;

const TIME_FORMAT = "HH:mm";

export default function HeaderStatusBanner(props: HeaderProps) {
    return (<div className="flex flex-row h-[8vh]">
        <CBIBoatIcon {...props}/>
        <FlagIcon {...props}/>
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

    menuItems.push(<a onClick={(e) => {e.preventDefault(); logout.send();}}>Elevate Session</a>);

    return <Menu title="*" items={menuItems}/>;
}

function HeaderButtons(props: HeaderButtonsProps){
    return <div className="flex flex-row">{props.buttons.map((a, i) => <HeaderButton {...a} key={i}/>)}</div>;
}

function HeaderButton(props: HeaderButtonProps){
    return <button onClick={props.onClick} className="h-full"><img className="h-full" src={props.src}></img></button>;
}

function HeaderAccountment(props: HeaderAnnouncementProps){
    return <h2 className={props.className}>{props.title} : {props.message}</h2>
}

function HeaderAnnouncements(props: HeaderAnnouncementsProps){
    return (<div className="grow-[1]">
        <div className="scroll">
            <div className="scroll-inner">
                <HeaderAccountment {...props.high} className="high"/>
            </div>
        </div>
        <div className="scroll">
            <div className="scroll-inner">
                <HeaderAccountment {...props.medium} className="medium"/>
                {props.low.map((a, i) => <HeaderAccountment {...a} key={i} className="low"/>)}
            </div>
        </div>
    </div>);
}

function HeaderWindDirection(props: HeaderWindProps){
    return (<span>
        <h3 className="text-[2vh]">KTS</h3>
        <h2 className="text-[4vh]">{props.direction}</h2>
    </span>)
}

function HeaderWindSpeed(props: HeaderWindProps){
    return (
        <h1 className="text-[8vh] leading-none">{props.speed}</h1>
    );
}

function HeaderSunset(props: HeaderSunsetProps){
    return (<span className="text-[4vh] leading-none whitespace-nowrap">
        <h2>Sunset: {props.sunset.format(TIME_FORMAT)}</h2>
        <h2>Call In: {props.sunset.subtract(30, "minutes").format(TIME_FORMAT)}</h2>
    </span>);
}

function HeaderTime(props: HeaderTimeProps){
    return <h1 className="text-[8vh] leading-none">{props.time.format(TIME_FORMAT)}</h1>;
}

function CBIBoatIcon(props: HeaderProps){
    return <HeaderImage {...props} src={boat}/>;
}

function FlagIcon(props: HeaderProps){
    const src = FlagStatusIcons[props.flag].src;
    return <HeaderImage {...props} src={src}/>;
}

function HeaderImage(props: HeaderImageProps){
    return <span className="h-full"><img src={props.src} className="h-full"/></span>;
}