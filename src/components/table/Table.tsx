import * as React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import {
	Edit as EditIcon,
} from 'react-feather';

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
import Button from 'components/wrapped/Button';
import Menu from 'components/wrapped/Menu';

export type TableProps<T_Data, T_Filter = any> = {
	keyField: keyof T_Data
	rows: T_Data[]
	columns: ColumnDef<T_Data, any>[]
	sizePerPage?: number
	sizePerPageList?: number[]
	globalFilterState?: T_Filter
	globalFilter?: FilterFnOption<T_Data>
	hidableColumns?: boolean
	showFooter?: boolean
	initialSortBy?: SortingState
	openEditRow?: (row: T_Data) => void
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

export const Table: <T_Data, T_Filter>(props: TableProps<T_Data, T_Filter>) => JSX.Element = ({ columns, rows: dataProp, sizePerPage, sizePerPageList, keyField, globalFilterState, globalFilter, hidableColumns, showFooter, initialSortBy, openEditRow }) => {
	const usingPagination = sizePerPage !== undefined && sizePerPageList !== undefined;
	const editColumn: typeof columns = [{
		id: "edit",
		size: 45,
		cell: ({row}) => <a href="" onClick={e => {
			e.preventDefault();
			openEditRow(row.original);
			//openForEdit(some(row.original[props.keyField] as unknown as number));
		}}><EditIcon color="#777" size="1.4em" /></a>
	}]
	const table = useReactTable({
		data: dataProp,
		columns: openEditRow? editColumn.concat(columns) : columns,
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
	const pagination = React.useMemo(() => {return usingPagination ? <div className="flex flex-row">
		<div>
			<Menu title={paginationState.pageSize} items={sizePerPageList.map(s => <div key={s} onClick={() => table.setPageSize(s)}>{s}</div>)} />
		</div>
		<div>
			{paginationControls(table)}
		</div>
	</div> : undefined}, [state, dataProp]);
	const hiddenColumnsControl = hidableColumns ?
			<div className="flex flex-row gap-1">
				{table.getAllColumns().filter((a) => (typeof a.columnDef.header != 'function') && a.getCanHide()).map((a, i) => {
					const text = flexRender(a.columnDef.header, a)
					return <Button className="bg-gray-100 rounded-md px-1" activeClass="bg-blue-100" active={!a.getIsVisible()} key={i} onClick={
						() => a.toggleVisibility(!a.getIsVisible())
					}>{text}</Button>
				})}

				<Button className="bg-gray-100 rounded-md px-1" onClick={
					() => table.toggleAllColumnsVisible(true)
				}>Show All</Button>
			</div>
		: null;
	const header = React.useMemo(() => <thead>
		{table.getHeaderGroups().map(headerGroup => (
			<tr key={headerGroup.id}>
				{headerGroup.headers.map(header => (
					<th key={header.id} style={{width: header.column.getSize()}} className="text-center">
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
		<div className="p-2 h-full">
			<table className="table-auto w-full h-full">
				{header}
				<tbody>
					{table.getRowModel().rows.map(row => (
						<tr key={row.id} className="even:bg-gray-100">
							{row.getVisibleCells().map(cell => (
								<td key={cell.id} className="max-w-min text-center">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
				{footer}
			</table>
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

	return <ul className="flex gap-1">
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

