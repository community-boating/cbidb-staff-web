import * as React from "react";
import { connect } from "react-redux";
import { toggleSidebar } from "../redux/actions/sidebarActions";

import {
  Navbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import {
  PieChart,
  Settings,
  User,
} from "react-feather";

const NavbarComponent = ({ dispatch }) => {
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
          <UncontrolledDropdown nav inNavbar>
            <span className="d-inline-block d-sm-none">
              <DropdownToggle nav caret>
                <Settings size={18} className="align-middle" />
              </DropdownToggle>
            </span>
            <span className="d-none d-sm-inline-block">
              <DropdownToggle nav caret>
                <span className="text-dark">Menu</span>
              </DropdownToggle>
            </span>
            <DropdownMenu right>
              <DropdownItem>
                <User size={18} className="align-middle mr-2" />
                Profile
              </DropdownItem>
              <DropdownItem>
                <PieChart size={18} className="align-middle mr-2" />
                Analytics
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Settings & Privacy</DropdownItem>
              <DropdownItem>Help</DropdownItem>
              <DropdownItem>Sign out</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
    </Navbar>
  );
};

export default connect((store: any) => ({
  app: store.app
}))(NavbarComponent);
