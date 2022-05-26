import { TabularForm } from '@components/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { HullCount, SubmitAction } from '.';

export enum HullType {
	KAYAK="Kayak",
	SUP="SUP"
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
		props.setSubmitAction(() => Promise.resolve({hullCounts: []}));
	}, [counts]);

	const columns = [{
		Header: "Hull Type",
		accessor: "hullType",
		readonly: true
	}, {
		Header: "In Svc",
		accessor: "inService",
		cellWidth: 90
	}, {
		Header: "Nightly Ct",
		accessor: "nightlyCount",
		cellWidth: 90
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
	<CardHeader style={{borderBottom: "none", paddingBottom: 0}}>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
			<EditHullCounts counts={props.counts} setSubmitAction={props.setSubmitAction} />
		)} />
		<CardTitle><h4>Hull Inventory</h4></CardTitle>
	</CardHeader>
	<CardBody>
		<Table size="sm">
			<tbody>
				<tr>
					<th style={{textAlign: "right"}}>Hull Type</th>
					<th style={{ width: "90px" }}>In Svc</th>
					<th style={{ width: "90px" }}>Nightly Ct</th>
				</tr>
				{getDisplayRows(props.counts).map((countObj, i) => <tr key={`row_${i}`}>
					<td style={{ textAlign: "right" }}>{countObj.hullType}</td>
					<td>{countObj.inService}</td>
					<td>{countObj.nightlyCount}</td>
				</tr>)}
			</tbody>
		</Table>
	</CardBody>
</Card>

