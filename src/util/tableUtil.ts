import { Option } from "fp-ts/lib/Option";
import { IdType, Row, SortByFn } from "react-table";
import * as moment from "moment";
import { ColumnDef, createColumnHelper, RowData } from "@tanstack/react-table";
import { SignoutTablesState } from "pages/dockhouse/signouts/SignoutsTablesPage";
import { TableColumnOptionsCbi } from "react-table-config";
import * as t from "io-ts";

export const tableColWidth = (w: number) => ({
	style: { width: w+"px" },
	headerStyle: { width: w+"px" }
})

export const CellBooleanIcon: (icon: JSX.Element) => (props: {value: boolean}) => JSX.Element = icon => ({value}) => value ? icon : null;
export const CellOption: (props: {value: Option<string>}) => string = ({value}) => value.getOrElse("");

export const SortType: <T, D extends object>(mapper: (v: any) => T) => SortByFn<D> = mapper => (rowA, rowB, columnId, desc) => {
	// return 0;
	const valueA = mapper(rowA.values[columnId])
	const valueB = mapper(rowB.values[columnId])

	if (valueA < valueB) return -1;
	else if (valueA > valueB) return 1;
	else return 0;
}


//export const CellCustomRow = (f: (v) => any) => (a) => f(a.data[a.row.id]);
export const CellOptionMoment = (format: string) => (props: {value: Option<string>}) => moment(props.value.getOrElse("")).format(format)
export const CellOptionTime = (props: {value: Option<string>}) => CellOptionMoment("HH:mm A")(props);

export const SortTypeOption: <T, D extends object>(mapper: (v: any) => T) => SortByFn<D> = mapper => SortType(v => mapper((v as Option<any>).getOrElse(null)))

export const SortTypeOptionalString = SortTypeOption(String)
export const SortTypeOptionalNumber = SortTypeOption(Number)
export const SortTypeOptionalStringCI = SortTypeOption(v => String(v).toLowerCase())
export const SortTypeStringCI = SortType(v => String(v).toLowerCase())
export const SortTypeBoolean = SortType(v => !Boolean(v))

type ColumnType<T_Row> = ColumnDef<T_Row, any>;

//const columnHelper = createColumnHelper<RowData>();

type RowValidatorType<T_Row> = {props: {[key in keyof T_Row]: any}};

export function columnsWrapped<T_Row> (a: TableColumnOptionsCbi[], rowValidator: RowValidatorType<T_Row>): ColumnType<T_Row>[] {
	console.log(Object.keys(rowValidator.props));
	return a.map((b) => columnWrapped(b, rowValidator));
}

function cellWrapped (a){
	return (info) => {console.log(info.getValue()); return (typeof a.Cell === "function" ? a.Cell.apply(this, [{value: info.getValue()}]) : info.getValue())};
}

function columnWrapped<T_Row> (a: TableColumnOptionsCbi, rowValidator: RowValidatorType<T_Row>): ColumnType<T_Row> {
	
	if(typeof a.accessor === "string"){
		if(Object.keys(rowValidator.props).contains(a.accessor) || a.accessor.includes(".") || a.accessor === "edit"){
			return {
				accessorKey: a.accessor as any,
				header: () => a.Header || "",
				cell: cellWrapped(a),
				footer: () => null
			};
		}else{
			return {
				accessorFn: () => "Cronk",
				header: () => a.Header || "",
				id: a.accessor,
				cell: cellWrapped(a),
				footer: () => null
			};
		}
	}else{
		console.log("bad");
		console.log(typeof a.accessor);
		throw "Bad Column Accessor";
	}
}
