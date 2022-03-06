import * as React from "react";
import * as t from "io-ts";
import { NavLink } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle, Spinner } from "reactstrap";
import { Edit as EditIcon } from "react-feather";

import { validator } from "@async/rest/person/get-person";
import { pathPersonSummary } from "@app/paths";
import { ApiResult } from "@core/APIWrapperTypes";

interface Props<T> {
	person: t.TypeOf<typeof validator>;
	title: string;
	body: (args?: T) => React.ReactNode;
	getAsyncProps?: () => Promise<ApiResult<T>>;
	className?: string;
	replaceParent?: boolean;
}

export default function PersonSummaryCard<T>(props: Props<T>) {
	const {
		person,
		title,
		body,
		getAsyncProps,
		className,
		replaceParent,
	} = props;

	let loader: React.ReactNode = (
		<div className="d-flex flex-row align-items-center justify-content-center">
			<Spinner color="primary" size={"sm"} />
		</div>
	);

	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [content, setContent] = React.useState<React.ReactNode>(loader);

	React.useEffect(() => {
		if (getAsyncProps !== undefined) {
			getAsyncProps().then((res) => {
				if (res.type === "Success") setContent(body(res.success));
				else setContent(<em>We've failed to load the content.</em>);
				setIsLoading(false);
			});
		} else {
			setContent(body());
			setIsLoading(false);
		}
	}, []);

	if (replaceParent && !isLoading) return <>{content}</>;

	return (
		<Card className={`person-summary-card ${className ?? ""}`.trim()}>
			<CardHeader>
				<CardTitle tag="h5" className="mb-0">
					{title}
					{!isLoading && <div className="card-header-actions">
						<NavLink
							to={pathPersonSummary.getPathFromArgs({
								personId: String(person.PERSON_ID),
							})}
							title="Edit person details"
						>
							<EditIcon color="#777" size="1rem" />
						</NavLink>
					</div>}
				</CardTitle>
			</CardHeader>
			<CardBody>{content}</CardBody>
		</Card>
	);
}
