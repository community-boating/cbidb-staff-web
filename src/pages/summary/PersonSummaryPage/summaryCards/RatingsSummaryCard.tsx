import * as React from "react";
import * as t from "io-ts";
import * as _ from "lodash";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

import { validator as personValidator } from "async/rest/person/get-person";
import {validator as ratingValidator} from 'async/staff/rating-html'

interface Props {
	person: t.TypeOf<typeof personValidator>;
	ratings: t.TypeOf<typeof ratingValidator>[];
}

export default function RatingsSummaryCard(props: Props) {
	const { ratings } = props;

	return <Card className={`person-summary-card`.trim()}>
		<CardHeader>
			<CardTitle tag="h5" className="mb-0">
				Ratings
			</CardTitle>
		</CardHeader>
		<CardBody>
			{ratings.map((r, i) => <div key={`ratings_${i}`} dangerouslySetInnerHTML={{__html: r.ratingsHtml}}></div>)}
		</CardBody>
	</Card>;
}
