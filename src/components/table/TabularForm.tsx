import * as React from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Table } from 'reactstrap';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

const EditableCell: (props: {
	value: any,
	index: number,
	column: ColumnDef<any>,
	updateMyData: any
}) => JSX.Element = ({
	value: initialValue,
	index,
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
		updateMyData(index, (column as any).accessorKey, value)
	}

	// If the initialValue is changed external, sync it up with our state
	React.useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	const meta = (column.meta || {}) as any

	const display: JSX.Element = React.useMemo(() => {
		if (meta.readonly) {
			return value || "";
		} else if (meta.textAreaHeight != undefined) {
			return <textarea rows={meta.textAreaHeight} style={{border: "none", width: cellWidth && cellWidth+"px"}} value={value} onChange={onChange} onBlur={onBlur} />
		} else {
			return <Input type={meta.type === undefined ? "" : meta.type} style={{ borderColor:"#ccc", width: cellWidth && cellWidth+"px"}} value={value} onChange={onChange} onBlur={onBlur} />
		}
	}, [value])
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
	const [tableReRender, setTableReRender] = React.useState(true);

	// Call this when you want to make the table re-render, otherwise it will not
	const pokeTable = () => {
		setTableReRender(!tableReRender)
	}

	const deleteRow = (dataClosure: T[], i: number) => {
		setData(dataClosure.filter((e,ii) => i != ii))
		pokeTable()
	}

	const addRow = (dataClosure: T[]) => {
		setData(dataClosure.concat([blankRow]))
		pokeTable()
	}

	const updateMyData = (rowIndex: number, columnId: number, value: T) => {
		setData(old => old.map((row, index) => {
			if (index === rowIndex) {
				return {
					...old[rowIndex],
					[columnId]: value,
				}
			}
			return row
		}))
	}

	const columnsToUse = React.useMemo(() => {
		const columnsWithEditCell = columns.map(c => ({
			...c,
			cell: (props) => {
				if (c.meta && c.meta.updateableCell) {
					const UpdateableCell = c.meta.updateableCell;
					return <UpdateableCell value={props.cell.getValue()} index={props.row.index} column={c} updateMyData={updateMyData} />
				} else {
					return <EditableCell value={props.cell.getValue()} index={props.row.index} column={c} updateMyData={updateMyData} />
				}
			}
		}))
	
		const delColumn: ColumnDef<T, any> = {
			id: "delete",
			size: 45,
			cell: (props) => <a href="" onClick={e => {
				e.preventDefault();
				deleteRow(props.table.options.data, props.row.index);
			}}><img src="/images/delete.png" /></a>
		}

		return blankRow == null ? columnsWithEditCell : [delColumn, ...columnsWithEditCell];
	}, [columns])

	const table = useReactTable({
		data: data,
		columns: columnsToUse,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		//getPaginationRowModel: getPaginationRowModel(),
		enableColumnFilters: false,
		autoResetAll: false,
	});

	return React.useMemo(() => {
		const firstRow = table.getRowModel().rows[0]
	
		const addRowElement = (
			blankRow == null
			? null
			: <tr><td>
				<a href="#" onClick={() => addRow(table.options.data)}><FontAwesomeIcon icon={faPlusCircle} color="green" style={{height: "17px", width: "17px"}}/></a>
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
				</Table>
			</>
		)
	}, [tableReRender]);
}