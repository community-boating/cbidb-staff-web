import * as React from "react";
import { connect } from "react-redux";
import * as moment from 'moment';

import HeaderNavbar from "./HeaderNavbar";
import StatusHeader from "components/dockhouse/HeaderStatusBanner";

import runaground from 'assets/img/icons/header/runaground.svg';
import capsize from 'assets/img/icons/header/capsize.svg';
import assist from 'assets/img/icons/header/assist.svg';

const Header = (props: { history, dispatch }) => {
	const buttons = [
        {src: runaground, onClick: (a) => {alert("clicked IMS")}},
        {src: runaground, onClick: (a) => {alert("clicked RUN")}},
        {src: capsize, onClick: (a) => {alert("clicked CAP")}},
        {src: assist, onClick: (a) => {alert("clicked AST")}}];
	return (
		<div className="header grow-0">
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