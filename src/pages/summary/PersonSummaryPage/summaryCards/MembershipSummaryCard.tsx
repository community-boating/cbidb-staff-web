import * as React from "react";
import * as t from "io-ts";

import { Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";
import { membershipValidator } from "async/rest/person/get-person-memberships";
import { SimpleReport } from "core/SimpleReport";
import { ColumnDef } from "@tanstack/react-table";
import { MembershipType } from "async/rest/membership-types";

type PersonMembership = t.TypeOf<typeof membershipValidator>;

interface Props {
	memberships: PersonMembership[];
	membershipTypes: MembershipType[]
}



export default function MembershipSummaryCard(props: Props) {
	const { memberships, membershipTypes } = props;

	const findTypeForMembership = (mem: PersonMembership) => membershipTypes.find(t => t.membershipTypeId == mem.membershipTypeId)

	const decorateMembershipRecord = (mem: PersonMembership) => ({
		...mem,
		membershipType: findTypeForMembership(mem)
	})

	type DecoratedMembershipRecord = ReturnType<typeof decorateMembershipRecord>;

	const columns: ColumnDef<DecoratedMembershipRecord, any>[] = [{
		accessorKey: "assignId",
		header: "ID",
		size: 80,
	}, {
		accessorKey: "assignId",
		header: "ID",
		size: 80,
	}]

	const report = <SimpleReport 
		columns={columns}
		data={memberships.map(decorateMembershipRecord)}
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
