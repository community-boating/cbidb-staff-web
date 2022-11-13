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
import {validator as ratingsValidator} from 'async/staff/rating-html'

type Person = t.TypeOf<typeof validator>;
type Ratings = t.TypeOf<typeof ratingsValidator>

interface Props {
	person: Person;
	ratings: Ratings[]
}

export default function PersonSummaryPage(props: Props) {
	const { person, ratings } = props;

	return (
		<Row className="person-summary-page">
			<Col className="col-fixed-500">
				<GeneralSummaryCard person={person} />
				<RatingsSummaryCard person={person} ratings={ratings} />
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
