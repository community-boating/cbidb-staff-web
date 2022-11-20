import * as React from 'react';
import { Flag, FlagStatusIcons } from '../FlagStatusIcons';
import CBI_boat from 'assets/img/CBI_boat.jpg';
import * as moment from "moment";

type HeaderFlagProps = {flag: Flag};

type HeaderImageProps = {src: string};

type HeaderTimeProps = {time: moment.Moment};

type HeaderSunsetProps = {sunset: moment.Moment};

type HeaderWindProps = {speed: number, direction: string};

type Announcement = {title: string, message: string};

type HeaderAnnouncementsProps = {high: Announcement, medium: Announcement, low: Announcement[]};

type HeaderAnnouncementProps = Announcement & { className: string};

type HeaderButtonProps = {
    short: string,
    long: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

type HeaderButtonsProps = {
    buttons: HeaderButtonProps[];
}

type HeaderProps = HeaderFlagProps & HeaderTimeProps & HeaderSunsetProps & HeaderWindProps & HeaderAnnouncementsProps & HeaderButtonsProps;

const TIME_FORMAT = "HH:mm";

export default function Header(props: HeaderProps) {
    return (<table className="dockhouse_header"><tbody><tr>
        <td><CBIBoatIcon {...props}/></td>
        <td><FlagIcon {...props}/></td>
        <td><HeaderTime {...props}/></td>
        <td><HeaderSunset {...props}/></td>
        <td><HeaderWindSpeed {...props}/></td>
        <td><HeaderWindDirection {...props}/></td>
        <td><HeaderAnnouncements {...props}/></td>
        <td><HeaderButtons {...props}/></td>
        <td><HeaderLogout/></td>
        </tr></tbody></table>);
}

function HeaderLogout(props){
    return <button className="logout"><h2>DOCK</h2><h3>Logout</h3></button>
}

function HeaderButtons(props: HeaderButtonsProps){
    return <div className="buttons">{props.buttons.map((a) => <HeaderButton {...a}/>)}</div>;
}

function HeaderButton(props: HeaderButtonProps){
    return <button onClick={props.onClick}><h2>{props.short}</h2><h3>{props.long}</h3></button>;
}

function HeaderAccountment(props: HeaderAnnouncementProps){
    return <h2 className={props.className}>{props.title} : {props.message}</h2>
}

function HeaderAnnouncements(props: HeaderAnnouncementsProps){
    return (<div className="announcements">
        <HeaderAccountment {...props.high} className="high"/>
        <HeaderAccountment {...props.medium} className="medium"/>
        <div className="scroll">
            {props.low.map((a, i) => <HeaderAccountment {...a} key={i} className="low"/>)}
        </div>
    </div>);
}

function HeaderWindDirection(props: HeaderWindProps){
    return (<span className="wind">
        <h3>KTS</h3>
        <h2>{props.direction}</h2>
    </span>)
}

function HeaderWindSpeed(props: HeaderWindProps){
    return (<span className="wind">
        <h1>{props.speed}</h1>
    </span>);
}

function HeaderSunset(props: HeaderSunsetProps){
    return (<span className="time">
        <h2>Sunset: {props.sunset.format(TIME_FORMAT)}</h2>
        <h2>Call In: {props.sunset.subtract(30, "minutes").format(TIME_FORMAT)}</h2>
    </span>);
}

function HeaderTime(props: HeaderTimeProps){
    return <span className="time"><h1>{props.time.format(TIME_FORMAT)}</h1></span>;
}

function CBIBoatIcon(props: HeaderProps){
    return <HeaderImage {...props} src={CBI_boat}/>;
}

function FlagIcon(props: HeaderProps){
    const src = FlagStatusIcons[props.flag].src;
    return <HeaderImage {...props} src={src}/>;
}

function HeaderImage(props: HeaderImageProps){
    return <img src={props.src}/>;
}