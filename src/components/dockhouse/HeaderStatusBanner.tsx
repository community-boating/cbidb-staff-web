import * as React from 'react';
import { Flag, FlagStatusIcon, FlagStatusIcons } from './FlagStatusIcons';
import boat from 'assets/img/icons/boat.svg';
import * as moment from "moment";
import { logout } from 'async/logout';
import Menu, { ButtonMenu, DirectionX } from 'components/wrapped/Menu';

import settings from 'assets/img/icons/header/settings.svg';
import { AppStateContext } from 'app/state/AppStateContext';
import { DHGlobals, MessagePriority } from 'async/staff/dockhouse/dh-globals';

type HeaderFlagProps = {flag: Flag, setFlag: (flag: Flag) => void};

type HeaderImageProps = {src: string, half?: boolean};

type HeaderTimeProps = {time: moment.Moment};

type HeaderSunsetProps = {sunset: moment.Moment};

type HeaderWindProps = {speed: number, direction: string};

type Announcement = DHGlobals['announcements'][number]

type HeaderAnnouncementsProps = {announcements: Announcement[]};

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

type HeaderProps = HeaderFlagProps & HeaderTimeProps & HeaderSunsetProps & HeaderWindProps & HeaderAnnouncementsProps & HeaderButtonsProps & {
    dropdownNavbar: React.ReactNode
};

