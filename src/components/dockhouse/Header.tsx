import * as React from "react";
import { connect } from "react-redux";
import * as moment from 'moment';

import HeaderNavbar, { HeaderNavbarDropdown } from "./HeaderNavbar";
import StatusHeader from "components/dockhouse/HeaderStatusBanner";

import ims from 'assets/img/icons/header/ims.svg';
import runaground from 'assets/img/icons/header/runaground.svg';
import capsize from 'assets/img/icons/header/capsize.svg';
import assist from 'assets/img/icons/header/assist.svg';
import { FlagStatusIcons } from "./FlagStatusIcons";

const Header = (props: { history, dispatch }) => {
	const buttons = [
        {src: ims, onClick: (a) => {alert("clicked IMS")}},
        {src: runaground, onClick: (a) => {alert("clicked RUN")}},
        {src: capsize, onClick: (a) => {alert("clicked CAP")}},
        {src: assist, onClick: (a) => {alert("clicked AST")}}];
	return (
		<div className="grow-0 relative">
			<StatusHeader flag={FlagStatusIcons.R} time={moment()} sunset={moment("2022-11-16T00:43:00Z")} speed={13} direction={"W"}
			high={{title: "Announcement Title Here", message: "Click for announcement modal blah blah"}}
			medium={{title: "", message: "Medium priority announcement"}}
			low={[{title: "", message: "low priority announcement"}, {title: "", message: "scroll blah blah"}]}
			buttons={buttons}
			dropdownNavbar={<HeaderNavbarDropdown history={props.history}/>}
			></StatusHeader>
			<HeaderNavbar history={props.history}/>
		</div>
	);
};

export default connect((store: any) => ({
	app: store.app
}))(Header);