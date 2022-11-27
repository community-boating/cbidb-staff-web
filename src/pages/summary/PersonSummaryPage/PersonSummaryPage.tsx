import * as React from "react";
import * as t from "io-ts";
import * as _ from "lodash";
import { Col, Row } from "reactstrap";

import { validator } from "async/rest/person/get-person";
import PersonSummaryCard from "./summaryCards/PersonSummaryCard";
import MembershipSummaryCard from "./summaryCards/MembershipSummaryCard";
import DamageWaiverSummaryCard from "./summaryCards/DamageWaiverSummaryCard";
import GeneralSummaryCard from "./summaryCards/GeneralSummaryCard";
import RatingsSummaryCard from "./summaryCards/RatingsSummaryCard";
import "./person-summary.scss";
import {validator as ratingsValidator} from 'async/staff/rating-html'
import { membershipValidator } from "async/rest/person/get-person-memberships";

type Person = t.TypeOf<typeof validator>;
type Ratings = t.TypeOf<typeof ratingsValidator>
type Membership = t.TypeOf<typeof membershipValidator>

interface Props {
	person: Person;
	ratings: Ratings[];
	memberships: Membership[]
}

export default function PersonSummaryPage(props: Props) {
	const { person, ratings, memberships } = props;

	return (
		<Row className="person-summary-page">
			<Col className="col-fixed-500">
				<GeneralSummaryCard person={person} />
				<RatingsSummaryCard person={person} ratings={ratings} />
			</Col>
			<Col>
				<MembershipSummaryCard memberships={memberships} />
				{/* <DamageWaiverSummaryCard person={person} />
				<CardsSummaryCard person={person} /> */}
			</Col>
		</Row>
	);
}
