import { dockReportHullCountValidator } from 'async/rest/dock-report';
import * as t from "io-ts";
import { TabularForm } from 'components/table/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { DockReportState, SubmitAction } from '.';
import { Editable } from 'util/EditableType';
import optionify from 'util/optionify';
import { ERROR_DELIMITER } from 'core/APIWrapper';
import { combineValidations, validateNumber } from 'util/validate';
import { ColumnDef } from '@tanstack/react-table';

type HullCount = t.TypeOf<typeof dockReportHullCountValidator>

type HullCountNonEditable = "DOCK_REPORT_HULL_CT_ID" | "DOCK_REPORT_ID"

type HullCountEditable = Editable<HullCount, HullCountNonEditable>

export enum HullType {
	KAYAK="Kayak",
	SUP="SUP"
}

const getDisplayRows: (counts: HullCount[]) => HullCountEditable[] = counts => {
	return Object.values(HullType).map(h => {
		const matchingRecord = optionify(counts.find(c => c.HULL_TYPE == h));
		return matchingRecord.map(c => ({
			...c,
			IN_SERVICE: c.IN_SERVICE.map(String).getOrElse(""),
			STAFF_TALLY: c.STAFF_TALLY.map(String).getOrElse("")
		})).getOrElse({
			DOCK_REPORT_HULL_CT_ID: null,
			DOCK_REPORT_ID: null,
			HULL_TYPE: h,
			IN_SERVICE: "",
			STAFF_TALLY: ""
		})
	})
}

const mapToDto: (count: HullCountEditable) => HullCount = count => ({
	...count,
	IN_SERVICE: optionify(count.IN_SERVICE).map(Number),
	STAFF_TALLY: optionify(count.STAFF_TALLY).map(Number),
})

const EditHullCounts = (props: {
	counts: HullCount[],
	setSubmitAction: (submit: SubmitAction) => void,
}) => {
	const [counts, setCounts] = React.useState(getDisplayRows(props.counts));

	React.useEffect(() => {
		props.setSubmitAction(() => {
			const errors = combineValidations(
				validateNumber(counts.map(c => c.IN_SERVICE)),
				validateNumber(counts.map(c => c.STAFF_TALLY)),
			)
			if (errors.length) return Promise.reject(errors.join(ERROR_DELIMITER))
			else return Promise.resolve({hullCounts: counts.map(mapToDto)})
		});
	}, [counts]);

	const columns: ColumnDef<HullCount>[] = [{
		header: "Hull Type",
		accessorKey: "HULL_TYPE",
		meta: {
			readonly: true
		}
	}, {
		header: "In Svc",
		accessorKey: "IN_SERVICE",
		size: 90
	}, {
		header: "Nightly Ct",
		accessorKey: "STAFF_TALLY",
		size: 90
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
					<td style={{ textAlign: "right" }}>{countObj.HULL_TYPE}</td>
					<td>{countObj.IN_SERVICE}</td>
					<td>{countObj.STAFF_TALLY}</td>
				</tr>)}
			</tbody>
		</Table>
	</CardBody>
</Card>

