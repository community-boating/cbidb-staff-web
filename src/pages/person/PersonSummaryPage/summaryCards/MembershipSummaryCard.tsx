import * as React from "react";
import * as t from "io-ts";

import { Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";
import { membershipValidator } from "async/rest/person/get-person-memberships";
import { SimpleReport } from "core/SimpleReport";
import { ColumnDef } from "@tanstack/react-table";
import { MembershipType } from "async/rest/membership-types";
import Currency from "util/Currency";
import * as moment from 'moment';
import {Moment} from 'moment';

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
		membershipType: findTypeForMembership(mem),
		purchaseDate: moment(mem.purchaseDate),
		startDate: moment(mem.startDate),
		expirationDate: moment(mem.expirationDate)
	})

	type DecoratedMembershipRecord = ReturnType<typeof decorateMembershipRecord>;

	const columns: ColumnDef<DecoratedMembershipRecord, any>[] = [{
		accessorKey: "assignId",
		header: "ID",
		size: 20,
	}, {
		accessorKey: "$$membershipType.membershipTypeName",
		header: "Type",
		size: 80,
	}, {
		header: "Discount",
		size: 80,
		cell: x => x.row.original.$$discountInstance.map(di => di.$$discount.discountName).getOrElse(" - ")
	}, {
		header: "price",
		size: 80,
		cell: x => Currency.dollars(x.row.original.price).format()
	}, {
		accessorKey: "purchaseDate",
		header: "Purchase Date",
		size: 80,
		cell: x => (x.getValue() as Moment).format("MM/DD/YYYY HH:mm")
	}, {
		accessorKey: "startDate",
		header: "Start Date",
		size: 80,
		cell: x => (x.getValue() as Moment).format("MM/DD/YYYY")
	}, {
		accessorKey: "expirationDate",
		header: "Expiration Date",
		size: 80,
		cell: x => (x.getValue() as Moment).format("MM/DD/YYYY")
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
