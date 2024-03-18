import * as React from "react";
import * as t from 'io-ts';
import {
	Edit as EditIcon,
} from 'react-feather'
import { Table, TableProps } from "components/table/Table";
import { ErrorPopup } from "components/ErrorPopup";
import { none, Option, some } from "fp-ts/lib/Option";
import APIWrapper from "core/APIWrapper";
import { destringify, nullifyEmptyStrings, StringifiedProps, stringify, stringifyAndMakeBlank } from "util/StringifyObjectProps";
import { SortingState, FilterFnOption, ColumnDef } from "@tanstack/react-table";
import Button from "../wrapped/Button";
import Modal, { ModalHeader } from "../wrapped/Modal";
import { option } from "fp-ts";
import * as moment from 'moment';
import Form from "../wrapped/Form";
import { AppStateContext } from "app/state/AppStateContext";

export type UpdateStateType = ((id: string, value: string | boolean) => void) & ((id: string[], value: string[] | boolean[]) => void);

export type TableWithModalFormProps<T_Row, T_Filter, T_RowEdit> = {
	columns: ColumnDef<T_Row>[]
	formComponents: (rowForEdit: T_RowEdit, updateState: React.Dispatch<React.SetStateAction<T_RowEdit>>) => JSX.Element
	cardTitle?: string
	columnsNonEditable?: (keyof T_Row)[]
	setRowData?: (rows: T_Row[]) => void
	hideAdd?: boolean
	addRowText?: string
	noCard?: boolean
	blockEdit?: {[K: string]: true}
	processEditRowForValidator?: (editRow: T_RowEdit) => T_Row
	processEditRowForSubmit?: (editRow: T_RowEdit) => T_Row
	processRowForEdit?: (row: T_Row) => T_RowEdit
	validate?: (row: T_Row) => string[]
	submit?: (row: T_Row) => Promise<T_Row>
	postSubmit?: (row: T_Row) => T_Row
	defaultRowEdit: T_RowEdit
	className?: string
	customHeader?: boolean
	customFooter?: (submit: () => void, closeModal: () => void) => void
} & TableProps<T_Row, T_Filter>

export type TableWithModalFormAsyncProps<T_Row extends t.TypeOf<T_Validator>, T_Validator extends t.TypeC<any>, T_Filter, T_RowEdit> = {
	validator: T_Validator
	action: APIWrapper<any, any, any>
	useRowFromAPIResponse?: boolean
} & TableWithModalFormProps<T_Row, T_Filter, T_RowEdit>

export type TableWithModalFormStringifiedProps<T_Row extends t.TypeOf<T_Validator>, T_Validator extends t.TypeC<any>, T_Filter> = {
	keyField: string & keyof T_Row
	formComponents: (rowForEdit: StringifiedProps<T_Row>, updateState: UpdateStateType) => JSX.Element
} & Omit<TableWithModalFormAsyncProps<T_Row, T_Validator, T_Filter, StringifiedProps<T_Row>>, 'formComponents' | 'keyField' | 'processEditRowForValidator' | 'processEditRowForSubmit' | 'defaultRowEdit'>

export function TableWithModalFormAsyncStringified<T_Row extends t.TypeOf<T_Validator>, T_Validator extends t.TypeC<any>, T_Filter = any>(props: TableWithModalFormStringifiedProps<T_Row, T_Validator, T_Filter>){
	const {formComponents, ...other} = props;
	return <TableWithModalFormAsync {...other} formComponents={(formData, setFormData) => {

		const updateState = (id: string, value: string | boolean) => {
			const valToSet = (() => {
				if (value === true) return "Y";
				else if (value === false) return "N";
				else return value;
			})();
			setFormData({
					...formData,
					[id]: valToSet
			})
		}

		const updateStates = (id: string[], value: string[] | boolean[]) => {
			const newRowForEdit = Object.assign({}, formData);
			id.forEach((a, i) => {
				(newRowForEdit as any)[a] = String(value[i]);
			});
			setFormData(newRowForEdit);
		}
	
		const updateStatesCombined = (id, value) => {
			if(id instanceof Array<string>){
				updateStates(id, value);
			}else{
				updateState(id, value);
			}
		}
		return formComponents(formData, updateStatesCombined);
	}} defaultRowEdit={stringifyAndMakeBlank(props.validator)}processEditRowForSubmit={(editRow) => {
		return destringify(props.validator, nullifyEmptyStrings(editRow), true, props.keyField);
	}} processEditRowForValidator={(editRow) => {
		return destringify(props.validator, nullifyEmptyStrings(editRow), false, props.keyField);
	}}></TableWithModalFormAsync>
}

export function TableWithModalFormAsync<T_Row, T_Validator extends t.TypeC<any>, T_Filter = any, T_RowEdit = T_Row>(props: TableWithModalFormAsyncProps<T_Row, T_Validator, T_Filter, T_RowEdit>){
	const asc = React.useContext(AppStateContext);
	const {validator, action, useRowFromAPIResponse, validate, submit, ...other} = props;
	return <TableWithModalForm {...other} validate={(row) => {
		const resultOne = validate ? validate(row) : [];
		if(resultOne.length > 0)
			return resultOne;
		const {jpAttendanceId,personId,updatedOn,updatedBy,testResult,testRatingId,signoutDatetime,signinDatetime,sailNumber,hullNumber,didCapsize,createdOn,createdBy,cardNum,comments, ...other} = row as any;
		const result = validator.decode(row);
		if(result.isRight()){
			return [];
		}
		return result.swap().getOrElse(null).map((a) => a.message);
	}} submit={(row) => {
		return action.sendJson(asc, row).then((a) => {
			if(a.type == "Success"){
				if(useRowFromAPIResponse){
					const apiResponseRowValidation = validator.decode(a.success);
					if(apiResponseRowValidation.isRight()){
						return Promise.resolve(apiResponseRowValidation.value)
					}
					console.log("Failed to parse row from api response", apiResponseRowValidation.value);
				}
				return Promise.resolve(row)
			}
		})
	}}/>
}

