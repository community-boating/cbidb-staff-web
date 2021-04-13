import * as React from 'react';
import * as t from 'io-ts';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {signupValidator} from "@async/staff/all-jp-signups"
import { tableColWidth } from '@util/tableUtil';

type Signup = t.TypeOf<typeof signupValidator>;

type Props = {
	signups: Signup[]
}

export default function(props: Props) {
	const data = props.signups.map(s => ({
		signupId: s.SIGNUP_ID,
		nameFirst: s.$$person.NAME_FIRST,
		nameLast: s.$$person.NAME_LAST,
		signupType: s.SIGNUP_TYPE
	}));
	const columns:  ColumnDescription<typeof data[0]>[] = [{
		dataField: "signupId",
		text: "ID",
		...tableColWidth(80)
	}, {
		dataField: "nameFirst",
		text: "First Name"
	}, {
		dataField: "nameLast",
		text: "Last Name"
	}, {
		dataField: "signupType",
		text: "Status"
	}]
	return <BootstrapTable
		keyField="instanceId"
		data={data}
		columns={columns}
		bootstrap4
		bordered={false}
		pagination={paginationFactory({
			sizePerPage: 5,
			sizePerPageList: [5, 10, 25, 50]
		})}
	/>
}