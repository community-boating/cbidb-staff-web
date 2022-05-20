import * as React from 'react';
import { useTable, usePagination } from 'react-table'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'reactstrap';

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
export function TabularForm(props: { columns, data, updateMyData, skipPageReset, setData }) {
	const { columns, data, updateMyData, skipPageReset, setData } = props;

	const deleteRow = (i: number) => {
		console.log("deleting row ", i)
		setData(data.filter((e,ii) => i != ii))
	}

	const addRow = () => setData(data.concat({name: "", in: "", out: ""}))

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

	// Create an editable cell renderer


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
								<td><a href="#" onClick={() => deleteRow(i)}><img src="/images/delete.png" /></a></td>
								{row.cells.map(cell => {
									// console.log(cell)
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
					<tr><td>
						<a href="#" onClick={addRow}><FontAwesomeIcon icon={faPlusCircle} color="green" style={{height: "50px"}}/></a>
					</td>
					{rows[0].cells.map(c => <td></td>)}
					</tr>
				</tbody>
			</Table>
		</>
	)
}