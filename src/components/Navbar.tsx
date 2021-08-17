import * as React from "react";
import { connect } from "react-redux";
import { toggleSidebar } from "../redux/actions/sidebarActions";
import { logout } from "../async/logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons'

import {
	Navbar,
	Nav,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	ListGroup,
	ListGroupItem,
	Row,
	Col,
} from "reactstrap";
import asc from "../app/AppStateContainer";



const NavbarComponent = ({ dispatch }) => {
	const sudo = asc.state.sudo;

	const ifSudo = (
		sudo
		? <DropdownItem>
			<span className="align-middle" onClick={() => asc.updateState.setSudo(false)}>Suspend Superpowers</span>
		</DropdownItem>
		: <DropdownItem onClick={e => {
			e.preventDefault();
			asc.sudoModalOpener();
		}}>
			<span className="align-middle">Elevate Session</span>
		</DropdownItem>
	);
	return (
		<Navbar color="white" light expand>
			<span
				className="sidebar-toggle d-flex mr-2"
				onClick={() => {
					dispatch(toggleSidebar());
				}}
			>
				<i className="hamburger align-self-center" />
			</span>

			<Nav className="ml-auto" navbar>
				<UncontrolledDropdown nav inNavbar className="mr-2">
					<DropdownToggle nav caret className="nav-flag">
						<FontAwesomeIcon icon={sudo ? faUserShield : faUser} />
					</DropdownToggle>
					<DropdownMenu right>
					{ifSudo}
					<DropdownItem onClick={e => {
						e.preventDefault();
						logout.send({ type: "json", jsonData: {} }).then(() => {
							asc.updateState.login.logout()
						})
					}}>
						<span className="align-middle">Sign out</span>
					</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</Nav>
		</Navbar>
	);
};

export default connect((store: any) => ({
	app: store.app
}))(NavbarComponent);
