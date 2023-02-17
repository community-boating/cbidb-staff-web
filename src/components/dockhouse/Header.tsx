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
import { FlagColor, postWrapper as postFlagColor } from "async/staff/dockhouse/flag-color";
import { AppStateContext } from "app/state/AppStateContext";
import { ActionModalContext } from "./actionmodal/ActionModal";
import { ActionCreateIncident } from "./actionmodal/incident/IncidentModalType";
import { IncidentTypes } from "async/staff/dockhouse/incidents";
import { option } from "fp-ts";

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
	return latestChange ? latestChange.flag : FlagColor.BLACK;
}

const Header = (props: { history, dispatch }) => {
	const asc = React.useContext(AppStateContext);
	const dhGlobal = React.useContext(DHGlobalContext);
	const actionModal = React.useContext(ActionModalContext);
	const [flag, setFlag] = React.useState(FlagColor.BLACK);
	React.useEffect(() => {
		setFlag(getLatestFlag(dhGlobal));
	}, [dhGlobal]);
	const headerState = {
		flag: flag,
		localTimeOffset: dhGlobal.localTimeOffset,
		sunset: dhGlobal.sunsetTime,
		speed: dhGlobal.windSpeedAvg,
		direction: dhGlobal.winDir,
		announcements: dhGlobal.announcements
	}
	const buttons = [
        {src: ims, onClick: (e) => {
			e.preventDefault();
		}},
		{src: capsize, onClick: (e) => {
			e.preventDefault();
			actionModal.pushAction(new ActionCreateIncident(option.some(IncidentTypes.CAPSIZE)));
		}},
        {src: assist, onClick: (e) => {
			e.preventDefault();
			actionModal.pushAction(new ActionCreateIncident(option.some(IncidentTypes.ASSIST)));
		}},
        {src: runaground, onClick: (e) => {
			e.preventDefault();
			actionModal.pushAction(new ActionCreateIncident(option.some(IncidentTypes.RUNAGROUND)));
		}}];
	return (
		<div className="grow-0 relative">
			<StatusHeader
			{...headerState}
			setFlag={(flag) => {
				postFlagColor.sendJson(asc, {
					flagColor: flag
				}).then((a) => {
					if(a.type == "Success"){
						setFlag(flag);
					}else{
						alert("Error setting flag color");
					}
				})
			}}
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