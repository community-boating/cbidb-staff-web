import * as React from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import Classes from './Classes';
import {DateHeader} from './DateHeader';
import HullCounts, { HullType } from './HullCounts';
import {DockmastersReport, StaffReport} from './FullStaff';
import UapAppointments from './UapAppointments';
import WeatherTable from './WeatherTable';
import { ErrorPopup } from '@components/ErrorPopup';
import { classes, dockmasters, dockstaff, loremIpsum, uapAppts, weatherRecords } from './tempData';
import DockReportTextBox from './DockReportTextBox';

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
	weatherRecords: WeatherRecord[],
	incidentsNotes: string
	announcements: string,
	semiPermanentRestrictions: string,
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

export type WeatherRecord = {
	time: string,
	temp: string,
	weather: string,
	windDir: string,
	windSpeedKts: string,
	restrictions: string,
}

export type SubmitAction = () => Promise<Partial<DockReportState>>

export const DockReportPage = (props: {
	dockReportInitState: DockReportState
}) => {
	const [dockReportState, setDockReportState] = React.useState({
		sunset: null,
		dockstaff,
		dockmasters,
		classes,
		uapAppts,
		hullCounts: [],
		weatherRecords,
		incidentsNotes: loremIpsum,
		announcements: loremIpsum,
		semiPermanentRestrictions: loremIpsum,
		...props.dockReportInitState
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

	const incidentsCard = <DockReportTextBox
		openModal={(content: JSX.Element) => {setModalContent(content)}}
		setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
		message={dockReportState.incidentsNotes}
		title="Incidents/Notes"
		statekey='incidentsNotes'
	/>

	const announcementsCard = <DockReportTextBox
		openModal={(content: JSX.Element) => {setModalContent(content)}}
		setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
		message={dockReportState.announcements}
		title="Announcements"
		statekey='announcements'
	/>

	const semiPermanentRestrictionsCard = <DockReportTextBox
		openModal={(content: JSX.Element) => {setModalContent(content)}}
		setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
		message={dockReportState.semiPermanentRestrictions}
		title="Semi-Permanent Restrictions"
		statekey='semiPermanentRestrictions'
	/>

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
					date={null}
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
				<WeatherTable
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					weatherRecords={dockReportState.weatherRecords}
				/>
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