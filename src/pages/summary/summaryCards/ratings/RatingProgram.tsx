import * as React from "react";
import * as _ from "lodash";

import { Rating } from "pages/summary/rating_data";

export default function RatingProgram(props: { ratings: Rating[] }) {
	const { ratings } = props;

	const ratings_group = _.toArray(
		_.groupBy(ratings, function (rating) {
			return rating.RATING.GROUP;
		})
	);

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
