import * as React from 'react';
import {Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, Table, UncontrolledButtonDropdown} from 'reactstrap'
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

const SimpleReportComponent = ({columns, data, initialSizePerPage, sizePerPageList}) => {
	console.log("rendering table", initialSizePerPage)
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state,
	} = useTable({
			columns,
			data,
			disableSortRemove: true,
			initialState: {pageSize: initialSizePerPage},
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
		<Row>
			<Col>
				<UncontrolledButtonDropdown  className="mr-1 mb-1">
					<DropdownToggle caret >{pageSize}</DropdownToggle>
					<DropdownMenu onChange={v => console.log(v)}>
						{sizePerPageList.map(s => <DropdownItem key={s} onClick={() => setPageSize(s)}>{s}</DropdownItem>)}
					</DropdownMenu>
				</UncontrolledButtonDropdown>
			</Col>
			<Col>
				{paginationControls({
					pageIndex,
					pageCount,
					nextPage,
					previousPage,
					gotoPage
				})}
			</Col>
		</Row>
	</>
};

type PaginationControlsProps = {
	pageIndex: number,
	pageCount: number,
	nextPage: () => void,
	previousPage: () => void,
	gotoPage: (n: number) => void
}

const paginationControls = ({pageIndex, pageCount, nextPage, previousPage, gotoPage}: PaginationControlsProps) => {
	const goNext = (e: React.MouseEvent) => {
		e.preventDefault();
		nextPage();
	}

	const goPrevious = (e: React.MouseEvent) => {
		e.preventDefault();
		previousPage();
	}

	const goTo = (n: number) => (e: React.MouseEvent) => {
		e.preventDefault();
		gotoPage(n);
	}

	const pageLink = (n: number) => <li className="pagination-button page-item" title={String(n)}><a href="#" onClick={goTo(n)} className="page-link">{n+1}</a></li>

	const disablePrev = pageIndex==0;
	const disableNext = pageIndex==(pageCount-1);

	return <ul style={{justifyContent: "flex-end"}} className="pagination">
		<li className={"pagination-button page-item " + (disablePrev&&"disabled")} title="first page"><a href="#" onClick={goTo(0)} className="page-link">&lt;&lt;</a></li>
		<li className={"pagination-button page-item " + (disablePrev&&"disabled")} title="previous page"><a href="#" onClick={goPrevious} className="page-link">&lt;</a></li>
		{pageIndex > (pageCount-3) && pageIndex > 3 ? pageLink(pageIndex-4) : null}
		{pageIndex > (pageCount-2) && pageIndex > 2 ? pageLink(pageIndex-3) : null}
		{pageIndex > 1 ? pageLink(pageIndex-2) : null}
		{pageIndex > 0 ? pageLink(pageIndex-1) : null}
		<li className="active pagination-button page-item" title="4"><a href="#" onClick={e => e.preventDefault()} className="page-link">{pageIndex+1}</a></li>
		{pageIndex < (pageCount-1) ? pageLink(pageIndex+1) : null}
		{pageIndex < (pageCount-2) ? pageLink(pageIndex+2) : null}
		{pageIndex < 1 && pageIndex < (pageCount-3) ? pageLink(pageIndex+3) : null}
		{pageIndex < 2 && pageIndex < (pageCount-4) ? pageLink(pageIndex+4) : null}
		<li className={"pagination-button page-item " + (disableNext&&"disabled")} title="next page"><a href="#" onClick={goNext} className="page-link">&gt;</a></li>
		<li className={"pagination-button page-item " + (disableNext&&"disabled")} title="last page"><a href="#" onClick={goTo(pageCount-1)} className="page-link">&gt;&gt;</a></li>
	</ul>
}

export const SimpleReport: <T_Data>(props: SimpleReportRequiredProps<T_Data>) => JSX.Element = props => <SimpleReportComponent
	columns={props.columns}
	data={props.data}
	initialSizePerPage={props.sizePerPage || 12}
	sizePerPageList={props.sizePerPageList}
/>;