export default function HeaderStatusBanner(props: HeaderProps) {
    return (<div className="flex flex-row h-status_banner_height gap-1 mt-primary">
        <div className="lg:hidden">{props.dropdownNavbar}</div>
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
    const asc = React.useContext(AppStateContext);
    const sudo = asc.state.sudo;
    //onMouseLeave={() => {if(state.open) setState(closePopover)}}
    
    const menuItems: React.ReactNode[] = [];

    if(sudo){
        menuItems.push(<p>Superuser Active</p>);
        menuItems.push(<a onClick={(e) => {asc.stateAction.setSudo(false);e.preventDefault();}}>Suspend Superpowers</a>);
    }else{
        menuItems.push(<a onClick={(e) => {asc.state.sudoModalOpener();e.preventDefault();}}>Elevate Session</a>);
    }

    menuItems.push(<a onClick={(e) => {
        e.preventDefault(); logout.send(asc).then(() => {
            asc.stateAction.login.logout()
        })
    }}>Logout</a>);

    return <Menu className="h-full" title={<HeaderImage half={true} src={settings}/>} x={DirectionX.RIGHT} items={menuItems}/>;
}

function HeaderGrid(props: HeaderGridProps){
    return <div className={"shrink-0 h-full grid lg:grid-rows-none lg:grid-cols-none lg:flex " + (props.cols ? "grid-rows-2 grid-cols-2" : "grid-rows-2 grid-cols-1")}>{props.children}</div>;
}

function HeaderButtons(props: HeaderButtonsProps){
    return <HeaderGrid cols={true}>{props.buttons.map((a, i) => <HeaderButton {...a} key={i}/>)}</HeaderGrid>;
}

function HeaderButton(props: HeaderButtonProps){
    return <div className="object-cover"><input type="image" className="h-full" src={props.src}/></div>;
}

function HeaderAccountment(props: HeaderAnnouncementProps){
    return <h1 className={"leading-none text-status_banner_height_half " + props.className}>{props.message}</h1>
}

function ScrollingDiv(props: {children?: React.ReactNode}){
    const [scrolling, setScrolling] = React.useState(false);
    const outerRef = React.createRef<HTMLDivElement>();
    const innerRef = React.createRef<HTMLDivElement>();
    const textMeasureRef = React.createRef<HTMLDivElement>();
    const updateScrolling = () => {
        setScrolling((textMeasureRef.current.clientWidth) >= ( outerRef.current.clientWidth));
    }
    const updateScrollClasses = () => {
        innerRef.current.className = "inline-block"
        if(!scrolling){
            return;
        }
        innerRef.current.clientWidth.toString();
        innerRef.current.className = "inline-block left-full transition transform ease-linear -translate-x-[50%] + duration-[5000ms]";
    }
    React.useEffect(() => {
        updateScrollClasses();
        if(scrolling){
            const id = setInterval(() => {
                updateScrollClasses();
            }, 5000);
            return () => {
                clearInterval(id);
            }
        }
    });
    const eventListener = (ev) => {
        updateScrolling();
    }
    React.useEffect(() => {
        window.addEventListener("resize", eventListener);
        return () => {
            window.removeEventListener("resize", eventListener);
        }
    });
    React.useEffect(() => {
        updateScrolling();
    }, [props.children]);
    return <div ref={outerRef} className="relative hidden-scrollbar whitespace-nowrap">
        <div ref={innerRef}>
            <div ref={textMeasureRef} className="inline-block pr-5">
                {props.children}
            </div> 
            <div className={"inline-block pr-5 " + (scrolling ? "" : "hidden")}>
                {props.children}
            </div>
        </div>
    </div>
}

function HeaderAnnouncements(props: HeaderAnnouncementsProps){
    return (<div className="grow-[1] shrink-[10] overflow-y-visible h-full min-w-[0] -z-20">
        <div className="overflow-x-hidden">
            <ScrollingDiv>
                <div className="whitespace-nowrap">
                    <HeaderAccountment {...props.announcements.filter((a) => a.priority == MessagePriority.HIGH)[0]} className="text-red-500 font-medium"/>
                </div>
            </ScrollingDiv>
            <ScrollingDiv>
                <div className="flex flex-row whitespace-nowrap" style={{overflowY: "visible !important" as any}}>
                    <HeaderAccountment {...props.announcements.filter((a) => a.priority == MessagePriority.MEDIUM)[0]} className="text-yellow-500 font-medium"/>
                    {props.announcements.filter((a) => a.priority == MessagePriority.LOW).map((a, i) => <HeaderAccountment {...a} key={i} className="text-green-500 font-medium pl-5"/>)}
                </div>
            </ScrollingDiv>
        </div>
    </div>);
}

function HeaderWindDirection(props: HeaderWindProps){
    return (<div className="whitespace-nowrap">
        <div className="h-status_banner_height_quarter font-light">
            <PositionedTitle value="KTS" size={QUARTER}/>
        </div>
        <div className="h-status_banner_height_half mt-status_banner_height_quarter">
            <PositionedTitle className="font-bold" sub={props.direction.substring(1)} subClass="font-light text-[10px]" value={props.direction.charAt(0)} size={WINDDIR}/>
        </div>
    </div>)
}

const TIME_FORMAT = "HH:mm";

function HeaderWindSpeed(props: HeaderWindProps){
    return <PositionedTitle className="font-bold" value={"" + props.speed} size={FULL}/>;
}

function HeaderSunset(props: HeaderSunsetProps){
    return (<div className="whitespace-nowrap font-bold">
        <div className="h-status_banner_height_half">
            <PositionedTitle value={"Sunset: " +  props.sunset.format(TIME_FORMAT)} size={HALF}></PositionedTitle>
        </div>
        <div className="h-status_banner_height_half text-right">    
            <PositionedTitle className="ml-auto" value={"Call In: " +  props.sunset.subtract(30, "minutes").format(TIME_FORMAT)} size={HALF}></PositionedTitle>
        </div>
    </div>);
}

const fontAlignHackClass = "inline-block align-text-top leading-none h-[0px]";

type TitleSize = {
    fontClass: string
    heightClass: string
    topClass: string
}

const FULL: TitleSize = {
    fontClass: "text-status_banner_font",
    heightClass: "height-status_banner_font",
    topClass: "-top-status_banner_font"
}

const HALF: TitleSize = {
    fontClass: "text-status_banner_font_half",
    heightClass: "height-status_banner_font_half",
    topClass: "-top-status_banner_font_half"
}

const QUARTER: TitleSize = {
    fontClass: "text-status_banner_font_quarter",
    heightClass: "height-status_banner_font_quarter",
    topClass: "-top-status_banner_font_quarter"
}

const WINDDIR: TitleSize = {
    fontClass: "text-status_banner_font_winddir",
    heightClass: "height-status_banner_font_winddir",
    topClass: "-top-status_banner_font_winddir"
}

function PositionedTitle(props: {value: string, size: TitleSize, className?: string, sub?: React.ReactNode, subClass?: string}){
    const fontClass = props.size
    return <div className="relative -z-10 top-full">
        <div className={"relative " + fontClass.topClass + " " + fontClass.heightClass + " " + fontClass.fontClass}>
            <h1 className={fontClass.fontClass + " " + fontAlignHackClass + (props.className ? (" " + props.className) : "")}>{props.value}</h1>
            {props.sub ? <h1 className={"inline-block align-text-sub leading-none h-[0px]" + (props.subClass ? (" " + props.subClass) : "")}>{props.sub}</h1> : undefined}
        </div>
    </div>;
}

function HeaderTime(props: HeaderTimeProps){
    const [time, setTime] = React.useState(props.time);
    const [blink, setBlink] = React.useState(false);
    React.useEffect(() => {
        const callback = () => {
            setTime(moment());
            setBlink((s) => !s);
        }
        const timerID = setInterval(callback, 1000);
        return () => {
            clearInterval(timerID);
        }
    }, []);
    return <div className="flex flex-row">
        <PositionedTitle className="font-bold" value={time.format("HH")} size={FULL}/>
        <PositionedTitle className={"font-bold" + (blink ? " invisible" : "")} value={":"} size={FULL}/>
        <PositionedTitle className="font-bold" value={time.format("mm")} size={FULL}/>
    </div>
    //return <h1 className="inline-block align-text-top text-status_banner_height leading-[1] font-bold">{time.format(TIME_FORMAT)}</h1>;
}

function CBIBoatIcon(props: HeaderProps){
    return <HeaderImage {...props} src={boat}/>;
}

const availableFlags = [FlagStatusIcons.R, FlagStatusIcons.Y, FlagStatusIcons.G, FlagStatusIcons.B];

function FlagIcon(props: HeaderProps){
    return <ButtonMenu className="h-full" itemClassName="h-[25%]" itemsClassName="h-[400%]" title={<FlagStatusIcon flag={props.flag} className="h-full"></FlagStatusIcon>} itemAction={props.setFlag} items={availableFlags.map((a) => ({node: <FlagStatusIcon className="h-full" flag={a}></FlagStatusIcon>, value: a}))}/>;
}

function HeaderImage(props: HeaderImageProps){
    return <div className={(props.half ? "h-[50%]" : "h-full")}><img className="h-full" src={props.src}/></div>;
}