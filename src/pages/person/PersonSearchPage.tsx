import { pathPersonSummary } from "app/paths";
import * as React from "react";
import { NavLink } from "react-router-dom";

export default function PersonSearchPage(props: {}) {
	const {} = props;
	return <NavLink to={pathPersonSummary.getPathFromArgs({personId: "188910"})}>Some Parent</NavLink>
}
