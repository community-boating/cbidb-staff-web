import * as React from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import * as t from "io-ts";
import Classes from './Classes';
import {DateHeader} from './DateHeader';
import HullCounts, { HullType } from './HullCounts';
import {DockmastersReport, StaffReport} from './FullStaff';
import UapAppointments from './UapAppointments';
import WeatherTable from './WeatherTable';
import { ErrorPopup } from '@components/ErrorPopup';
import DockReportTextBox from './DockReportTextBox';
import { Option } from 'fp-ts/lib/Option';
import * as moment from 'moment'
import { dockReportValidator, putDockReport } from '@async/rest/dock-report';
import { makePostJSON } from '@core/APIWrapperUtil';
import { DATE_FORMAT_LOCAL_DATE, DATE_FORMAT_LOCAL_DATETIME } from '@util/dateUtil';

export type Staff = {
	name: string,
	in: string,
	out: string
}

export type DockReportState = t.TypeOf<typeof dockReportValidator>;

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
	const [dockReportState, setDockReportState] = React.useState(props.dockReportInitState);

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
		message={dockReportState.INCIDENTS_NOTES}
		title="Incidents/Notes"
		statekey='INCIDENTS_NOTES'
	/>

	const announcementsCard = <DockReportTextBox
		openModal={(content: JSX.Element) => {setModalContent(content)}}
		setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
		message={dockReportState.ANNOUNCEMENTS}
		title="Announcements"
		statekey='ANNOUNCEMENTS'
	/>

	const semiPermanentRestrictionsCard = <DockReportTextBox
		openModal={(content: JSX.Element) => {setModalContent(content)}}
		setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
		message={dockReportState.SEMI_PERMANENT_RESTRICTIONS}
		title="Semi-Permanent Restrictions"
		statekey='SEMI_PERMANENT_RESTRICTIONS'
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
					return submitAction().then(additionalState => {
						const newState = {
							...dockReportState, ...additionalState
						}
						return putDockReport.send(makePostJSON(newState)).then(() => newState)
					}).then(
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
					date={moment(dockReportState.REPORT_DATE, DATE_FORMAT_LOCAL_DATE)}
					sunset={dockReportState.SUNSET_DATETIME.map(t => moment(t, DATE_FORMAT_LOCAL_DATETIME))}
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
				/>
				<DockmastersReport
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					staff={[]}
				/>
			</Col>
			<Col md="4">
				<Classes
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					classes={[]}
				/>
			</Col>
			<Col md="5">
				<WeatherTable
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					weatherRecords={[]}
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
					staff={[]}
				/>
			</Col>
			<Col md="4">
				<UapAppointments
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					appts={[]}
				/>
			</Col>
			<Col md="3">
				<HullCounts 
					openModal={(content: JSX.Element) => {setModalContent(content)}}
					setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					counts={[]}
				/>
			</Col>
		</Row>
	</>
}