import * as React from "react";
import * as t from 'io-ts';
import { Card, CardHeader, CardTitle, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form } from 'reactstrap';
import {
	Edit as EditIcon,
} from 'react-feather'
import { SimpleReport, SimpleReportColumn } from "core/SimpleReport";
import { ErrorPopup } from "components/ErrorPopup";
import { none, Option, some } from "fp-ts/lib/Option";
import APIWrapper from "core/APIWrapper";
import { ButtonWrapper } from "./ButtonWrapper";
import { destringify, DisplayableProps, nullifyEmptyStrings, StringifiedProps, stringify, stringifyAndMakeBlank } from "util/StringifyObjectProps";

export default function ReportWithModalForm<T extends t.TypeC<any>, U extends object = t.TypeOf<T>>(props: {
	rowValidator: T
	rows: U[],
	formatRowForDisplay: (row: U) => DisplayableProps<U>,
	primaryKey: string & keyof U,
	columns: SimpleReportColumn[],
	formComponents: (rowForEdit: StringifiedProps<U>, updateState: (id: string, value: string | boolean) => void) => JSX.Element
	submitRow: APIWrapper<any, T, any>
	cardTitle?: string;
}) {
	const blankForm = {
		rowForEdit: stringifyAndMakeBlank(props.rowValidator),
	}

	const [modalIsOpen, setModalIsOpen] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState([] as string[]);
	const [formData, setFormData] = React.useState(blankForm);
	const [rowData, updateRowData] = React.useState(props.rows);

	const data = React.useMemo(() => rowData.map(r => ({
		...r,
		edit: <a href="" onClick={e => {
			e.preventDefault();
			openForEdit(some(String(r[props.primaryKey])));
		}}><EditIcon color="#777" size="1.4em" /></a>,
	})), [rowData]);

	const report = React.useMemo(() => <SimpleReport 
		keyField={props.primaryKey}
		data={data.map(props.formatRowForDisplay)}
		columns={props.columns}
		sizePerPage={12}
		sizePerPageList={[12, 25, 50, 1000]}
	/>, [rowData])

	const openForEdit = (id: Option<string>) => {
		setModalIsOpen(true);
		setValidationErrors([]);
		if (id.isSome()) {
			const row = rowData.find(i => String(i[props.primaryKey]) == id.getOrElse(null))
			setFormData({
				rowForEdit: stringify(row),
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
				
				if (validateResult.isRight()) {
					// Destringify again, this time turning optional values back into options. It's a bit pointless since
					// they will be stripped out again before sending to the server, but ApiWrapper expects actual option values
					// Besides, we need to give that value back to the table anyway.
					const toSend = destringify(props.rowValidator, nullifyEmptyStrings(formData.rowForEdit), true, props.primaryKey);
					props.submitRow.sendJson(toSend).then(ret => {
						if (ret.type == "Success") {
							closeModal();
							if (rowData.find(r => String(r[props.primaryKey]) == formData.rowForEdit[props.primaryKey])) {
								// was an update.  Find the row and update it
								updateRowData(rowData.map(row => {
									if (formData.rowForEdit[props.primaryKey] == String(row[props.primaryKey])) {
										return toSend;
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
							setValidationErrors([ret.message])
						}
						resolve(null);
					})
				} else {
					//TODO: I'm sure we can do better than this
					setValidationErrors(["At least one field is not valid."]);
					resolve(null);
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
				<ErrorPopup errors={validationErrors}/>
				<Form onSubmit={e => {
					e.preventDefault();
					submit();
				} }>
					{props.formComponents(formData.rowForEdit, updateState)}
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
					<Button className="mr-1 mb-1" outline onClick={() => openForEdit(none) }>Add Row</Button>
				</div>
			</CardBody>
		</Card>
	</React.Fragment>;
}
