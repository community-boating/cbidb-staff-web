import * as React from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import Classes from './Classes';
import {DateHeader} from './DateHeader';
import HullCounts from './HullCounts';
import {Dockmasters, Staff} from './FullStaff';
import UapAppointments from './UapAppointments';
import WeatherTable from './WeatherTable';
import { ErrorPopup } from '@components/ErrorPopup';

const incidents = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"

const incidentsCard = <Card>
	<CardHeader><CardTitle><h4>Incidents/Notes</h4></CardTitle></CardHeader>
	<CardBody>{incidents}</CardBody>
</Card>

const announcementsCard = <Card>
	<CardHeader><CardTitle><h4>Announcements</h4></CardTitle></CardHeader>
	<CardBody>{incidents}</CardBody>
</Card>

const semiPermanentRestrictionsCard = <Card>
	<CardHeader><CardTitle><h4>Semi-Permanent Restrictions</h4></CardTitle></CardHeader>
	<CardBody>{incidents}</CardBody>
</Card>

export type DockReportState = {
	sunset: string
}

export type SubmitAction = () => Promise<Partial<DockReportState>>

export const DockReportPage = (props: {
	date: string
}) => {
	const [dockReportState, setDockReportState] = React.useState({
		sunset: null
	} as DockReportState);

	const defaultSubmitAction: SubmitAction = () => Promise.resolve(null);

	const [modalContent, setModalContent] = React.useState(null as JSX.Element);
	const [submitAction, setSubmitAction] = React.useState(() => defaultSubmitAction);
	const [modalError, setModalError] = React.useState(null as string)

	const errorPopup = (
		modalError
		? <ErrorPopup errors={[modalError]}/>
		: null
	);

	return <>
		<Modal
			isOpen={modalContent != null}
			// toggle={() => setModalContent(null)}
		>
			<ModalHeader toggle={() => setModalContent(null)}>
				Edit Dock Report
			</ModalHeader>
			<ModalBody className="m-3">
				{errorPopup}
				{modalContent}
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" outline onClick={() => setModalContent(null)}>
					Cancel
				</Button>
				{" "}
				<Button color="secondary" onClick={() => {
					// setModalError(null)
					return submitAction().then(
						newState => {
							setDockReportState({... dockReportState, ...newState })
							setModalContent(null)
						},
						err => setModalError(err)
					);
				}}>
					Save Changes
				</Button>
			</ModalFooter>
		</Modal>
		<Row>
			<Col md="3">
				<DateHeader
					date={props.date}
					sunset={dockReportState.sunset}
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
				/>
				<Dockmasters 
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
				/>
			</Col>
			<Col md="4">
				<Classes />
			</Col>
			<Col md="5">
				<WeatherTable />
			</Col>
		</Row>
		<Row>
			<Col md="4">
				{incidentsCard}
			</Col>
			<Col md="4">
				{announcementsCard}
			</Col>
			<Col md="4">
				{semiPermanentRestrictionsCard}
			</Col>
		</Row>
		<Row>
			<Col md="3">
				<Staff 
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
				/>
			</Col>
			<Col md="4">
				<UapAppointments />
			</Col>
			<Col md="3">
				<HullCounts />
			</Col>
		</Row>
	</>
}