export function TableWithModalFormAsyncRaw<T_Row, T_Validator extends t.TypeC<any>, T_Filter>(props: TableWithModalFormAsyncProps<T_Row, T_Validator, T_Filter, T_Row>){
	return <TableWithModalFormAsync {...props} processEditRowForSubmit={(a) => a} processRowForEdit={(a) => a} processEditRowForValidator={(a) => a}></TableWithModalFormAsync>;
}

export default function TableWithModalForm<T_Row, T_Filter, T_RowEdit>(props: TableWithModalFormProps<T_Row, T_Filter, T_RowEdit>) {

	const [modalIsOpen, setModalIsOpen] = React.useState(false);
	const [formData, setFormData] = React.useState(props.defaultRowEdit);

	var rowData = props.rows;
	var updateRowData = (u) => {props.setRowData(u)};
	if(!updateRowData){
		[rowData, updateRowData] = React.useState(props.rows);
	}

	const data = React.useMemo(() => rowData.map(r => {
		const pk = r[props.keyField];
		if (pk["_tag"]) throw "Option PK Found"
		return r
	}), [rowData]);
	const report = <Table 
		keyField={props.keyField}
		rows={data}
		columns={props.columns}
		openEditRow={(row) => {
			openForEdit(some(row[props.keyField] as number));
		}}
		sizePerPage={12}
		sizePerPageList={[12, 25, 50, 1000]}
		globalFilterState={props.globalFilterState}
		globalFilter={props.globalFilter}
		hidableColumns={props.hidableColumns}
		initialSortBy={props.initialSortBy}
	/>;

	const openForEdit = (id: Option<number>) => {
		setModalIsOpen(true);
		//setValidationErrors([]);
		if (id.isSome()) {
			const row = rowData.find(i => i[props.keyField] as unknown as number == id.getOrElse(null))
			//setFormData(row);
			setFormData(props.processRowForEdit(row));
		} else {
			setFormData(props.defaultRowEdit)
		}
	}

	function closeModal() {
		setModalIsOpen(false);
		setTimeout(() => setFormData(props.defaultRowEdit), 100); // wait for the animation to hide the modal
	}

	function getOnlyNonEditableFields (currentRow: T_Row){
		const onlyNonEditableRow: T_Row = {} as T_Row;
		if(props.columnsNonEditable === undefined){
			return onlyNonEditableRow;
		}
		props.columnsNonEditable.forEach((a) => {
			onlyNonEditableRow[a] = currentRow[a];
		})
		return onlyNonEditableRow;
	}

	const submit = () => {
		//setValidationErrors([]);

		const rowToValidate = props.processEditRowForValidator(formData);

		const validationErrors = props.validate(rowToValidate);

		if(validationErrors.length == 0){
			const rowToSubmit = props.processEditRowForSubmit(formData);
			console.log("submitting");
			console.log(props.submit);
			return props.submit(rowToSubmit).then((a) => {
				props.setRowData(props.rows.map((b) => b[props.keyField] == a[props.keyField] ? b : a));
			});
		}else{
			return Promise.resolve();
		}
		
	}

	const toRender = <div>
		{report}
		{props.hideAdd !== true ? <Button className="mr-1 mb-1" onClick={() => openForEdit(none) }>{props.addRowText || "Add Row"}</Button> : <></>}
	</div>;

	return <React.Fragment>
		<Modal
			open={modalIsOpen}
			setOpen={closeModal}
			className={props.className}
		>
			{!props.customHeader ? <ModalHeader><h1>Add/Edit</h1></ModalHeader> : <></>}
			<Form formData={{derp: false}} formValidator={t.type({derp: t.boolean})} submit={e => {
				submit();
				return undefined;
			}}>
				{modalIsOpen ? props.formComponents(formData, setFormData) : <></>}
			</Form>
			{!props.customFooter ? <>
				<div>
					<Button color="secondary" onClick={closeModal}>
						Cancel
					</Button>{" "}
					<Button spinnerOnClick submit={submit} >
						SaveC
					</Button>
				</div>
			</> : props.customFooter(submit, closeModal) }
		</Modal>
		{props.noCard ? toRender : <div>
			<div>
				<div className="mb-0">{props.cardTitle ?? "Report Table"}</div>
			</div>
			<div>
				{toRender}
			</div>
		</div>}
	</React.Fragment>;
}


export function wrapForFormComponentsMoment(rowForEdit: any, updateState: UpdateStateType, rowId: string, validationResults: string[]){
	const initMoment = moment(rowForEdit[rowId]);
	return {
		controlledValue:initMoment.isValid() ? option.some(initMoment) : option.none,
		updateValue:(v) => {
			updateState(rowId, v.getOrElse(moment()).format())
		},
		validationResults: validationResults.filter((a) => a["key"] == rowId),
		id: rowId
	};
}

export function wrapForFormComponents (rowForEdit: any, updateState: UpdateStateType, rowId: string, validationResults: string[], isNumerical: boolean = false){
	return {
		controlledValue:option.some(rowForEdit[rowId]),
		updateValue:(v) => {
			updateState(rowId, v.getOrElse(isNumerical? -1: ""));
		},
		validationResults: validationResults.filter((a) => a["key"] == rowId),
		id: rowId
	};
}