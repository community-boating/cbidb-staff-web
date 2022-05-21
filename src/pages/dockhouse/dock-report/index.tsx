import * as React from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import Classes from './Classes';
import {DateHeader} from './DateHeader';
import HullCounts, { HullType } from './HullCounts';
import {DockmastersReport, StaffReport} from './FullStaff';
import UapAppointments from './UapAppointments';
import WeatherTable from './WeatherTable';
import { ErrorPopup } from '@components/ErrorPopup';
import { classes, dockmasters, dockstaff, uapAppts } from './tempData';

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

export type Staff = {
	name: string,
	in: string,
	out: string
}

export type DockReportState = {
	sunset: string,
	dockstaff: Staff[],
	dockmasters: Staff[],
	classes: Class[],
	uapAppts: UapAppointment[],
	hullCounts: HullCount[],
}

export type Class = {
	time: string,
	className: string,
	location: string,
	attend: string,
	instructor: string
}

export type UapAppointment = {
	time: string,
	apptType: string,
	person: string,
	boat: string,
	instructor: string,
};

export type HullCount = {
	hullType: HullType,
	inService: string
	nightlyCount: string
}

export type SubmitAction = () => Promise<Partial<DockReportState>>

export const DockReportPage = (props: {
	date: string
}) => {
	const [dockReportState, setDockReportState] = React.useState({
		sunset: null,
		dockstaff,
		dockmasters,
		classes,
		uapAppts,
		hullCounts: []
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
			style={{maxWidth: "900px"}}
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
							// console.log("new state from edit modal: ", newState)
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
				<DockmastersReport
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					staff={dockReportState.dockmasters}
				/>
			</Col>
			<Col md="4">
				<Classes
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					classes={dockReportState.classes}
				/>
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
				<StaffReport
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					staff={dockReportState.dockstaff}
				/>
			</Col>
			<Col md="4">
				<UapAppointments
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					appts={dockReportState.uapAppts}
				/>
			</Col>
			<Col md="3">
				<HullCounts 
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					counts={dockReportState.hullCounts}
				/>
			</Col>
		</Row>
	</>
}