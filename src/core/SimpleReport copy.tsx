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
} from '@tanstack/react-table'
import { Button, ButtonGroup } from 'reactstrap';

type SimpleReportRequiredProps<T_Data, T_Filter = any> = {
	keyField: keyof T_Data
	data: T_Data[]
	columns: ColumnDef<T_Data, any>[]
	sizePerPage?: number
	sizePerPageList?: number[]
	globalFilterState?: T_Filter
	globalFilter?: FilterFnOption<T_Data>//(rows: RowRT<any>[], columnIds: string[], filterValue: any) => RowRT<any>[],
	hidableColumns?: boolean
	showFooter?: boolean
	initialSortBy?: { id: keyof T_Data, desc?: boolean }[]
}

export const SimpleReport: <T_Data, T_Filter>(props: SimpleReportRequiredProps<T_Data, T_Filter>) => JSX.Element = ({ columns, data: dataProp, sizePerPage, sizePerPageList, keyField, globalFilterState, globalFilter, hidableColumns, showFooter, initialSortBy }) => {
	const usingPagination = sizePerPage !== undefined && sizePerPageList !== undefined;
	//const [data, setData] = React.useState(dataProp);
	const table = useReactTable({
		data: dataProp,
		columns,
		globalFilterFn: globalFilter, 
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	});
	//const [state, setState] = React.useState(table.initialState);
	React.useEffect(() => {
		table.setState(e => ({...e, globalFilter: globalFilterState}));
	}, [globalFilterState]);
	//table.setOptions(prev => ({ ...prev, state, onStateChange: setState }));
	const paginationState = table.getState().pagination;
	const pagination = React.useMemo(() => <table>
		<tbody>
			<tr>
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
			</tr>
		</tbody>
	</table>, [table.getState()]);

	const hiddenColumnsControl = hidableColumns ?
		<div style={{ marginBottom: "15px" }}>
			<ButtonGroup>
				{table.getAllColumns().filter((a) => a.getCanHide()).map((a, i) =>
					<Button outline color="primary" size="sm" active={!a.getIsVisible()} key={i} onClick={
						() => a.toggleVisibility()
					}>{flexRender(a.columnDef.header, a)}</Button>)}
				<Button outline color="primary" size="sm" active={true} onClick={
					() => table.getToggleAllColumnsVisibilityHandler.apply(this)
				}>Show All</Button>
			</ButtonGroup>
		</div>
		: null;
	const header = React.useMemo(() => <thead>
		{table.getHeaderGroups().map(headerGroup => (
			<tr key={headerGroup.id}>
				{headerGroup.headers.map(header => (
					<th key={header.id}>
						{header.isPlaceholder
							? null
							: <span onClick={(e) => { return header.column.toggleSorting(header.column.getIsSorted() === "asc") }}>{flexRender(header.column.columnDef.header, header.getContext())}

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
	</thead>, [table.getState()]);
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
			<table>
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

const paginationControls = ({ pageIndex, pageCount, nextPage, previousPage, gotoPage }: PaginationControlsProps) => {
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

	const pageLink = (n: number) => <li className="pagination-button page-item" title={String(n)}><a href="#" onClick={goTo(n)} className="page-link">{n + 1}</a></li>

	const disablePrev = pageIndex == 0;
	const disableNext = (pageIndex == (pageCount - 1)) || pageCount <= 1;

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
