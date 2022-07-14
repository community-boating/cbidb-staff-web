import * as React from "react";
import * as t from 'io-ts';
import { Card, CardHeader, CardTitle, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form } from 'reactstrap';
import {
	Edit as EditIcon,
} from 'react-feather'
import { FilterFunctionType, PreviousValuesType, SimpleReport, SimpleReportColumn } from "core/SimpleReport";
import { ErrorPopup } from "components/ErrorPopup";
import { none, Option, some } from "fp-ts/lib/Option";
import APIWrapper from "core/APIWrapper";
import { ButtonWrapper } from "./ButtonWrapper";
import { destringify, DisplayableProps, nullifyEmptyStrings, StringifiedProps, stringify, stringifyAndMakeBlank } from "util/StringifyObjectProps";
import { left } from "fp-ts/lib/Either";
import { Editable } from "util/EditableType";
import { option } from "fp-ts";
import { ReactNode } from "react";
import { Row } from "react-table";
import { TableColumnOptionsCbi } from "react-table-config";

export type validationError = {
	key: string,
	display: string
} | string

export type UpdateStateType = ((id: string, value: string | boolean) => void) & ((id: string[], value: string[] | boolean[]) => void);

export default function ReportWithModalForm<K extends keyof U, T extends t.TypeC<any>, U extends object = t.TypeOf<T>>(props: {
	rowValidator: T
	rows: U[],
	primaryKey: string & keyof U,
	columns: TableColumnOptionsCbi[],
	formComponents: (rowForEdit: StringifiedProps<U>, updateState: UpdateStateType, currentRow?: U, validationResults?: validationError[]) => JSX.Element
	submitRow: APIWrapper<any, any, any>
	cardTitle?: string;
	columnsNonEditable?: K[];
	globalFilter?: FilterFunctionType;
	globalFilterValueControlled?: any;
	setRowData?: (rows: U[]) => void,
	hidableColumns?: boolean,
	hideAdd?: boolean,
	addRowText?: string
	validateSubmit?: (rowForEdit: StringifiedProps<U>, currentRow?: U) => validationError[],
	postSubmit?: (rowForEdit: U) => U,
	noCard?: boolean
	initialSortBy?: {id: keyof U, desc?: boolean}[]
	formatRowForDisplay?: (row: U) => {[key in keyof U]: any}
}) {

	const blankForm = {
		rowForEdit: stringifyAndMakeBlank(props.rowValidator),
		currentRow: {} as U
	}

	const [previousValues, setPreviousValues] = React.useState({} as PreviousValuesType);
	const [modalIsOpen, setModalIsOpen] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState([] as validationError[]);
	const [formData, setFormData] = React.useState(blankForm);
	var rowData = props.rows;
	var updateRowData = props.setRowData;
	if(!updateRowData){
		[rowData, updateRowData] = React.useState(props.rows);
	}
	const data = React.useMemo(() => {return rowData.map(r => ({
		...(props.formatRowForDisplay === undefined ? r : props.formatRowForDisplay(r)),
		edit: <a href="" onClick={e => {
			e.preventDefault();
			openForEdit(some(String(r[props.primaryKey])));
		}}><EditIcon color="#777" size="1.4em" /></a>,
	}))}, [rowData]);

	const report = <SimpleReport 
		keyField={props.primaryKey}
		data={data}
		columns={props.columns}
		sizePerPage={12}
		sizePerPageList={[12, 25, 50, 1000]}
		globalFilter={props.globalFilter}
		globalFilterValueControlled={props.globalFilterValueControlled}
		hidableColumns={props.hidableColumns}
		reportId={props.cardTitle.replace(" ", "")}
		initialSortBy={props.initialSortBy}
	/>;

	const openForEdit = (id: Option<string>) => {
		setModalIsOpen(true);
		setValidationErrors([]);
		if (id.isSome()) {
			const row = rowData.find(i => String(i[props.primaryKey]) == id.getOrElse(null))
			setFormData({
				rowForEdit: stringify(row),
				currentRow: row
			})
		} else {
			setFormData(blankForm)
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
			rowForEdit: {
				...formData.rowForEdit,
				[id]: valToSet
			}
		})
	}

	const updateStates = (id: string[], value: string[] | boolean[]) => {
		const newRowForEdit = Object.assign({}, formData.rowForEdit);
		id.forEach((a, i) => {
			(newRowForEdit as any)[a] = String(value[i]);
		});
		setFormData({...formData,rowForEdit: newRowForEdit});
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
		setTimeout(() => setFormData(blankForm), 100); // wait for the animation to hide the modal
	}

	function getOnlyNonEditableFields (currentRow: U){
		const onlyNonEditableRow: U = {} as U;
		if(props.columnsNonEditable === undefined){
			return onlyNonEditableRow;
		}
		props.columnsNonEditable.forEach((a) => {
			onlyNonEditableRow[a] = currentRow[a];
		})
		return onlyNonEditableRow;
	}

	const submit = () => {
		setValidationErrors([]);

		return new Promise((resolve, reject) => {
			// Let the event queue drain so the validation errors actually flicker off, before we push new ones
			setTimeout(() => {
				if (props.validateSubmit) {
					const errors = props.validateSubmit(formData.rowForEdit, formData.currentRow);
					if (errors.length > 0) {
						setValidationErrors(errors);
						resolve(null);
						return;
					}
				}

				// Turn empty strings to nulls, then turn strings back to numbers/booleans
				// HOWEVER, do not turn optional values back into options.  The validator is expecting the same shape as what would have come from the server,
				// ie either a value or null.
				const candidateForValidation = destringify(props.rowValidator, nullifyEmptyStrings(formData.rowForEdit), false, props.primaryKey);
				// On a create, ID will be null which is not ok per the validator.  Shove some crap in there to make it happy
				const pkValue = candidateForValidation[props.primaryKey] === null ? -1 : candidateForValidation[props.primaryKey];
				const validateResult = props.rowValidator.decode({
					...candidateForValidation,
					[props.primaryKey]: pkValue
				});
				const validationResults = validateResult.isLeft() ? validateResult.value.filter((a) => {return !props.columnsNonEditable.includes(a.context[1].key as K)}) : [];
				const isValid = validateResult.isRight() || validationResults.length == 0;
				const rowMatches: (r: U) => boolean = r => {
					const pk = r[props.primaryKey];
					if (pk["_tag"]) {
						return (pk as unknown as Option<any>).map(p => String(p)).getOrElse("") == formData.rowForEdit[props.primaryKey]
					} else {
						return String(pk) == formData.rowForEdit[props.primaryKey]
					}
				}
				if (isValid) {
					// Destringify again, this time turning optional values back into options. It's a bit pointless since
					// they will be stripped out again before sending to the server, but ApiWrapper expects actual option values
					// Besides, we need to give that value back to the table anyway.
					const toSend = destringify(props.rowValidator, nullifyEmptyStrings(formData.rowForEdit), true, props.primaryKey);
					var toSendEditable = toSend;
					if(props.columnsNonEditable !== undefined){
						toSendEditable = Object.assign({}, toSend);
						props.columnsNonEditable.forEach((a) => {
							const v = a as keyof typeof toSend;
							toSendEditable[v] = undefined;
						});
					}
					/*if(props.columnsRaw !== undefined){
						props.columnsRaw.forEach((a) => {
							const v = a as keyof typeof toSend;
							toSendEditable[v] = formData.currentRow[v];
						})
					}*/
					props.submitRow.sendJson(toSendEditable).then(ret => {
						console.log("doing it");
						console.log(ret);
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
								updateRowData(rowData.map(row => {
									if (rowMatches(row)) {
										if(props.columnsNonEditable !== undefined){
											return {...ret.success, ...getOnlyNonEditableFields(formData.currentRow)};
										}else{
											return toAdd;
										}
									} else {
										return row;
									}
								}))
							} else {
								// was a create.  Add the new row after injecting the PK from the server
								updateRowData(rowData.concat([{
									...toAdd,
									[props.primaryKey]: ret.success[props.primaryKey]
								}]))
							}
						} else {
							setValidationErrors([{key: undefined, display: ret.message}]);
						}
						resolve(null);
					})
				} else {
					setValidationErrors(validationResults.map((b) => ({key:(((b || {}).context || [])[1] || {}).key, display: b.message})).filter((b) => b != undefined));
					console.log(validateResult.swap().getOrElse(null));
				}
			}, 0);
		})
		
	}

	const toRender = <div>
		{report}
		{props.hideAdd !== true ? <Button className="mr-1 mb-1" outline onClick={() => openForEdit(none) }>{props.addRowText || "Add Row"}</Button> : <></>}
	</div>;

	return <React.Fragment>
		<Modal
			isOpen={modalIsOpen}
			toggle={closeModal}
			centered
		>
			<ModalHeader toggle={closeModal}>
				Add/Edit
			</ModalHeader>
			<ModalBody className="text-center m-3">
				<ErrorPopup errors={validationErrors.map((a) => (a["display"] || a))}/>
				<Form onSubmit={e => {
					e.preventDefault();
					submit();
				} }>
					{props.formComponents(formData.rowForEdit, updateStatesCombined ,formData.currentRow, validationErrors)}
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" outline onClick={closeModal}>
					Cancel
				</Button>{" "}
				<ButtonWrapper spinnerOnClick onClick={submit} >
					Save
				</ButtonWrapper>
			</ModalFooter>
		</Modal>
		{props.noCard ? toRender : <Card>
			<CardHeader>
				<CardTitle tag="h5" className="mb-0">{props.cardTitle ?? "Report Table"}</CardTitle>
			</CardHeader>
			<CardBody>
				{toRender}
			</CardBody>
		</Card>}
	</React.Fragment>;
}