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
import Modal, { ModalFoooter, ModalHeader } from "../wrapped/Modal";
import { option } from "fp-ts";
import * as moment from 'moment';
import Form from "../wrapped/Form";
import { AppStateContext } from "app/state/AppStateContext";

export type UpdateStateType = ((id: string, value: string | boolean) => void) & ((id: string[], value: string[] | boolean[]) => void);

export type TableWithModalFormProps<T_Row, T_Filter, T_RowEdit> = {
	columns: ColumnDef<T_Row>[]
	formComponents: (rowForEdit: T_RowEdit, updateState: UpdateStateType) => JSX.Element
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
} & TableWithModalFormProps<T_Row, T_Filter, T_RowEdit>

export type TableWithModalFormStringifiedProps<T_Row extends t.TypeOf<T_Validator>, T_Validator extends t.TypeC<any>, T_Filter> = {
	keyField: string & keyof T_Row
} & Omit<TableWithModalFormAsyncProps<T_Row, T_Validator, T_Filter, StringifiedProps<T_Row>>, 'keyField' | 'processEditRowForValidator' | 'processEditRowForSubmit' | 'defaultRowEdit'>

/*if (props.validateSubmit) {
					const errors = props.validateSubmit(formData.rowForEdit);
					if (errors.length > 0) {
						setValidationErrors(errors);
						resolve(null);
						return;
					}
				}

				// Turn empty strings to nulls, then turn strings back to numbers/booleans
				// HOWEVER, do not turn optional values back into options.  The validator is expecting the same shape as what would have come from the server,
				// ie either a value or null.

				//destringify(props.rowValidator, nullifyEmptyStrings(formData.rowForEdit), false, props.keyField);
				const candidateForValidation = props.editRowToRow(formData);
				// On a create, ID will be null which is not ok per the validator.  Shove some crap in there to make it happy
				const pkValue = candidateForValidation[props.keyField] == null ? -1 : candidateForValidation[props.keyField];



				//const validateResult
				/*props.rowValidator.decode({
					...candidateForValidation,
					[props.keyField]: pkValue
				});



				const validationResults = validateResult.isLeft() ? validateResult.value.filter((a) => {return !props.columnsNonEditable.includes(a.context[1].key as K)}) : [];
				const isValid = validateResult.isRight() || validationResults.length == 0;
				const result = props.validateAndSubmit(candidateForValidation);
				const rowMatches: (r: U) => boolean = r => {
					const pk = r[props.keyField];
					if (pk["_tag"]) {
						return (pk as unknown as Option<any>).map(p => String(p)).getOrElse("") == formData.rowForEdit[props.keyField]
					} else {
						return String(pk) == formData.rowForEdit[props.keyField]
					}
				}
				if (isValid) {
					// Destringify again, this time turning optional values back into options. It's a bit pointless since
					// they will be stripped out again before sending to the server, but ApiWrapper expects actual option values
					// Besides, we need to give that value back to the table anyway.
					const toSend = destringify(props.rowValidator, nullifyEmptyStrings(formData.rowForEdit), true, props.keyField);
					var toSendEditable = toSend;
					if(props.columnsNonEditable !== undefined){
						toSendEditable = Object.assign({}, toSend);
						props.columnsNonEditable.forEach((a) => {
							const v = a as keyof typeof toSend;
							toSendEditable[v] = undefined;
						});
					}
					props.submitRow.sendJson(toSendEditable).then(ret => {
						if (ret.type == "Success") {
							closeModal();
							const isUpdate = rowData.find(rowMatches) != null;
							const toAdd = (
								props.postSubmit
								? props.postSubmit(toSend)
								: toSend
							)
							if (isUpdate) {
								// was an update.  Find the row and update it
								console.log(updateRowData);
								updateRowData(rowData.map(row => {
									if (rowMatches(row)) {
										if(props.columnsNonEditable !== undefined){
											return {...ret.success, ...getOnlyNonEditableFields(formData)};
										}else{
											return { ...toAdd, [props.keyField]:( toAdd[props.keyField])};
										}
									} else {
										return row;
									}
								}))
							} else {
								// was a create.  Add the new row after injecting the PK from the server
								const newPkRaw = ret.success[props.keyField];
								const newPk = (
									newPkRaw["_tag"]
									? (newPkRaw as Option<number>).getOrElse(null)
									: newPkRaw
								)
								updateRowData(rowData.concat([{
									...toAdd,
									[props.keyField]: newPk
								}]))
							}
						} else {
							//setValidationErrors([{key: undefined, display: ret.message}]);
						}
						resolve(null);
					})
				} else {
					//setValidationErrors(validationResults.map((b) => ({key:(((b || {}).context || [])[1] || {}).key, display: b.message})).filter((b) => b != undefined));
					console.log(validateResult.swap().getOrElse(null));
				}
*/

