import * as React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import { ReactNode } from 'react';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
  } from '@tanstack/react-table'
import { Button, ButtonGroup } from 'reactstrap';

export type SimpleReportColumn = {
	accessor: string,
	Header: ReactNode,
	disableSortBy?: boolean,
	width?: number,
	toggleHidden?: boolean
}

type SimpleReportRequiredProps<T_Data> = {
	keyField: keyof T_Data,
	data: T_Data[],
	columns: ColumnDef<T_Data, any>[],
	sizePerPage?: number,
	sizePerPageList?: number[],
	globalFilter?: any;//(rows: RowRT<any>[], columnIds: string[], filterValue: any) => RowRT<any>[],
	globalFilterValueControlled?: any
	hidableColumns?: boolean
	reportId?: string
	initialSortBy?: {id: keyof T_Data, desc?: boolean}[]
}

export const SimpleReport: <T_Data>(props: SimpleReportRequiredProps<T_Data>) => JSX.Element = ({columns, data: dataProp, sizePerPage, sizePerPageList, keyField, globalFilter, globalFilterValueControlled, hidableColumns, reportId, initialSortBy}) => {
	const usingPagination = sizePerPage !== undefined && sizePerPageList !== undefined;
	const [data, setData] = React.useState(dataProp);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel()});
	const paginationState = table.getState().pagination;
	const pagination = React.useMemo(() => <tr>
		<td>
			<select value={table.getState().pagination.pageSize} onChange={(e) => table.setPageSize(Number(e.target.value))}>
					{sizePerPageList.map(s => <option key={s}>{s}</option>)}
			</select>
		</td>
		<td>
			{paginationControls({
				pageIndex: paginationState.pageIndex,
				pageCount: table.getPageCount(),
				nextPage: () => table.nextPage(),
				previousPage: () => table.previousPage(),
				gotoPage: (n) => table.setPageIndex(n)
			})}
		</td>
	</tr>, [table.getState()]);
	
	const hiddenColumnsControl = hidableColumns ? 
			<table style={{marginBottom:"15px"}}>
				<ButtonGroup>
					{table.getAllColumns().filter((a) => false).map((a, i) =>
						<Button outline color="primary" size="sm" active={!a.getIsVisible()} key={i} onClick={
							() => a.toggleVisibility()
						}>{flexRender(a.columnDef.cell, a)}</Button>)}
						<Button outline color="primary" size="sm" active={true} onClick={
							() => table.getToggleAllColumnsVisibilityHandler.apply(this)
						}>Show All</Button>
				</ButtonGroup>
			</table>
	: null;
	
	  return (
		<div className="p-2">
		  <table>
			<thead>
			  {table.getHeaderGroups().map(headerGroup => (
				<tr key={headerGroup.id}>
				  {headerGroup.headers.map(header => (
					<th key={header.id}>
					  {header.isPlaceholder
						? null
						: <span onClick={(e) => header.column.toggleSorting(header.column.getIsSorted() === "asc")}>{flexRender(header.column.columnDef.header, header.getContext())}
						
							{header.column.getIsSorted() !== false ? (
								header.column.getIsSorted() === "desc" ? (
									<FontAwesomeIcon icon={faSortUp} className="ms-2" />
								) : (
									<FontAwesomeIcon icon={faSortDown} className="ms-2" />
								)
							) : null}
						</span>}
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
			</tbody>
			<tfoot>
			  {table.getFooterGroups().map(footerGroup => (
				<tr key={footerGroup.id}>
				  {footerGroup.headers.map(header => (
					<th key={header.id}>
					  {header.isPlaceholder
						? null
						: flexRender(
							header.column.columnDef.footer,
							header.getContext()
						  )}
					</th>
				  ))}
				</tr>
			  ))}
			</tfoot>
		  </table>
		  <div className="h-4" />
		  {pagination}
		  {hiddenColumnsControl}
		  </div>
	  );
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
		{pageIndex > (pageCount-2) && pageIndex > 3 ? pageLink(pageIndex-4) : null}
		{pageIndex > (pageCount-3) && pageIndex > 2 ? pageLink(pageIndex-3) : null}
		{pageIndex > 1 ? pageLink(pageIndex-2) : null}
		{pageIndex > 0 ? pageLink(pageIndex-1) : null}
		<li className="active pagination-button page-item" title="4"><a href="#" onClick={e => e.preventDefault()} className="page-link">{pageIndex+1}</a></li>
		{pageIndex < (pageCount-1) ? pageLink(pageIndex+1) : null}
		{pageIndex < (pageCount-2) ? pageLink(pageIndex+2) : null}
		{pageIndex < 2 && pageIndex < (pageCount-3) ? pageLink(pageIndex+3) : null}
		{pageIndex < 1 && pageIndex < (pageCount-4) ? pageLink(pageIndex+4) : null}
		<li className={"pagination-button page-item " + (disableNext&&"disabled")} title="next page"><a href="#" onClick={goNext} className="page-link">&gt;</a></li>
		<li className={"pagination-button page-item " + (disableNext&&"disabled")} title="last page"><a href="#" onClick={goTo(pageCount-1)} className="page-link">&gt;&gt;</a></li>
	</ul>
}
