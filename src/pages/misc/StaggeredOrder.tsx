import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';
import { Card, CardHeader, CardTitle, CardBody, Button, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BootstrapTable from "react-bootstrap-table-next";
import { validator} from "@async/staff/open-order-details"
import Currency from '@util/Currency';
import {toMomentFromLocalDate} from '@util/dateUtil'
import { ButtonWrapper } from '@components/ButtonWrapper';
import {postWrapper as finishOrder} from "@async/staff/finish-open-order"
import { makePostJSON } from '@core/APIWrapperUtil';
import { ErrorPopup } from '@components/ErrorPopup';

type PaymentList = t.TypeOf<typeof validator>

const paid = <span style={{color:"#22772d"}}>Paid</span>
const failed = <span style={{color:"#ff0000"}}>Failed</span>

export default function StaggeredOrder(props: { history: History<any>, personId: number, payments: PaymentList }) {
	const [isOpen, doOpen] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState([] as string[]);

	const abort = () => doOpen(false);

	const columns = [{
		dataField: "expectedDateToShow",
		text: "Date"
	}, {
		dataField: "amount",
		text: "Amount"
	}, {
		dataField: "status",
		text: "Status"
	}];

	const data = props.payments.map(p => ({
		...p,
		amount: Currency.cents(p.amountCents).format(),
		expectedDateToShow: toMomentFromLocalDate(p.expectedDate).format("MM/DD/YYYY"),
		status: p.paid ? paid : (p.failedCron ? failed : "Unpaid")
	}));

	const confirmModal = <Modal
		isOpen={isOpen}
		toggle={abort}
		centered
	>
		<ModalHeader toggle={abort}>
			Finish order
		</ModalHeader>
		<ModalBody className="text-center m-3">
			<ErrorPopup errors={validationErrors} />
			<p className="mb-0">
				This will immediately charge the member's card for the remaining payments on this order, and if successful, activate their membership.
				Do you want to continue?
			</p>
		</ModalBody>
		<ModalFooter>
			<Button color="secondary" outline onClick={abort}>
				Cancel
			</Button>{" "}
			<ButtonWrapper spinnerOnClick onClick={() => {
				return finishOrder(props.personId).send(makePostJSON({})).then(ret => {
					if (ret.type == "Success") {
						props.history.push("/redirect" + window.location.pathname)
					} else {
						setValidationErrors([ret.message])
					}
				})
			}} >
				Finish Order
			</ButtonWrapper>
		</ModalFooter>
	</Modal>;
	return <Row>
		{confirmModal}
		<Col className="col-lg-6"><Card>
			<CardHeader>
				<CardTitle tag="h5" className="mb-0">Staggered Order</CardTitle>
			</CardHeader>
			<CardBody>
				<BootstrapTable
					keyField="staggerId"
					data={data}
					columns={columns}
					bootstrap4
					bordered={false}
				/>
			</CardBody>
		</Card></Col>
		<Col className="col-lg-6"><Card>
			<CardHeader>
				<CardTitle tag="h5" className="mb-0">Finish Order</CardTitle>
			</CardHeader>
			<CardBody>
			<Button color="primary" className="mr-1 mb-1" onClick={() => doOpen(true)}>
				Finish Order Immediately
			</Button>
			</CardBody>
		</Card></Col>
	</Row>;
}
