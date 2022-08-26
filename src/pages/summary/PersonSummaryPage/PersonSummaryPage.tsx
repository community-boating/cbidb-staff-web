import * as React from "react";
import * as t from "io-ts";
import * as _ from "lodash";
import { Col, Row } from "reactstrap";

import { validator } from "async/rest/person/get-person";
import PersonSummaryCard from "../summaryCards/PersonSummaryCard";
import MembershipSummaryCard from "../summaryCards/MembershipSummaryCard";
import DamageWaiverSummaryCard from "../summaryCards/DamageWaiverSummaryCard";
import GeneralSummaryCard from "../summaryCards/GeneralSummaryCard";
import RatingsSummaryCard from "../summaryCards/RatingsSummaryCard";
import CardsSummaryCard from "../summaryCards/CardsSummaryCard";
import "./person-summary.scss";

type Person = t.TypeOf<typeof validator>;

interface Props {
	person: Person;
}

export default function PersonSummaryPage(props: Props) {
	const { person } = props;

	return (
		<Row className="person-summary-page">
			<Col className="col-fixed-500">
				<GeneralSummaryCard person={person} />
				<RatingsSummaryCard person={person} />
				<PersonSummaryCard
					body={() => <></>}
					title="Member Comments"
					person={person}
				/>
			</Col>
			<Col>
				<MembershipSummaryCard person={person} />
				<DamageWaiverSummaryCard person={person} />
				<CardsSummaryCard person={person} />
			</Col>
		</Row>
	);
}
