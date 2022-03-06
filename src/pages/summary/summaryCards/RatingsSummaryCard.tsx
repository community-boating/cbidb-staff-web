import * as React from "react";
import * as t from "io-ts";
import * as _ from "lodash";

import { validator as personValidator } from "@async/rest/person/get-person";
import PersonSummaryCard from "./PersonSummaryCard";
import RatingProgram from "./ratings/RatingProgram";
import rating_data from "../rating_data";

interface Props {
	person: t.TypeOf<typeof personValidator>;
}

export default function RatingsSummaryCard(props: Props) {
	const { person } = props;

	const rating_programs = _.toArray(
		_.groupBy(_.uniqWith(rating_data, _.isEqual), function (rating) {
			return rating.PROGRAM.PROGRAM_ID;
		})
	);

	const body = () => {
		return (
			<>
				{rating_programs.map((pr) => (
					<RatingProgram
						ratings={pr}
						key={`rating-program-${pr[0].PROGRAM.PROGRAM_ID}`}
					/>
				))}
			</>
		);
	};

	return <PersonSummaryCard title="Ratings" body={body} person={person} />;
}
