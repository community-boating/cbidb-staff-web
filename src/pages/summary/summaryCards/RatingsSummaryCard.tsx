import * as React from "react";
import * as t from "io-ts";
import * as _ from "lodash";

import { validator as personValidator } from "async/rest/person/get-person";
import PersonSummaryCard from "./PersonSummaryCard";
import rating_data from "../rating_data";
import {validator as ratingValidator} from 'async/staff/rating-html'

interface Props {
	person: t.TypeOf<typeof personValidator>;
	ratings: t.TypeOf<typeof ratingValidator>[];
}

export default function RatingsSummaryCard(props: Props) {
	const { person, ratings } = props;

	const body = () => {
		return ratings.map(r => <div dangerouslySetInnerHTML={{__html: r.ratingsHtml}}></div>);
	};

	return <PersonSummaryCard title="Ratings" body={body} person={person} />;
}
