import * as React from "react";
import { connect } from "react-redux";
import { logout } from "../../async/logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons'
import * as moment from 'moment';

import HeaderNavbar from "./HeaderNavbar";
import StatusHeader from "components/dockhouse/HeaderStatusBanner";

const Header = (props: { history, dispatch }) => {
	const buttons = [
        {short: "I M S", long: "INCIDENTS", onClick: (a) => {alert("clicked IMS")}},
        {short: "CAP", long: "CAPSIZE", onClick: (a) => {alert("clicked CAP")}},
        {short: "GND", long: "AGROUND", onClick: (a) => {alert("clicked GND")}},
        {short: "AST", long: "ASSIST", onClick: (a) => {alert("clicked AST")}}];
	return (
		<div className="header">
			<StatusHeader flag={"R"} time={moment()} sunset={moment("2022-11-16T00:43:00Z")} speed={13} direction={"W"}
			high={{title: "Announcement Title Here", message: "Click for announcement modal blah blah"}}
			medium={{title: "", message: "Medium priority announcement"}}
			low={[{title: "", message: "low priority announcement"}, {title: "", message: "scroll blah blah"}]}
			buttons={buttons}
			></StatusHeader>
			<hr/>
			<HeaderNavbar history={props.history}/>
		</div>
	);
};

export default connect((store: any) => ({
	app: store.app
}))(Header);
