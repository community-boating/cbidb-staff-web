import * as React from "react";
import * as t from "io-ts";
import { validator as personValidator } from "@async/rest/person/get-person";

import PersonSummaryCard from "./PersonSummaryCard";

interface Props {
	person: t.TypeOf<typeof personValidator>;
}

export default function CardsSummaryCard(props: Props) {
	const { person } = props;

	const body = () => {
		return <></>;
	};

	return <PersonSummaryCard title="Cards" body={body} person={person} />;
}
