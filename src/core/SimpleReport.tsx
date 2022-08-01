/*import * as React from 'react';

import {Button, Col, Row, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledButtonDropdown, Input, Label, Form, Popover, PopoverBody, PopoverHeader, UncontrolledPopover, ButtonGroup, FormGroup, Card} from 'reactstrap'
import { useTable, useSortBy, usePagination, Row as RowRT, TableOptions, TableInstance, useFilters, Column, DefaultFilterTypes, FilterType, useGlobalFilter, PluginHook } from "react-table";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import { ReactNode } from 'react';

import { TableOptionsCbi, TableInstanceCbi, TableStateCbi, TableColumnOptionsCbi } from 'react-table-config';
import { DisplayableProps } from 'util/StringifyObjectProps';

export type SimpleReportColumn = {
	accessor: string,
	Header: ReactNode,
	disableSortBy?: boolean,
	width?: number,
	toggleHidden?: boolean
}

type SimpleReportRequiredProps<T_Data> = {
	keyField: keyof T_Data,
	data: T_Data[] | DisplayableProps<T_Data[]>,
	columns: TableColumnOptionsCbi[],
	sizePerPage?: number,
	sizePerPageList?: number[],
	globalFilter?: (rows: RowRT<any>[], columnIds: string[], filterValue: any) => RowRT<any>[],
	globalFilterValueControlled?: any
	hidableColumns?: boolean
	reportId?: string
	initialSortBy?: {id: keyof T_Data, desc?: boolean}[]
}

export type FilterFunctionType = (rows: RowRT<any>[], columnIds: string[], filterValue: any) => RowRT<any>[];

export type PreviousValuesType = {params: any, rows: RowRT<any>[]};

const memoizedFilter : (previousValues: PreviousValuesType, setPreviousValues: (previousValues: PreviousValuesType) => void, filterFunction: FilterFunctionType) => FilterFunctionType = (previousValues, setPreviousValues, filterFunction) => {
	const wrappedFilterFunction: FilterFunctionType = (rows, columnIds, filterValue) => {
		const newParams = JSON.stringify({r: rows.map((a) => String(a.values)), c: columnIds, f: filterValue});
		if(newParams != previousValues.params){
			const filteredRows = filterFunction(rows, columnIds, filterValue);
			const newValues = {params: newParams, rows: filteredRows};
			setPreviousValues(newValues);
			return filteredRows;
		}
		return previousValues.rows;
	}
	return wrappedFilterFunction;
}

export const SimpleReport: <T_Data>(props: SimpleReportRequiredProps<T_Data>) => JSX.Element = ({columns, data: dataProp, sizePerPage, sizePerPageList, keyField, globalFilter, globalFilterValueControlled, hidableColumns, reportId, initialSortBy}) => {
	const usingPagination = sizePerPage !== undefined && sizePerPageList !== undefined;
	const [data, setData] = React.useState(dataProp);
	//const globalFilter = React.useMemo((rows, cols, filter) => {console.log("sdlfjskdfsdjfksjdfksdfl"); return rows}, [data, globalFilterS]);
	React.useEffect(() => {
		setData(dataProp);
	}, [dataProp]);

	const [previousValues, setPreviousValues] = React.useState({} as PreviousValuesType);

	const tableInstance = (function() {
		const config = {
			columns,
			data,
			disableSortRemove: true,
			globalFilter: globalFilter,
			initialState: {
				pageSize: sizePerPage,
				...(initialSortBy ? {sortBy: initialSortBy} : {})
			},
			autoResetPage: false,
			autoResetExpanded: false,
			autoResetGroupBy: false,
			autoResetSelectedRows: false,
			autoResetSortBy: false,
			autoResetFilters: true,
			autoResetRowState: false,
			autoResetGlobalFilter: false

			
		} as TableOptionsCbi<any>;

		var plugins:PluginHook<any>[] = [];

		if(globalFilter !== undefined){
			plugins.push(useGlobalFilter);
		}

		plugins.push(useSortBy);

		if(usePagination){
			plugins.push(usePagination);
		}

		return useTable(
			config,
			...plugins
		) as TableInstanceCbi<any>;
	}());

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		rows,
		page,
		allColumns,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		setFilter,
		setAllFilters,
		setGlobalFilter,
		filteredRows,
		setHiddenColumns,
		allColumnsHidden,
		preFilteredRows,
		toggleHideAllColumns,
		state,
	} = (tableInstance);


	const {pageIndex, pageSize} = state as TableStateCbi<any>;
	//console.log("oh oh" + String(filterValue));
	//setGlobalFilter("filter");
	//const memoizedFilteredRows = React.useMemo(() => globalFilter(rows, allColumns.map((a) => a.id), filterValue), [data, preFilteredRows, allColumns, filterValue]);
	//tableInstance.globalFilter = (a, b, c) => memoizedFilteredRows;

	if(setGlobalFilter){
		React.useEffect(() => {setGlobalFilter(globalFilterValueControlled);}, [globalFilterValueControlled]);
	}

	const pagination = React.useMemo(() => <Row>
		<Col>
			<UncontrolledButtonDropdown  className="mr-1 mb-1">
				<DropdownToggle caret >{pageSize}</DropdownToggle>
				<DropdownMenu>
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
	</Row>, [pageSize, pageIndex, pageCount]);

	const dataToUse = usingPagination ? page : rows;
	
	const hiddenColumnsControl = hidableColumns ? 
			<Form style={{marginBottom:"15px"}}>
				<ButtonGroup>
					{allColumns.filter((a) => a['canSort'] === true).map((a, i) =>
						<Button outline color="primary" size="sm" active={!a.isVisible} key={i} onClick={
							() => a.toggleHidden()
						}>{a.render("Header")}</Button>)}
						<Button outline color="primary" size="sm" active={true} onClick={
							() => toggleHideAllColumns(false)
						}>Show All</Button>
				</ButtonGroup>
			</Form>
	 : null;

	return <>
		<Table striped bordered {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column: any) => {
							//console.log(column);
							// Add the sorting props to control sorting. For this example
							// we can add them into the header props
							const thProps = column.getHeaderProps(column.getSortByToggleProps());
							//console.log(thProps);
							thProps.style = thProps.style || {};
							if (column.width) {
								thProps.style.width = column.width+"px"
							}
							return <th {...thProps}>
								{column.render("Header")}
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
						})}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{dataToUse.map((row, i) => {
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
		{hiddenColumnsControl}
		{usingPagination ? pagination : null}
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
*/