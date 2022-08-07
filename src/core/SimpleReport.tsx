import * as React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import {
	ColumnDef,
	FilterFnOption,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	Table as TableRT,
	Header,
	SortingState
} from '@tanstack/react-table'
import { Button, ButtonGroup, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, Table, UncontrolledButtonDropdown } from 'reactstrap';

type SimpleReportRequiredProps<T_Data, T_Filter = any> = {
	keyField: keyof T_Data
	data: T_Data[]
	columns: ColumnDef<T_Data, any>[]
	sizePerPage?: number
	sizePerPageList?: number[]
	globalFilterState?: T_Filter
	globalFilter?: FilterFnOption<T_Data>
	hidableColumns?: boolean
	showFooter?: boolean
	initialSortBy?: SortingState
}

const handleColumnClick: <T_Data>(header: Header<T_Data, any>) => React.MouseEventHandler<HTMLSpanElement> = (header) => (e) => {
	if(header.column.getCanSort() || header.column.getCanMultiSort()){
		if(e.shiftKey){
			header.column.clearSorting();
		} else {
			if (header.column.getNextSortingOrder() === false) header.column.toggleSorting(header.column.getFirstSortDir() == 'desc');
			else header.column.toggleSorting();
		}
	}
};

export const SimpleReport: <T_Data, T_Filter>(props: SimpleReportRequiredProps<T_Data, T_Filter>) => JSX.Element = ({ columns, data: dataProp, sizePerPage, sizePerPageList, keyField, globalFilterState, globalFilter, hidableColumns, showFooter, initialSortBy }) => {
	const usingPagination = sizePerPage !== undefined && sizePerPageList !== undefined;
	const table = useReactTable({
		data: dataProp,
		columns,
		globalFilterFn: globalFilter, 
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableColumnFilters: false,
		autoResetAll: false,
		enableMultiSort: true,
		defaultColumn: {
			enableMultiSort: true
		},
		initialState: {sorting: initialSortBy},
		sortDescFirst: false,
	});
	const [state, setState] = React.useState(table.initialState);
	table.setOptions(prev => ({ ...prev, state: {...state, globalFilter: globalFilterState}, onStateChange: setState, }));
	const paginationState = state.pagination;
	const pagination = React.useMemo(() => {return usingPagination ? <Row>
		<Col>
			<UncontrolledButtonDropdown  className="mr-1 mb-1">
				<DropdownToggle caret >{paginationState.pageSize}</DropdownToggle>
				<DropdownMenu>
					{sizePerPageList.map(s => <DropdownItem key={s} onClick={() => table.setPageSize(s)}>{s}</DropdownItem>)}
				</DropdownMenu>
			</UncontrolledButtonDropdown>
		</Col>
		<Col>
			{paginationControls(table)}
		</Col>
	</Row> : undefined}, [state, dataProp]);
	const hiddenColumnsControl = hidableColumns ?
		<div style={{ marginBottom: "15px" }}>
			<ButtonGroup>
				{table.getAllColumns().filter((a) => (typeof a.columnDef.header != 'function') && a.getCanHide()).map((a, i) => {
					const text = flexRender(a.columnDef.header, a)
					return <Button outline color="primary" size="sm" active={!a.getIsVisible()} key={i} onClick={
						() => a.toggleVisibility(!a.getIsVisible())
					}>{text}</Button>
				})}

				<Button outline color="primary" size="sm" active={true} onClick={
					() => table.toggleAllColumnsVisible(true)
				}>Show All</Button>
			</ButtonGroup>
		</div>
		: null;
	const header = React.useMemo(() => <thead>
		{table.getHeaderGroups().map(headerGroup => (
			<tr key={headerGroup.id}>
				{headerGroup.headers.map(header => (
					<th key={header.id} style={{verticalAlign: "middle", width: header.column.getSize()}}>
						{header.isPlaceholder
							? null
							: <span onClick={handleColumnClick(header)}>{flexRender(header.column.columnDef.header, header.getContext())}
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
	</thead>, [state, columns]);
	const footer = React.useMemo(() => {
		showFooter === true ? <tfoot>
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
		</tfoot> : undefined
	}, []);
	return (
		<div className="p-2">
			<Table striped bordered >
				{header}
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
				{footer}
			</Table>
			<div className="h-4" />
			{pagination}
			{hiddenColumnsControl}
		</div>
	);
};

function paginationControls<T_Data> (table: TableRT<T_Data>) {
	const goNext = (e: React.MouseEvent) => {
		e.preventDefault();
		table.nextPage();
	}

	const goPrevious = (e: React.MouseEvent) => {
		e.preventDefault();
		table.previousPage();
	}

	const goTo = (n: number) => (e: React.MouseEvent) => {
		e.preventDefault();
		table.setPageIndex(n);
	}

	const pageIndex = table.getState().pagination.pageIndex;
	const pageCount = table.getPageCount();

	const pageLink = (n: number) => <li className="pagination-button page-item" title={String(n)}><a href="#" onClick={goTo(n)} className="page-link">{n + 1}</a></li>

	const disablePrev = !table.getCanPreviousPage();
	const disableNext = !table.getCanNextPage();

	return <ul style={{ justifyContent: "flex-end" }} className="pagination">
		<li className={"pagination-button page-item " + (disablePrev && "disabled")} title="first page"><a href="#" onClick={goTo(0)} className="page-link">&lt;&lt;</a></li>
		<li className={"pagination-button page-item " + (disablePrev && "disabled")} title="previous page"><a href="#" onClick={goPrevious} className="page-link">&lt;</a></li>
		{pageIndex > (pageCount - 2) && pageIndex > 3 ? pageLink(pageIndex - 4) : null}
		{pageIndex > (pageCount - 3) && pageIndex > 2 ? pageLink(pageIndex - 3) : null}
		{pageIndex > 1 ? pageLink(pageIndex - 2) : null}
		{pageIndex > 0 ? pageLink(pageIndex - 1) : null}
		<li className="active pagination-button page-item" title="4"><a href="#" onClick={e => e.preventDefault()} className="page-link">{pageIndex + 1}</a></li>
		{pageIndex < (pageCount - 1) ? pageLink(pageIndex + 1) : null}
		{pageIndex < (pageCount - 2) ? pageLink(pageIndex + 2) : null}
		{pageIndex < 2 && pageIndex < (pageCount - 3) ? pageLink(pageIndex + 3) : null}
		{pageIndex < 1 && pageIndex < (pageCount - 4) ? pageLink(pageIndex + 4) : null}
		<li className={"pagination-button page-item " + (disableNext && "disabled")} title="next page"><a href="#" onClick={goNext} className="page-link">&gt;</a></li>
		<li className={"pagination-button page-item " + (disableNext && "disabled")} title="last page"><a href="#" onClick={goTo(pageCount - 1)} className="page-link">&gt;&gt;</a></li>
	</ul>
}

