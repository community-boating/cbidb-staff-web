import * as React from "react";
import * as t from "io-ts";

import { Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";
import { membershipValidator } from "async/rest/person/get-person-memberships";
import { SimpleReport } from "core/SimpleReport";
import { ColumnDef } from "@tanstack/react-table";

type PersonMembership = t.TypeOf<typeof membershipValidator>;

interface Props {
	memberships: PersonMembership[];
}

export default function MembershipSummaryCard(props: Props) {
	const { memberships } = props;

	const columns: ColumnDef<PersonMembership, any>[] = [{
		accessorKey: "assignId",
		header: "ID",
		size: 80,
	}]

	const report = <SimpleReport 
		columns={columns}
		data={memberships}
		keyField={"assignId"}
	/>

	return <Card className={`person-summary-card`.trim()}>
		<CardHeader>
			<CardTitle tag="h5" className="mb-0">
				Memberships
			</CardTitle>
		</CardHeader>
		<CardBody>{report}</CardBody>
	</Card>;
}
