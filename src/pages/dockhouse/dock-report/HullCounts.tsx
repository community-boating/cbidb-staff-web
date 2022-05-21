import { TabularForm } from '@components/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { HullCount, SubmitAction } from '.';

export enum HullType {
	KAYAK="Kayak",
	SUP="SUP"
}

type HullCountDisplay = {
	[K in keyof HullCount]: string
}

const getDisplayRows: (counts: HullCount[]) => HullCount[] = counts => {
	return Object.values(HullType).map(h => {
		const matchingRecord = counts.find(c => c.hullType == h);
		return {
			hullType: h,
			inService: (matchingRecord && matchingRecord.inService) || "",
			nightlyCount: (matchingRecord && matchingRecord.nightlyCount) || ""
		}
	})
}

const EditHullCounts = (props: {
	counts: HullCount[],
	setSubmitAction: (submit: SubmitAction) => void,
}) => {
	const [counts, setCounts] = React.useState(getDisplayRows(props.counts));

	React.useEffect(() => {
		// console.log("setting submit action ", counts)
		props.setSubmitAction(() => Promise.resolve({hullCounts: counts}));
	}, [counts]);

	const columns = [{
		Header: "Hull Type",
		accessor: "hullType"
	}, {
		Header: "In Svc",
		accessor: "inService",
		cellWidth: 75
	}, {
		Header: "Nightly Ct",
		accessor: "nightlyCount",
		cellWidth: 75
	}];

	return <div className="form-group row">
		<TabularForm columns={columns} data={counts} setData={setCounts}/>
	</div>
}

export default (props: {
	counts: HullCount[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}) => <Card>
	<CardHeader>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
			<EditHullCounts counts={props.counts} setSubmitAction={props.setSubmitAction} />
		)} />
		<CardTitle><h4>Hull Inventory</h4></CardTitle>
	</CardHeader>
	<CardBody>
		<Table size="sm">
			<tbody>
				<tr>
					<th>Hull</th>
					<th style={{ width: "75px" }}>In Svc</th>
					<th style={{ width: "75px" }}>Nightly Ct</th>
				</tr>
				{getDisplayRows(props.counts).map((countObj, i) => <tr key={`row_${i}`}>
					<td style={{ textAlign: "right" }}>{countObj.hullType}</td>
					<td>{countObj && countObj.inService}</td>
					<td>{countObj && countObj.nightlyCount}</td>
				</tr>)}
			</tbody>
		</Table>
	</CardBody>
</Card>

