import * as React from "react";
import * as t from 'io-ts';
import { Card, CardHeader, CardTitle, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form } from 'reactstrap';
import { ColumnDescription } from "react-bootstrap-table-next";
import {
	Edit as EditIcon,
} from 'react-feather'
import { SimpleReport } from "@core/SimpleReport";
import { ErrorPopup } from "@components/ErrorPopup";
import { none, Option, some } from "fp-ts/lib/Option";
import { makePostJSON } from "@core/APIWrapperUtil";
import APIWrapper from "@core/APIWrapper";
import { deoptionifyProps, OptionifiedProps, optionifyAndMakeDefault, optionifyProps } from "@util/OptionifyObjectProps";
import { ButtonWrapper } from "./ButtonWrapper";

export default function ReportWithModalForm<T extends t.TypeC<any>, U extends object = t.TypeOf<T>>(props: {
	rowValidator: T
	rows: U[],
	primaryKey: string & keyof U,
	columns: ColumnDescription[],
	formComponents: (rowForEdit: OptionifiedProps<U>, updateState: (id: string, value: string) => void) => JSX.Element
	submitRow: APIWrapper<any, U, any>
	cardTitle?: string;
}) {
	const blankForm = {
		rowForEdit: optionifyAndMakeDefault(props.rowValidator),
	}

	const [modalIsOpen, setModalIsOpen] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState([] as string[]);
	const [formData, setFormData] = React.useState(blankForm);
	const [rowData, updateRowData] = React.useState(props.rows);

	const openForEdit = (id: Option<string>) => {
		setModalIsOpen(true);
		setValidationErrors([]);
		if (id.isSome()) {
			const row = rowData.find(i => String(i[props.primaryKey]) == id.getOrElse(null))
			setFormData({
				rowForEdit: optionifyProps(row),
			})
		} else {
			setFormData(blankForm)
		}
	}

	const updateState = (id: string, value: string) => {
		setFormData({
			...formData,
			rowForEdit: {
				...formData.rowForEdit,
				[id]: some(value)
			}
		})
	}

	function closeModal() {
		setModalIsOpen(false);
		setFormData(blankForm);
	}

	const submit = () => {
		return props.submitRow.send(makePostJSON(deoptionifyProps(formData.rowForEdit))).then(ret => {
			if (ret.type == "Success") {
				closeModal();
				if (rowData.find(r => r[props.primaryKey] == formData.rowForEdit[props.primaryKey].getOrElse(null))) {
					// was an update
					updateRowData(rowData.map(row => {
						if (formData.rowForEdit[props.primaryKey].getOrElse(null) == row[props.primaryKey]) {
							return deoptionifyProps(formData.rowForEdit);
						} else return row;
					}))
				} else {
					// was a create
					updateRowData(rowData.concat([{
						...deoptionifyProps(formData.rowForEdit),
						[props.primaryKey]: ret.success[props.primaryKey]
					}]))
				}
			} else {
				setValidationErrors([ret.message])
			}
		})
	}

	const data = rowData.map(r => ({
		...r,
		edit: <a href="" onClick={e => {
			e.preventDefault();
			openForEdit(some(String(r[props.primaryKey])));
		}}><EditIcon color="#777" size="1.4em" /></a>,
	}));

	console.log(formData)

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
					<SimpleReport 
						keyField={props.primaryKey}
						data={data}
						columns={props.columns}
						bootstrap4
						bordered={false}
						sizePerPage={12}
						sizePerPageList={[12, 25, 50, 1000]}
					/>
					<Button className="mr-1 mb-1" outline onClick={() => openForEdit(none) }>Add Row</Button>
				</div>
			</CardBody>
		</Card>
	</React.Fragment>;
}