export function TableWithModalFormStringified<T_Row extends t.TypeOf<T_Validator>, T_Validator extends t.TypeC<any>, T_Filter = any>(props: TableWithModalFormStringifiedProps<T_Row, T_Validator, T_Filter>){
	return <TableWithModalFormAsync {...props} defaultRowEdit={stringifyAndMakeBlank(props.validator)}processEditRowForSubmit={(editRow) => {
		return destringify(props.validator, nullifyEmptyStrings(editRow), true, props.keyField);
	}} processEditRowForValidator={(editRow) => {
		return destringify(props.validator, nullifyEmptyStrings(editRow), false, props.keyField);
	}}></TableWithModalFormAsync>
}

export function TableWithModalFormAsync<T_Row, T_Validator extends t.TypeC<any>, T_Filter = any, T_RowEdit = T_Row>(props: TableWithModalFormAsyncProps<T_Row, T_Validator, T_Filter, T_RowEdit>){
	const asc = React.useContext(AppStateContext);
	const {validator, action, validate, submit, ...other} = props;
	return <TableWithModalForm {...other} validate={(row) => {
		const resultOne = validate ? validate(row) : [];
		if(resultOne.length > 0)
			return resultOne;
		const result = validator.decode(row);
		if(result.isRight()){
			return [];
		}
		return result.swap().getOrElse(null).map((a) => a.message);
	}} submit={(row) => {
		action.sendJson(asc, row).then((a) => {
			if(a.type == "Success"){
				return Promise.resolve(row)
			}
		})
		return Promise.resolve(row);
	}}/>
}

export default function TableWithModalForm<T_Row, T_Filter, T_RowEdit = T_Row>(props: TableWithModalFormProps<T_Row, T_Filter, T_RowEdit>) {

	const [modalIsOpen, setModalIsOpen] = React.useState(false);
	//const [validationErrors, setValidationErrors] = React.useState([] as validationError[]);
	const [formData, setFormData] = React.useState(props.defaultRowEdit);

	var rowData = props.rows;
	var updateRowData = (u) => {props.setRowData(u)};
	if(!updateRowData){
		[rowData, updateRowData] = React.useState(props.rows);
	}

	const editColumn: ColumnDef<T_Row, any> = {
		id: "edit",
		size: 45,
		cell: ({row}) => <a href="" onClick={e => {
			e.preventDefault();
			openForEdit(some(row.original[props.keyField] as unknown as number));
		}}><EditIcon color="#777" size="1.4em" /></a>
	}

	const data = React.useMemo(() => rowData.map(r => {
		const pk = r[props.keyField];
		if (pk["_tag"]) throw "Option PK Found"
		return r
	}), [rowData]);
	const report = <Table 
		keyField={props.keyField}
		rows={data}
		columns={[editColumn, ...props.columns]}
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
			setFormData(props.processRowForEdit(row));
		} else {
			setFormData(props.defaultRowEdit)
		}
	}

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
			props.submit(rowToSubmit).then((a) => {
				
			})
		}else{

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
				console.log("submitted");
				submit();
				return undefined;
			}}>
				{props.formComponents(formData, updateStatesCombined)}
			</Form>
			{!props.customFooter ? <ModalFoooter>
				<div>
					<Button color="secondary" onClick={closeModal}>
						Cancel
					</Button>{" "}
					<Button spinnerOnClick onSubmit={() => {submit(); return Promise.resolve()}} >
						Save
					</Button>
				</div>
			</ModalFoooter> : props.customFooter(submit, closeModal) }
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
		initValue:initMoment.isValid() ? option.some(initMoment) : option.none,
		updateValue:(v) => {
			updateState(rowId, v.getOrElse(moment()).format())
		},
		validationResults: validationResults.filter((a) => a["key"] == rowId),
		id: rowId
	};
}

export function wrapForFormComponents (rowForEdit: any, updateState: UpdateStateType, rowId: string, validationResults: string[], isNumerical: boolean = false){
	return {
		initValue:option.some(rowForEdit[rowId]),
		updateValue:(v) => {
			updateState(rowId, v.getOrElse(isNumerical? -1: ""));
		},
		validationResults: validationResults.filter((a) => a["key"] == rowId),
		id: rowId
	};
}