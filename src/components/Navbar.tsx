import { logout } from "../async/logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons'

import { Dropdown, Navbar, Nav } from "react-bootstrap";
import asc from "../app/AppStateContainer";

import useSidebar from "../hooks/useSidebar";

const NavbarComponent = () => {
	const { isOpen, setIsOpen } = useSidebar();

	const sudo = asc.state.sudo;

	const ifSudo = (
		sudo
		? <Dropdown.Item>
			<span className="align-middle" onClick={() => asc.updateState.setSudo(false)}>Suspend Superpowers</span>
		</Dropdown.Item>
		: <Dropdown.Item onClick={e => {
			e.preventDefault();
			asc.sudoModalOpener();
		}}>
			<span className="align-middle">Elevate Session</span>
		</Dropdown.Item>
	);
	return (
		<Navbar variant="light" expand className="navbar-bg">
			<span
				className="sidebar-toggle d-flex"
				onClick={() => {
					setIsOpen(!isOpen);
				}}
			>
				<i className="hamburger align-self-center" />
			</span>

			<Navbar.Collapse role="">
				<Nav className="navbar-align">
				<Dropdown className="nav-item" align="end">
					<span className="d-none d-sm-inline-block">
						<Dropdown.Toggle as="a" className="nav-link">
							<FontAwesomeIcon icon={sudo ? faUserShield : faUser} />
						</Dropdown.Toggle>
					</span>
					<Dropdown.Menu>
						{ifSudo}
						<Dropdown.Item onClick={e => {
							e.preventDefault();
							logout.send({ type: "json", jsonData: {} }).then(() => {
								asc.updateState.login.logout()
							})
						}}>
							<span className="align-middle">Sign out</span>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavbarComponent;
