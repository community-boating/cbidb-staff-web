import { Option } from "fp-ts/lib/Option";
import * as moment from "moment";
import { Cell, ColumnDef, ColumnDefTemplate, createColumnHelper, RowData, SortingFn } from "@tanstack/react-table";
import { SignoutTablesState } from "pages/dockhouse/signouts/SignoutsTablesPage";
import { TableColumnOptionsCbi } from "react-table-config";
import * as t from "io-ts";
import { CellValue } from "react-table";

export const tableColWidth = (w: number) => ({
	style: { width: w+"px" },
	headerStyle: { width: w+"px" }
})

export const CellBooleanIcon: (icon: JSX.Element) => (props: {getValue: () => boolean}) => JSX.Element = icon => ({getValue}) => getValue() ? icon : null;
//export const CellOption: (props: {value: Option<string>}) => string = ({value}) => value.getOrElse("");
type OptionBaseType = (props: {getValue: () => Option<any>}) => any;
export const CellOption: OptionBaseType = (props) => CellOptionBase("")(props);
export const CellOptionBase: (noneText: string) => OptionBaseType = (noneText) => (props) => props.getValue().getOrElse(noneText);

export const CellSelect = (hr) => (a) => (hr.find((b) => b.value === a.getValue()) || { display: "Loading..." }).display;

export function getEditColumn<U>(size: number): ColumnDef<U, any> {
	return {
		accessorFn: (a) => a['edit'],
		id: "edit",
		header: "",
		enableSorting: false,
		enableHiding: false,
		size: size,
		cell: (a) => a.getValue()
	}
};

export const SortType: <T, D>(mapper: (v: any) => T) => SortingFn<D> = mapper => (rowA, rowB, columnId) => {
	// return 0;
	const valueA = mapper(rowA.original[columnId])
	const valueB = mapper(rowB.original[columnId])

	if (valueA < valueB) return -1;
	else if (valueA > valueB) return 1;
	else return 0;
}


//export const CellCustomRow = (f: (v) => any) => (a) => f(a.data[a.row.id]);
export const CellOptionMoment = (format: string) => (a) => {return moment(a.getValue().getOrElse("")).format(format)}
export const CellOptionTime = (a) => CellOptionMoment("hh:mm A")(a);

export const SortTypeOption: <T, D>(mapper: (v: any) => T) => SortingFn<D> = mapper => SortType(v => mapper((v as Option<any>).getOrElse(null)))

export const SortTypeOptionalString = SortTypeOption<string, any>(String)
export const SortTypeOptionalNumber = SortTypeOption<number, any>(Number)
export const SortTypeOptionalStringCI = SortTypeOption<string, any>(v => String(v).toLowerCase())
export const SortTypeStringCI = SortType(v => String(v).toLowerCase())
export const SortTypeBoolean = SortType<boolean, any> (v => !Boolean(v))

type ColumnType<T_Row> = ColumnDef<T_Row, any>;

//const columnHelper = createColumnHelper<RowData>();

type RowValidatorType<T_Row> = {props: {[key in keyof T_Row]: any}};