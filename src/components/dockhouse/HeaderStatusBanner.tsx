import * as React from 'react';
import { Flag, FlagStatusIcons } from '../../pages/dockhouse/FlagStatusIcons';
import CBI_boat from 'assets/img/CBI_boat.jpg';
import * as moment from "moment";
import Popover, { closePopover, openPopover, PopoverLocation, PopoverWithLabel } from 'components/dockhouse/Popover';
import asc from 'app/AppStateContainer';
import { logout } from 'async/logout';

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

export default function HeaderStatusBanner(props: HeaderProps) {
    return (<table className="header-status-banner"><tbody><tr>
        <td><CBIBoatIcon {...props}/></td>
        <td><FlagIcon {...props}/></td>
        <td><HeaderTime {...props}/></td>
        <td><HeaderSunset {...props}/></td>
        <td><HeaderWindSpeed {...props}/></td>
        <td><HeaderWindDirection {...props}/></td>
        <td className="fill-remaining"><HeaderAnnouncements {...props}/></td>
        <td><HeaderButtons {...props}/></td>
        <td><HeaderLogout/></td>
        </tr></tbody></table>);
}

function HeaderLogout(props){
    const [state, setState] = React.useState({open: false, action: 0, location: PopoverLocation.RIGHT});
    const sudo = asc.state.sudo;

	const ifSudo = (
		sudo
		? <div>
			<span className="align-middle" onClick={() => asc.updateState.setSudo(false)}>Suspend Superpowers</span>
		</div>
		: <div onClick={e => {
			e.preventDefault();
			asc.sudoModalOpener();
		}}>
			<span className="align-middle">Elevate Session</span>
		</div>
	);
    //onMouseLeave={() => {if(state.open) setState(closePopover)}}
    return <PopoverWithLabel location={PopoverLocation.DOWN} label={<button className="logout" onClick={() => {if(!state.open)setState(openPopover)}}><h2>DOCK</h2><h3>Logout</h3></button>}>
        <nav className="ml-auto">
                <div className="mr-2">
                    <div className="nav-flag">
                        Sudo Enabled
                    </div>
                    <div>
                    {ifSudo}
                    <div onClick={e => {
                        e.preventDefault();
                        logout.send().then(() => {
                            asc.updateState.login.logout()
                        })
                    }}>
                        <span className="align-middle">Sign out</span>
                    </div>
                    </div>
                </div>
            </nav>
    </PopoverWithLabel>
}

function HeaderButtons(props: HeaderButtonsProps){
    return <div className="buttons">{props.buttons.map((a, i) => <span key={i}><HeaderButton {...a}/></span>)}</div>;
}

function HeaderButton(props: HeaderButtonProps){
    return <button onClick={props.onClick}><h2>{props.short}</h2><h3>{props.long}</h3></button>;
}

function HeaderAccountment(props: HeaderAnnouncementProps){
    return <h2 className={props.className}>{props.title} : {props.message}</h2>
}

function HeaderAnnouncements(props: HeaderAnnouncementsProps){
    return (<div className="announcements">
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
    return <div className="image"><img src={props.src}/></div>;
}