import { Cell, ColumnDef, Header } from "@tanstack/react-table";



export class InteractiveColumnProvider<T_Data, T_Extra, T_Value> {
    columnsStateless: InteractiveColumnDef<T_Data, T_Extra, T_Value>[]
    currentExtra: T_Extra;
    constructor(columns: InteractiveColumnDef<T_Data, T_Extra, T_Value>[]){
        this.columnsStateless = columns.map((a) => {
            const newA = Object.assign({}, a);
            if(a.cellWithExtra !== undefined){
                newA.cell = (b) => a.cellWithExtra(b, this.getExtra());
            }
            if(a.headerWithExtra !== undefined){
                newA.header = (b) => a.headerWithExtra(b, this.getExtra());
            }
            return newA;
        });
    }
    getExtra(): T_Extra{
        return this.currentExtra;
    }
    provideColumns(extraState: T_Extra): ColumnDef<T_Data, T_Value>[]{
        this.currentExtra = extraState;
        return this.columnsStateless;
    }
}

type TypeCellContext<T_Data, T_Value> = ReturnType<Cell<T_Data, T_Value>['getContext']>;
type TypeHeaderContext<T_Data, T_Value> = ReturnType<Header<T_Data, T_Value>['getContext']>;


export type InteractiveColumnDef<T_Data, T_Extra, T_Value> = ColumnDef<T_Data, any> & {cellWithExtra?: (cell: TypeCellContext<T_Data, T_Value>, extraState: T_Extra) => T_Value, headerWithExtra?: (header: TypeHeaderContext<T_Data, T_Value>, extraState: T_Extra) => T_Value};