import * as React from 'react';
import {Table} from 'reactstrap'
import { useTable, useSortBy, usePagination } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { TableOptionsCbi, TableInstanceCbi, TableStateCbi } from 'react-table-config';

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
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		// canPreviousPage,
		// canNextPage,
		// pageOptions,
		// pageCount,
		// gotoPage,
		// nextPage,
		// previousPage,
		// setPageSize,
		state,
	} = useTable({
			columns,
			data,
			disableSortRemove: true
		} as TableOptionsCbi<any>,
		useSortBy,
		usePagination
	) as TableInstanceCbi<any>;

	const {pageIndex, pageSize} = state as TableStateCbi<any>;

	console.log(pageIndex + "  " + pageSize)

	return <>
		<Table striped bordered {...getTableProps()}>
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
				{page.map((row, i) => {
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
		<div className="row react-bootstrap-table-pagination">
			<div className="col-md-6 col-xs-6 col-sm-6 col-lg-6"><span className="react-bs-table-sizePerPage-dropdown dropdown">
				<button id="pageDropDown" type="button"
						className="btn btn-default btn-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">12
					</button>
					<ul className="dropdown-menu " role="menu" aria-labelledby="pageDropDown"><a href="#" 
							role="menuitem" className="dropdown-item" data-page="12">12</a><a href="#"  role="menuitem"
							className="dropdown-item" data-page="25">25</a><a href="#"  role="menuitem"
							className="dropdown-item" data-page="50">50</a><a href="#"  role="menuitem"
							className="dropdown-item" data-page="1000">1000</a></ul>
				</span></div>
			<div className="react-bootstrap-table-pagination-list col-md-6 col-xs-6 col-sm-6 col-lg-6">
				<ul className="pagination react-bootstrap-table-page-btns-ul">
					<li className="active page-item" title="1"><a href="#" className="page-link">1</a></li>
					<li className="page-item" title="2"><a href="#" className="page-link">2</a></li>
					<li className="page-item" title="3"><a href="#" className="page-link">3</a></li>
					<li className="page-item" title="4"><a href="#" className="page-link">4</a></li>
					<li className="page-item" title="next page"><a href="#" className="page-link">&gt;</a></li>
				</ul>
			</div>
		</div>
	</>
};

export const SimpleReport: <T_Data>(props: SimpleReportRequiredProps<T_Data>) => JSX.Element = props => <SimpleReportComponent
	columns={props.columns}
	data={props.data}
/>;

