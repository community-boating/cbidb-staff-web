import * as React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { dhRoutes } from 'app/routes/routes';
import { NavLink } from 'react-router-dom';
import { linkWithAccessControl } from 'core/LinkInterceptor';

function orElse(a: number, b: number){
    if(a == undefined){
        return b;
    }
    return a;
}

function HeaderNavbar(props: {history: History<any>}){
    const navOptions = dhRoutes.filter((a) => a.navOrder != -1)
    .sort((a, b) => orElse(a.navOrder, 1) - orElse(b.navOrder, 1))
    .map((a, i) => <NavLink to={a.pathWrapper.path || a.getPathFromArgs({})} key={i} activeClassName="font-bold" onClick={e => {
        e.preventDefault();
        linkWithAccessControl(props.history, a, {}, (a && a.requireSudo), a.pathWrapper.path);
    }}><h1 className="inline text-4xl">{(i > 0 ? " | " : "") + a.navTitle}</h1></NavLink>);
    return <nav className="">{navOptions}</nav>;
}

export default connect((store: any) => ({
	app: store
}))(HeaderNavbar);