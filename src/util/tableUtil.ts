import { Option } from "fp-ts/lib/Option";
import { IdType, Row, SortByFn } from "react-table";

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

export const SortTypeOption: <T, D extends object>(mapper: (v: any) => T) => SortByFn<D> = mapper => SortType(v => mapper((v as Option<any>).getOrElse(null)))

export const SortTypeOptionalString = SortTypeOption(String)
export const SortTypeOptionalNumber = SortTypeOption(Number)
export const SortTypeOptionalStringCI = SortTypeOption(v => String(v).toLowerCase())
export const SortTypeStringCI = SortType(v => String(v).toLowerCase())
export const SortTypeBoolean = SortType(v => !Boolean(v))
