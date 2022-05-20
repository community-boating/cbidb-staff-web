import * as React from 'react';
import { useTable, Column } from 'react-table'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'reactstrap';

const EditableCell = ({
	value: initialValue,
	row: { index },
	column,
	updateMyData,
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
export function TabularForm<T>(props: {
	columns: Column[],
	data: T[],
	setData: React.Dispatch<React.SetStateAction<T[]>>,
	blankRow: T
}) {
	const { columns, data, setData, blankRow } = props;
	const [skipPageReset, setSkipPageReset] = React.useState(false)
	React.useEffect(() => {
		setSkipPageReset(false)
	}, [data])

	const deleteRow = (i: number) => setData(data.filter((e,ii) => i != ii))

	const addRow = () => setData(data.concat(blankRow))

	const updateMyData = (rowIndex: number, columnId: number, value: T) => {
		// We also turn on the flag to not reset the page
		setSkipPageReset(true)
		setData(old =>
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

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		rows
	} = useTable({
		columns,
		data,
		defaultColumn: { Cell: EditableCell },
		autoResetPage: !skipPageReset,
		updateMyData,
	} as any)

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