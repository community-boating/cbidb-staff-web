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
import { DHGlobalContext } from "./providers/DHGlobalProvider";
import { DHGlobals } from "async/staff/dockhouse/dh-globals";

/*
Flag Banner (close, GYRB, right)
Header Banner Height Fix
Signout Table:
	Padding around cells (1-2)
	Border: (1-2) header + whole table
Boat order (Merc, Keel Merc, Sonar, Ideal, Laser, 420, Kayak, Paddleboard, Windsurf)
*/

function getLatestFlag(dhGlobal: DHGlobals){
	const latestChange = dhGlobal.flagChanges.sort((a, b) => b.changeDatetime.diff(a.changeDatetime))[0];
	if(latestChange && FlagStatusIcons[latestChange.flag]){
		return FlagStatusIcons[latestChange.flag];
	}
	return FlagStatusIcons.B;
}

const Header = (props: { history, dispatch }) => {
	const dhGlobal = React.useContext(DHGlobalContext);
	const headerState = {
		flag: getLatestFlag(dhGlobal),
		localTimeOffset: dhGlobal.localTimeOffset,
		sunset: dhGlobal.sunsetTime,
		speed: dhGlobal.windSpeedAvg,
		direction: dhGlobal.winDir,
		announcements: dhGlobal.announcements
	}
	const buttons = [
        {src: ims, onClick: (a) => {alert("clicked IMS")}},
		{src: capsize, onClick: (a) => {alert("clicked CAP")}},
        {src: assist, onClick: (a) => {alert("clicked AST")}},
        {src: runaground, onClick: (a) => {alert("clicked RUN")}}];
	return (
		<div className="grow-0 relative">
			<StatusHeader
			{...headerState}
			setFlag={(flag) => {}}
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