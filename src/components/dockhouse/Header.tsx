import * as React from "react";
import { connect } from "react-redux";
import * as moment from 'moment';

import HeaderNavbar, { HeaderNavbarDropdown } from "./HeaderNavbar";
import StatusHeader from "components/dockhouse/HeaderStatusBanner";

import ims from 'assets/img/icons/header/ims.svg';
import runaground from 'assets/img/icons/header/runaground.svg';
import capsize from 'assets/img/icons/header/capsize.svg';
import assist from 'assets/img/icons/header/assist.svg';
import { DHGlobalContext } from "../../async/providers/DHGlobalProvider";
import { DHGlobals } from "async/staff/dockhouse/dh-globals";
import { FlagColor, postWrapper as postFlagColor } from "async/staff/dockhouse/flag-color";
import { AppStateContext } from "app/state/AppStateContext";
import { ActionModalContext } from "./actionmodal/ActionModal";
import { IncidentTypes } from "async/staff/dockhouse/incidents";
import { option } from "fp-ts";
import { IncidentsContext } from "../../async/providers/IncidentsProvider";
import { ActionEditIncident, createIncident } from "./actionmodal/incident/IncidentModalType";
import { ActionViewIncidents } from "./actionmodal/view-incidents/ViewIncidentsType";
import { toastr } from "react-redux-toastr";

/*
Flag Banner (close, GYRB, right)
Header Banner Height Fix
Signout Table:
	Padding around cells (1-2)
	Border: (1-2) header + whole table
Boat order (Merc, Keel Merc, Sonar, Ideal, Laser, 420, Kayak, Paddleboard, Windsurf)
*/

export function getLatestFlag(dhGlobal: DHGlobals){
	const latestChange = dhGlobal.flagChanges.sort((a, b) => b.changeDatetime.diff(a.changeDatetime))[0];
	return latestChange ? latestChange.flag : FlagColor.BLACK;
}

var minId = -1;

const Header = (props: { history, dispatch }) => {
	const asc = React.useContext(AppStateContext);
	const dhGlobal = React.useContext(DHGlobalContext);
	const actionModal = React.useContext(ActionModalContext);
	const incidents = React.useContext(IncidentsContext);
	const [flag, setFlag] = React.useState(FlagColor.BLACK);
	React.useEffect(() => {
		setFlag(getLatestFlag(dhGlobal));
	}, [dhGlobal]);
	const addIncident = (type: IncidentTypes) => {
		const i = createIncident(type);
		incidents.setState((s) => s.concat(i));
		actionModal.pushAction(new ActionEditIncident(i));
	}
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
			actionModal.pushAction(new ActionViewIncidents());
		}},
		{src: capsize, onClick: (e) => {
			e.preventDefault();
			addIncident(IncidentTypes.CAPSIZE);
		}},
        {src: assist, onClick: (e) => {
			e.preventDefault();
			addIncident(IncidentTypes.VESSEL_ASSIST);
		}},
        {src: runaground, onClick: (e) => {
			e.preventDefault();
			addIncident(IncidentTypes.RUNAGROUND);
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
						toastr.error("Flag Color", "Failed setting flag color");
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