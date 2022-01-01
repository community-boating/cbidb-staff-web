import * as React from 'react';
import {Table} from 'reactstrap'
import { useTable, useSortBy } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";

export type SimpleReportColumn = {
	accessor: string,
	Header: string,
	disableSortBy?: boolean,
	width?: number,
}

type SimpleReportRequiredProps<T_Data> = {
	keyField: keyof T_Data,
	data: T_Data[],
	columns: SimpleReportColumn[],
	sizePerPage?: number,
	sizePerPageList?: number[],
}

const SimpleReportComponent = ({columns, data}) => {
	console.log("rendering table")
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
	useTable(
		{
			columns,
			data,
			disableSortRemove: true
		} as any,
		useSortBy
	);

	return <Table striped bordered {...getTableProps()}>
		<thead>
			{headerGroups.map((headerGroup) => (
				<tr {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map((column: any) => (
						// Add the sorting props to control sorting. For this example
						// we can add them into the header props
						<th {...column.getHeaderProps(column.getSortByToggleProps())}>
							{column.render("Header")}
							{/* Add a sort direction indicator */}
							<span>
								{column.isSorted ? (
									column.isSortedDesc ? (
										<FontAwesomeIcon icon={faSortUp} className="ms-2" />
									) : (
										<FontAwesomeIcon icon={faSortDown} className="ms-2" />
									)
								) : null}
							</span>
						</th>
					))}
				</tr>
			))}
		</thead>
		<tbody {...getTableBodyProps()}>
			{rows.map((row, i) => {
				prepareRow(row);
				return (
					<tr {...row.getRowProps()}>
						{row.cells.map((cell) => {
							return (
								<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
							);
						})}
					</tr>
				);
			})}
		</tbody>
	</Table>
};

export const SimpleReport: <T_Data>(props: SimpleReportRequiredProps<T_Data>) => JSX.Element = props => <SimpleReportComponent
	columns={props.columns}
	data={props.data}
/>;

