import * as React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { dhRoutes } from 'app/routes/routes';

function orElse(a: number, b: number){
    if(a == undefined){
        return b;
    }
    return a;
}

function DockHouseNav(props: {history: History<any>}){
    const navOptions = dhRoutes.filter((a) => a.navOrder != -1)
    .sort((a, b) => orElse(a.navOrder, 1) - orElse(b.navOrder, 1))
    .map((a, i) => <a className={a.pathWrapper.path == props.history.location.pathname ? "active" : "" } onClick={(b) => {history.pushState({}, "", a.pathWrapper.path); history.go();}} key={i}>{a.navTitle}</a>);
    return <nav className="docknav">{navOptions}</nav>;
}

export default connect((store: any) => ({
	app: store
}))(DockHouseNav);