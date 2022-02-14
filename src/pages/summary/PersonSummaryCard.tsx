import * as React from "react";
import * as t from "io-ts";
import { NavLink } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { Edit as EditIcon } from "react-feather";

import { validator } from "@async/rest/person/get-person";
import { pathPersonSummary } from "@app/paths";

interface Props {
	person: t.TypeOf<typeof validator>;
	title: string;
	body: React.ReactNode;
}

export default function PersonSummaryCard(props: Props) {
	const { person, title, body } = props;

	return (
		<Card className="person-summary-card">
			<CardHeader>
				<CardTitle tag="h5" className="mb-0">
					{title}
					<div className="card-header-actions">
						<NavLink
							to={pathPersonSummary.getPathFromArgs({
								personId: String(person.PERSON_ID),
							})}
							title="Edit person details"
						>
							<EditIcon color="#777" size="1rem" />
						</NavLink>
					</div>
				</CardTitle>
			</CardHeader>
			<CardBody>{body}</CardBody>
		</Card>
	);
}
