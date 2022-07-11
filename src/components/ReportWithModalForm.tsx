import * as React from "react";
import * as t from 'io-ts';
import { Card, CardHeader, CardTitle, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form } from 'reactstrap';
import {
	Edit as EditIcon,
} from 'react-feather'
import { SimpleReport, SimpleReportColumn } from "core/SimpleReport";
import { ErrorPopup } from "components/ErrorPopup";
import { none, Option, some } from "fp-ts/lib/Option";
import { makePostJSON } from "core/APIWrapperUtil";
import APIWrapper from "core/APIWrapper";
import { ButtonWrapper } from "./ButtonWrapper";
import { destringify, DisplayableProps, nullifyEmptyStrings, StringifiedProps, stringify, stringifyAndMakeBlank } from "util/StringifyObjectProps";
import { left } from "fp-ts/lib/Either";
import { Editable } from "util/EditableType";
import { option } from "fp-ts";
import { ReactNode } from "react";
import { Row } from "react-table";

export type validationError = {
	key: string,
	display: string
}

export default function ReportWithModalForm<K extends keyof U, T extends t.TypeC<any>, U extends object = t.TypeOf<T>>(props: {
	rowValidator: T
	rows: U[],
	formatRowForDisplay: (row: U) => DisplayableProps<U>,
	primaryKey: string & keyof U,
	columns: SimpleReportColumn[],
	formComponents: (rowForEdit: StringifiedProps<U>, updateState: (id: string, value: string | boolean) => void, currentRow?: U, validationResults?: validationError[], updateCurrentRow?: (row: U) => void) => JSX.Element
	submitRow: APIWrapper<any, any, any>
	cardTitle?: string;
	columnsNonEditable?: K[];
	//columnsRaw?: K[];
	globalFilter?: (rows: Row<any>[], columnIds: string[], filterValue: any) => Row<any>[];
	globalFilterValueControlled?: any;
	setRowData?: (rows: U[]) => void,
	hidableColumns?: boolean,
	hideAdd?: boolean,
	//makeExtraModal?: (rowData: U[]) => ReactNode
}) {

	const blankForm = {
		rowForEdit: stringifyAndMakeBlank(props.rowValidator),
		currentRow: {} as U
	}

	const [modalIsOpen, setModalIsOpen] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState([] as validationError[]);
	const [formData, setFormData] = React.useState(blankForm);
	var rowData = props.rows;
	var updateRowData = props.setRowData;
	if(!updateRowData){
		[rowData, updateRowData] = React.useState(props.rows);
	}
	const updateCurrentRow = (row: U) => setFormData({...formData, currentRow:row});

	const data = React.useMemo(() => {return rowData.map(r => ({
		...r,
		edit: <a href="" onClick={e => {
			e.preventDefault();
			openForEdit(some(String(r[props.primaryKey])));
		}}><EditIcon color="#777" size="1.4em" /></a>,
	}))}, [rowData]);
	const report = React.useMemo(() => <SimpleReport 
		keyField={props.primaryKey}
		data={data.map(props.formatRowForDisplay)}
		columns={props.columns}
		sizePerPage={12}
		sizePerPageList={[12, 25, 50, 1000]}
		globalFilter={props.globalFilter}
		globalFilterValueControlled={props.globalFilterValueControlled}
		hidableColumns={props.hidableColumns}
		reportId={props.cardTitle.replace(" ", "")}
	/>, [rowData, props.formatRowForDisplay]);

	//Added dependency on formatRowForDisplay to allow changes to the converter function to propagate down
	//This is needed for the async polling of semi static variables like boatTypes

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

	function closeModal() {
		setModalIsOpen(false);
		setFormData(blankForm);
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
			window.setTimeout(() => {
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
					props.submitRow.send(makePostJSON(toSendEditable)).then(ret => {
						console.log("doing it");
						console.log(ret);
						if (ret.type == "Success") {
							closeModal();
							if (rowData.find(r => String(r[props.primaryKey]) == formData.rowForEdit[props.primaryKey])) {
								// was an update.  Find the row and update it
								updateRowData(rowData.map(row => {
									if (formData.rowForEdit[props.primaryKey] == String(row[props.primaryKey])) {
										console.log(ret.success);
										return {...ret.success, ...getOnlyNonEditableFields(formData.currentRow)};
									} else {
										return row;
									}
								}))
							} else {
								// was a create.  Add the new row after injecting the PK from the server
								updateRowData(rowData.concat([{
									...toSend,
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
					resolve(null);
					//TODO: I'm sure we can do better than this
				}
			}, 0);
		})
		
	}
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
				<ErrorPopup errors={validationErrors.map((a) => a.display)}/>
				<Form onSubmit={e => {
					e.preventDefault();
					submit();
				} }>
					{props.formComponents(formData.rowForEdit, updateState, formData.currentRow, validationErrors, updateCurrentRow)}
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
		<Card>
			<CardHeader>
				<CardTitle tag="h5" className="mb-0">{props.cardTitle ?? "Report Table"}</CardTitle>
			</CardHeader>
			<CardBody>
				<div>
					{report}
					{props.hideAdd === true ? <></> : <Button className="mr-1 mb-1" outline onClick={() => openForEdit(none) }>Add Row</Button>}
				</div>
			</CardBody>
		</Card>
	</React.Fragment>;
}