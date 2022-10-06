import * as React from 'react';
import * as t from 'io-ts';
import {signupValidator} from "async/staff/all-jp-signups"
import { tableColWidth } from 'util/tableUtil';
import { toMomentFromLocalDateTime } from 'util/dateUtil';

type Signup = t.TypeOf<typeof signupValidator>;

type Props = {
	signups: Signup[]
}

export default function(props: Props) {
	function getSignupTypeText(signupType: string): React.ReactNode {
		switch (signupType) {
		case "E":
			return <span style={{fontWeight: "bold", color: "green"}}>Enrolled</span>;
		case "W":
			return <span style={{fontWeight: "bold", color: "red"}}>Wait List</span>;
		case "P":
			return <span style={{fontWeight: "bold", color: "orange"}}>Reserved for Purchase</span>;
		default:
			return signupType;
		}
	}
	function sectionDisplay(name: string, url: string) {
		return <table><tbody><tr>
			<td style={{border: "none"}}><img
				src={url}
				style={{height: "30px", border: "1px solid #777"}}
			/></td>
			<td style={{border: "none"}}>{name}</td>
		</tr></tbody></table>
	}
	const data = props.signups.sort((a, b) => a.SEQUENCE - b.SEQUENCE).map((s, i) => ({
		signupId: s.SIGNUP_ID,
		nameFirst: s.$$person.NAME_FIRST.getOrElse(""),
		nameLast: s.$$person.NAME_LAST.getOrElse(""),
		signupType: getSignupTypeText(s.SIGNUP_TYPE),
		signupDatetime: toMomentFromLocalDateTime(s.SIGNUP_DATETIME),
		signupDatetimeDisplay: toMomentFromLocalDateTime(s.SIGNUP_DATETIME).format("MM/DD/YYYY hh:mmA"),
		seq: i + 1,
		groupName: s.$$group.map(g => g.GROUP_NAME).getOrElse(null),
		wlStatus: s.$$jpClassWlResult.map(wl => wl.statusString).getOrElse(null),
		sectionDisplay: s.$$section.map(sec => sectionDisplay(sec.$$sectionLookup.SECTION_NAME, sec.$$sectionLookup.SVG_URL)).getOrElse(null),
	}));
	const columns/*:  ColumnDescription<typeof data[0]>[] */= [{
		dataField: "signupId",
		text: "ID",
		...tableColWidth(80)
	}, {
		dataField: "seq",
		text: "Seq",
		...tableColWidth(60)
	}, {
		dataField: "groupName",
		text: "Group"
	}, {
		dataField: "nameFirst",
		text: "First Name"
	}, {
		dataField: "nameLast",
		text: "Last Name"
	}, {
		dataField: "signupType",
		text: "Status"
	}, {
		dataField: "wlStatus",
		text: "WL Status"
	}, {
		dataField: "signupDatetimeDisplay",
		text: "Signup Time"
	}, {
		dataField: "sectionDisplay",
		text: "Section"
	}]
	return <>
		{/* <BootstrapTable
			keyField="signupId"
			data={data}
			columns={columns}
			bootstrap4
			bordered={false}
		/> */}
	</>
}