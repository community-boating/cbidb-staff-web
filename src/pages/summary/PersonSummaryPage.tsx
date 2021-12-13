import * as React from "react";
import * as t from "io-ts";
import * as _ from "lodash";
import { Col, FormGroup, Input, Row, Table } from "reactstrap";

import { validator } from "../../async/rest/person/get-person";
import PersonSummaryCard from "./PersonSummaryCard";
import rating_data, { Rating } from "./rating_data";

type Person = t.TypeOf<typeof validator>;

interface Props {
	person: Person;
}

interface RowDescription {
	key: string;
	value: React.ReactNode;
}

export default function PersonSummaryPage(props: Props) {
	const { person } = props;

	const rating_programs = _.toArray(
		_.groupBy(_.uniqWith(rating_data, _.isEqual), function (rating) {
			return rating.PROGRAM.PROGRAM_ID;
		})
	);

	const detailsRows: RowDescription[] = [
		{
			key: "Member ID",
			value: String(person.PERSON_ID),
		},
		{
			key: "Name",
			value: `${person.NAME_FIRST} ${person.NAME_LAST}`,
		},
		{
			key: "DOB",
			value: `11/09/1995`,
		},
		{
			key: "Phone Number",
			value: `505-480-0682`,
		},
		{
			key: "Email",
			value: `neil.sparks.95@gmail.com`,
		},
		{
			key: "Emergency Contact 1",
			value: (
				<EmergencyContact
					contact={{
						Name: "Testy",
						Relation: "Friend",
						"Primary Phone": "5054800682",
						"Alternate Phone": "5054800682",
					}}
				/>
			),
		},
		{
			key: "Emergency Contact 2",
			value: <EmergencyContact />,
		},
		{
			key: "UAP Boat",
			value: (
				<FormGroup style={{ marginTop: "-0.25rem" }}>
					<Input id="uap-boat-select" disabled type="select" defaultValue="0">
						<option value="0">Select boat...</option>
					</Input>
				</FormGroup>
			),
		},
	];

	const detailsBody = (
		<>
			<Table borderless className="m-0">
				<tbody>
					{detailsRows.map((row) => {
						return (
							<tr key={row.key.replace(" ", "_")}>
								<th className="text-right">{row.key}</th>
								<td>{row.value}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</>
	);

	console.log(rating_programs);

	const ratingsBody = (
		<>
			{rating_programs.map((pr) => (
				<RatingProgram
					ratings={pr}
					key={`rating-program-${pr[0].PROGRAM.PROGRAM_ID}`}
				/>
			))}
		</>
	);

	return (
		<Row className="person-summary-page">
			<Col className="col-fixed-500">
				<PersonSummaryCard body={detailsBody} title="Details" person={person} />
				<PersonSummaryCard body={ratingsBody} title="Ratings" person={person} />
				<PersonSummaryCard
					body={<></>}
					title="Member Comments"
					person={person}
				/>
			</Col>
			<Col>
				<PersonSummaryCard body={<></>} title="Memberships" person={person} />
				<PersonSummaryCard
					body={<></>}
					title="Damage Waivers"
					person={person}
				/>
				<PersonSummaryCard body={<></>} title="Cards" person={person} />
			</Col>
		</Row>
	);
}

interface EContactProps {
	Name: string;
	Relation: string;
	"Primary Phone": string;
	"Alternate Phone"?: string;
}

function EmergencyContact(props: { contact?: EContactProps }) {
	const { contact } = props;

	return (
		<div className="emergency-contact">
			{contact ? (
				<Table className="m-0">
					<tbody>
						{Object.entries(contact).map(([key, value]) => {
							return (
								<tr key={key.replace(" ", "_")}>
									<th className="text-right">{key}</th>
									<td>{value}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			) : (
				<em>No contact provided.</em>
			)}
		</div>
	);
}

function RatingItem(props: Rating) {
	const { RATING: rating } = props;
	return (
		<div
			className={`rating-item ${
				rating.RATING_ID % 3 === 0 ? "rating-granted" : ""
			}`.trim()}
			title={rating.RATING_NAME}
		>
			<span className="rating-item-inner">{rating.RATING_NAME}</span>
		</div>
	);
}

function RatingGroup(props: { ratings: Rating[] }) {
	const { ratings } = props;
	return (
		<div className="rating-group">
			{ratings.map((r) => (
				<RatingItem {...r} key={`rating-${r.RATING.RATING_ID}`} />
			))}
		</div>
	);
}

function RatingProgram(props: { ratings: Rating[] }) {
	const { ratings } = props;

	const ratings_group = _.toArray(
		_.groupBy(ratings, function (rating) {
			return rating.RATING.GROUP;
		})
	);

	console.log(ratings_group)

	return (
		<div className="rating-program">
			<h5>
				<strong>{ratings[0].PROGRAM.PROGRAM_NAME}</strong>
			</h5>
			{ratings_group.map((gr) => (
				<RatingGroup
					key={`rating-group-${gr[0].RATING.OVERRIDDEN_BY}`}
					ratings={gr}
				/>
			))}
		</div>
	);
}

// function RatingGroup
