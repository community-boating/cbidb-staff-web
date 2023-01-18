import * as React from 'react';
import { History } from 'history';
import { dhRoutes } from 'app/routes/routes';
import { NavLink } from 'react-router-dom';
import { linkWithAccessControl } from 'core/LinkInterceptor';
import Menu, { DirectionX } from 'components/wrapped/Menu';
import { AppStateContext } from 'app/state/AppStateContext';

function orElse(a: number, b: number){
    if(a == undefined){
        return b;
    }
    return a;
}

export default function HeaderNavbarFull(props: {history: History<any>}){
    const asc = React.useContext(AppStateContext);
    const navOptions = dhRoutes.filter((a) => a.navOrder != -1)
    .sort((a, b) => orElse(a.navOrder, 1) - orElse(b.navOrder, 1))
    .map((a, i) => (<span key={i}>
    <h1 className="inline text-xl font-black">{(i > 0 ? " | " : "")}</h1>
    <NavLink className="underline" to={a.pathWrapper.path || a.getPathFromArgs({})} activeClassName="no-underline text-boathouseblue font-bold" exact={true} onClick={e => {
        e.preventDefault();
        linkWithAccessControl(props.history, a, {}, asc, (a && a.requireSudo), a.pathWrapper.path);
    }}><h1 className="inline text-2xl">{a.navTitle}</h1></NavLink></span>));
    return <span className="hidden lg:block"><hr className="border-t-1 border-black mb-[2px] mt-[5px]"/><nav className="bg-card pl-card">{navOptions}</nav></span>;
}

export function HeaderNavbarDropdown(props: {history: History<any>}){
    const asc = React.useContext(AppStateContext);
    const navOptions = dhRoutes.filter((a) => a.navOrder != -1)
    .sort((a, b) => orElse(a.navOrder, 1) - orElse(b.navOrder, 1))
    .map((a, i) => <span key={i}>
    <NavLink to={a.pathWrapper.path || a.getPathFromArgs({})} activeClassName="underline" onClick={e => {
        e.preventDefault();
        linkWithAccessControl(props.history, a, {}, asc, (a && a.requireSudo), a.pathWrapper.path);
    }}><h1 className="text-md font-light">{a.navTitle}</h1></NavLink></span>);
    return <Menu title={<h1 className="text-status_banner_height_half">{"{}"}</h1>} x={DirectionX.LEFT} items={navOptions}></Menu>
}