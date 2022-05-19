import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap';
import { DockReportState, Staff, SubmitAction } from '.';
import { useTable, usePagination } from 'react-table'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
	staff: Staff[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}


function makeStaffTable(staff: Staff[]) {
	return <Table size="sm">
		<tbody>
			<tr>
				<th>Name</th>
				<th style={{ width: "75px" }}>In</th>
				<th style={{ width: "75px" }}>Out</th>
			</tr>
			{staff.map((e, i) => {
				return <tr key={`row_${i}`}>
					<td>{e.name}</td>
					<td>{e.in}</td>
					<td>{e.out}</td>
				</tr>
			})}
		</tbody>
	</Table>
}

const StaffTable = (props: Props & { title: string, staff: Staff[], statekey: keyof DockReportState }) => <Card>
	<CardHeader style={{ borderBottom: "none", paddingBottom: 0 }}>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
			<EditStaffTable staff={props.staff} setSubmitAction={props.setSubmitAction} statekey={props.statekey} />
		)} />
		<CardTitle tag="h2" className="mb-0">{props.title}</CardTitle>
	</CardHeader>
	<CardBody>
		{makeStaffTable(props.staff)}
	</CardBody>
</Card>;

export const DockmastersReport = (props: Props) => <StaffTable {...props} title="Dockmaster" staff={props.staff} statekey="dockmasters"/>

export const StaffReport = (props: Props) => <StaffTable {...props} title="Staff" staff={props.staff} statekey="dockstaff"/>

/////////////////////////////////////////////////////////////////////////////////

// Create an editable cell renderer
const EditableCell = ({
	value: initialValue,
	row: { index },
	column,
	updateMyData, // This is a custom function that we supplied to our table instance
}) => {
	// We need to keep and update the state of the cell normally
	const [value, setValue] = React.useState(initialValue)

	const onChange = e => {
		setValue(e.target.value)
	}

	const cellWidth = (column as any).cellWidth

	// We'll only update the external data when the input is blurred
	const onBlur = () => {
		updateMyData(index, column.id, value)
	}

	// If the initialValue is changed external, sync it up with our state
	React.useEffect(() => {
		setValue(initialValue)
	}, [initialValue])
	return <input style={{border: "none", width: cellWidth && cellWidth+"px"}} value={value} onChange={onChange} onBlur={onBlur} />
}


// Be sure to pass our updateMyData and the skipPageReset option
function EditableTable(props: { columns, data, updateMyData, skipPageReset, deleteRow, addRow }) {
	const { columns, data, updateMyData, skipPageReset } = props;
	// For this example, we're using pagination to illustrate how to stop
	// the current page from resetting when our data changes
	// Otherwise, nothing is different here.
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		rows
	} = useTable(
		{
			columns,
			data,
			defaultColumn: { Cell: EditableCell },
			// use the skipPageReset option to disable page resetting temporarily
			autoResetPage: !skipPageReset,
			// updateMyData isn't part of the API, but
			// anything we put into these options will
			// automatically be available on the instance.
			// That way we can call this function from our
			// cell renderer!
			updateMyData,
		} as any
	)

	// Render the UI for your table
	return (
		<>
			<Table {...getTableProps()}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							<th></th>
							{headerGroup.headers.map(column => {
								const cellWidth = (column as any).cellWidth
								// console.log(column)
								// console.log(column.getHeaderProps())
								return <th {...column.getHeaderProps()} style={{width: cellWidth && cellWidth+"px"}}>{column.render('Header')}</th>
							})}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
								<td><a href="#" onClick={() => props.deleteRow(i)}><img src="/images/delete.png" /></a></td>
								{row.cells.map(cell => {
									// console.log(cell)
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
					<tr><td>
						<a href="#" onClick={props.addRow}><FontAwesomeIcon icon={faPlusCircle} color="green" style={{height: "50px"}}/></a>
					</td>
					{rows[0].cells.map(c => <td></td>)}
					</tr>
				</tbody>
			</Table>
		</>
	)
}

const EditStaffTable = (props: {
	staff: Staff[],
	setSubmitAction: (submit: SubmitAction) => void,
	statekey: keyof DockReportState
}) => {
	const [staff, setStaff] = React.useState(props.staff);
	const [skipPageReset, setSkipPageReset] = React.useState(false)

	React.useEffect(() => {
		// console.log("setting submit action ", staff)
		props.setSubmitAction(() => Promise.resolve({[props.statekey]: staff}));
	}, [staff]);

	const columns = [{
		Header: "Name",
		accessor: "name"
	}, {
		Header: "In",
		accessor: "in",
		cellWidth: 75
	}, {
		Header: "Out",
		accessor: "out",
		cellWidth: 75
	}];

	const deleteRow = (i: number) => {
		console.log("deleting row ", i)
		setStaff(staff.filter((e,ii) => i != ii))
	}

	const addRow = () => setStaff(staff.concat({name: "", in: "", out: ""}))

	const updateMyData = (rowIndex, columnId, value) => {
		// We also turn on the flag to not reset the page
		setSkipPageReset(true)
		setStaff(old =>
			old.map((row, index) => {
				if (index === rowIndex) {
					return {
						...old[rowIndex],
						[columnId]: value,
					}
				}
				return row
			})
		)
	}

	return <div className="form-group row">
		<EditableTable columns={columns} data={staff} updateMyData={updateMyData} skipPageReset={skipPageReset} deleteRow={deleteRow} addRow={addRow} />
	</div>
}
