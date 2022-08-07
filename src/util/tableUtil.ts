import { Option } from "fp-ts/lib/Option";
import * as moment from "moment";
import { ColumnDef, ColumnDefTemplate, createColumnHelper, Row, RowData, SortingFn } from "@tanstack/react-table";

export const tableColWidth = (w: number) => ({
	style: { width: w+"px" },
	headerStyle: { width: w+"px" }
})
type OptionBaseType = (props: {getValue: () => unknown}) => string;
export const CellOption: OptionBaseType = (props) => CellOptionBase("")(props);

export const CellOptionBase: (noneText: string) => OptionBaseType = (noneText) => (props) => (props.getValue() as Option<string>).getOrElse(noneText);
export const CellBooleanIcon: (icon: JSX.Element) => (props: {getValue: () => unknown}) => JSX.Element = icon => ({getValue}) => getValue() ? icon : null;

export const CellSelect = (hr) => (a) => (hr.find((b) => b.value === a.getValue()) || { display: "Loading..." }).display;

export function SortType<T, D extends object>(mapper: (v: any) => T) {
	return function(rowA: Row<D>, rowB: Row<D>, columnId: string) {
		const valueA = mapper(rowA.getValue(columnId))
		const valueB = mapper(rowB.getValue(columnId))
	
		if (valueA < valueB) return -1;
		else if (valueA > valueB) return 1;
		else return 0;
	}
}

//export const CellCustomRow = (f: (v) => any) => (a) => f(a.data[a.row.id]);
export const CellOptionMoment = (format: string) => (a) => {return moment(a.getValue().getOrElse("")).format(format)}
export const CellOptionTime = (a) => CellOptionMoment("hh:mm A")(a);

export const SortTypeOption: <T, D extends object>(mapper: (v: any) => T) => SortingFn<D> =
mapper => SortType(v => mapper((v as Option<any>).getOrElse(null)))

export function SortTypeOptionalString<T extends object>(rowA: Row<T>, rowB: Row<T>, columnId: string) {
	return SortTypeOption<string, T>(String)(rowA, rowB, columnId);
}
export const SortTypeOptionalNumber = SortTypeOption(Number)
export function SortTypeOptionalStringCI<T extends object>(rowA: Row<T>, rowB: Row<T>, columnId: string) {
	return SortTypeOption<string, T>(v => String(v).toLowerCase())(rowA, rowB, columnId);
}
export function SortTypeStringCI<T extends object>(rowA: Row<T>, rowB: Row<T>, columnId: string) {
	return SortType<string, T>(v => String(v).toLowerCase())(rowA, rowB, columnId);
}
export function SortTypeBoolean<T extends object>(rowA: Row<T>, rowB: Row<T>, columnId: string) {
	return SortType<boolean, T>(v => !Boolean(v))(rowA, rowB, columnId);
}

type ColumnType<T_Row> = ColumnDef<T_Row, any>;

//const columnHelper = createColumnHelper<RowData>();

type RowValidatorType<T_Row> = {props: {[key in keyof T_Row]: any}};

function cellWrapped (a){
	return (info) => { return (typeof a.Cell === "function" ? a.Cell.apply(this, [{value: info.getValue()}]) : info.getValue())};
}

