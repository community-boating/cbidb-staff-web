import * as React from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Table } from 'reactstrap';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

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

	const display = (function() {
		if (column.readonly) {
			return value || "";
		} else if (column.textAreaHeight != undefined) {
			return <textarea rows={column.textAreaHeight} style={{border: "none", width: cellWidth && cellWidth+"px"}} value={value} onChange={onChange} onBlur={onBlur} />
		} else {
			return <Input type={column.type === undefined ? "" : column.type} style={{ borderColor:"#ccc", width: cellWidth && cellWidth+"px"}} value={value} onChange={onChange} onBlur={onBlur} />
		}
	}())
	return display;
}

// Be sure to pass our updateMyData and the skipPageReset option
export function TabularForm<T>(props: {
	columns: any[], // ColumnDef<T>[],
	data: T[],
	setData: React.Dispatch<React.SetStateAction<T[]>>,
	blankRow?: T
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

	const columnsWithEditCell = columns.map(c => ({
		...c,
		cell: (props) => <EditableCell value={props.cell.getValue()} row={{index: props.row.index}} column={{}} updateMyData={updateMyData} />
	}))

	const delColumn: ColumnDef<T, any> = {
		id: "delete",
		size: 45,
		cell: (props) => <a href="" onClick={e => {
			e.preventDefault();
			deleteRow(props.row.index);
		}}><img src="/images/delete.png" /></a>
	}

	const table = useReactTable({
		data: data,
		columns: blankRow == null ? columnsWithEditCell : [delColumn, ...columnsWithEditCell],
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableColumnFilters: false,
		autoResetAll: false,
	});

	const firstRow = table.getRowModel().rows[0]

	const addRowElement = (
		blankRow == null
		? null
		: <tr><td>
			<a href="#" onClick={addRow}><FontAwesomeIcon icon={faPlusCircle} color="green" style={{height: "17px", width: "17px"}}/></a>
			</td>
			{firstRow && firstRow.getAllCells().filter((e, i) => i > 0).map((c, i) => <td key={`editcell_${i}`}></td>)}
		</tr>
	);

	return (
		<>
			<Table >
				<thead>
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map(header => (
								<th key={header.id} style={{verticalAlign: "middle", width: header.column.getSize()}}>
									{header.isPlaceholder
										? null
										: <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>}
								</th>
							))}
						</tr>
					))}
				</thead>
				{/* <thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{(
								blankRow == null
								? null
								: <th style={{width: "30px"}}></th>
							)}
							{headerGroup.headers.map(column => {
								const cellWidth = (column as any).cellWidth
								return <th {...column.getHeaderProps()} style={{width: cellWidth && cellWidth+"px"}}>{column.render('Header')}</th>
							})}
						</tr>
					))}
				</thead> */}
				<tbody>
					{table.getRowModel().rows.map(row => (
						<tr key={row.id}>
							{row.getVisibleCells().map(cell => (
								<td key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
					{addRowElement}
				</tbody>
				{/* <tbody {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
								{(
									blankRow == null
									? null
									: <td key="deleteme"><a href="#" onClick={() => deleteRow(i)}>
										<img src="/images/delete.png" />
									</a></td>
								)}
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
					{(
						blankRow == null
						? null
						: <tr><td>
							<a href="#" onClick={addRow}><FontAwesomeIcon icon={faPlusCircle} color="green" style={{height: "17px", width: "17px"}}/></a>
							</td>
							{rows[0] && rows[0].cells.map((c, i) => <td key={`editcell_${i}`}></td>)}
						</tr>
					)}
				</tbody> */}
			</Table>
		</>
	)
}