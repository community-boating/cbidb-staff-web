import * as React from "react";
import { connect } from "react-redux";
import { logout } from "../async/logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons'

import asc from "../app/AppStateContainer";
import DockHouseNav from "./DockHouseNav";

const NavHeader = (props: { history, dispatch }) => {
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
	return (
		<div className="navHeader">
			<table className="">
				<tbody>
					
				</tbody>
			</table>
			<DockHouseNav history={props.history}></DockHouseNav>
			<nav className="ml-auto">
				<div className="mr-2">
					<div className="nav-flag">
						<FontAwesomeIcon icon={sudo ? faUserShield : faUser} />
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
		</div>
	);
};

export default connect((store: any) => ({
	app: store.app
}))(NavHeader);
