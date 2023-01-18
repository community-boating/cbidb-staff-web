import * as React from 'react';
import * as t from "io-ts";
import Classes from './Classes';
import {DateHeader} from './DateHeader';
import HullCounts, { HullType } from './HullCounts';
import {DockmastersReport, StaffReport} from './FullStaff';
import UapAppointments from './UapAppointments';
import WeatherTable from './WeatherTable';
import { ErrorPopup } from 'components/ErrorPopup';
import DockReportTextBox from './DockReportTextBox';
import * as moment from 'moment'
import { dockReportValidator, dockReportWeatherValidator, getDockReport, putDockReport } from 'async/rest/dock-report';
import { DATE_FORMAT_LOCAL_DATE, DATE_FORMAT_LOCAL_DATETIME } from 'util/dateUtil';
import { ERROR_DELIMITER } from 'core/APIWrapper';
import Modal, { ModalHeader } from 'components/wrapped/Modal';
import Button from 'components/wrapped/Button';
import { AppStateCombined } from 'app/state/AppState';
import { AppStateContext } from 'app/state/AppStateContext';
import AsyncStateProvider from 'core/AsyncStateProvider';

const POLL_FREQ_SEC = 10

function Col(props: {md: string, children?: React.ReactNode}){
	return <div className="flex flex-col gap-primary" style={{flexBasis: props.md, flexGrow: props.md}}>{props.children}</div>
}

function Row(props: {children?: React.ReactNode}){
	return <div className="grow-[1] flex flex-row gap-primary">{props.children}</div>
}

export type DockReportState = t.TypeOf<typeof dockReportValidator>;

export type WeatherRecord = t.TypeOf<typeof dockReportWeatherValidator>;

export type SubmitAction = () => Promise<Partial<DockReportState>>

export const DockReportPage = (props: {
	dockReportInitState: DockReportState
}) => {
	const [dockReportState, setDockReportState] = React.useState(props.dockReportInitState);

	const defaultSubmitAction: SubmitAction = () => Promise.resolve(null);

	const [modalContent, setModalContent] = React.useState(null as JSX.Element);
	const [modalWidth, setModalWidth] = React.useState(1200)
	const [submitAction, setSubmitAction] = React.useState(() => defaultSubmitAction);
	const [modalErrors, setModalErrors] = React.useState(null as string[])
	const [refreshCleanup, setRefreshCleanup] = React.useState<() => void>(undefined)

	function updateStateForever(asc: AppStateCombined) {
		const update = () => {
			getDockReport.send(asc).then(res => {
				if (res.type == "Success") {
					setDockReportState(res.success)
				}
			})
		}
		const timerID = setInterval(update, 1000*POLL_FREQ_SEC);
		setRefreshCleanup(() => {clearInterval(timerID);setRefreshCleanup(undefined)});
	}

	const asc = React.useContext(AppStateContext);

	// clear errors whenever the modal is updated
	React.useEffect(() => {
		setModalErrors(null)
	}, [modalContent])

	// if the edit modal is closed, refresh every 10 sec. On opening the modal, clear the next refresh timeout
	React.useEffect(() => {
		if (modalContent == null) {
			updateStateForever(asc)
		} else {
			refreshCleanup && refreshCleanup();
		}
	}, [modalContent])

	const errorPopup = (
		modalErrors
		? <ErrorPopup errors={modalErrors}/>
		: null
	);

	const setModalContentAndWidth = (content: JSX.Element, width: number) => {
		setModalContent(content)
		setModalWidth(width)
	}

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
			open={(modalContent != null)}
			setOpen={() => setModalContent(null)}
			// toggle={() => setModalContent(null)}
			className="bg-gray-100"
		>
			<ModalHeader><h1>Edit Dock Report</h1></ModalHeader>
			<div className="flex flex-col min-h-[50vh] min-w-[50vw]">
				{errorPopup}
				{modalContent}
				<div className="flex flex-row mt-auto mb-0">
					<Button onClick={() => setModalContent(null)}>
						Cancel
					</Button>
					{" "}
					<Button className="ml-auto mr-0" spinnerOnClick submit={() => {
						setModalErrors(null)
						console.log(submitAction);
						return submitAction().then(additionalState => {
							const newState = {
								...dockReportState, ...{
									...additionalState,
								}
							}
							return putDockReport.sendJson(asc, newState)
						}).then(res => {
							if (res.type == "Failure") {
								return Promise.reject(res.message)
							} else {
								setDockReportState(res.success)
								setModalContent(null)
								return Promise.resolve();
							}
						}).catch(err => {
							setModalErrors(String(err).split(ERROR_DELIMITER))
						});
					}}>
						Save Changes
					</Button>
					</div>
				</div>
		</Modal>
		<div className="flex flex-col h-full gap-primary">
			<Row>
				<Col md="3">
					<DateHeader
						date={moment(dockReportState.REPORT_DATE, DATE_FORMAT_LOCAL_DATE)}
						sunset={dockReportState.SUNSET_DATETIME.map(t => moment(t, DATE_FORMAT_LOCAL_DATETIME))}
						openModal={(content: JSX.Element) => {setModalContentAndWidth(content, 600)}}
						setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
					/>
					<DockmastersReport
						openModal={(content: JSX.Element) => {setModalContentAndWidth(content, 600)}}
						setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
						staff={dockReportState.dockmasters}
						reportDate={dockReportState.REPORT_DATE}
					/>
				</Col>
				<Col md="4">
					<Classes
						openModal={(content: JSX.Element) => {setModalContentAndWidth(content, 900)}}
						setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
						classes={dockReportState.apClasses}
						reportDate={dockReportState.REPORT_DATE}
					/>
				</Col>
				<Col md="5">
					<WeatherTable
						openModal={(content: JSX.Element) => {setModalContentAndWidth(content, 1200)}}
						setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
						weatherRecords={dockReportState.weather}
						reportDate={dockReportState.REPORT_DATE}
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
						openModal={(content: JSX.Element) => {setModalContentAndWidth(content, 600)}}
						setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
						staff={dockReportState.dockstaff}
						reportDate={dockReportState.REPORT_DATE}
					/>
				</Col>
				<Col md="6">
					<UapAppointments
						openModal={(content: JSX.Element) => {setModalContentAndWidth(content, 1200)}}
						setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
						appts={dockReportState.uapAppts}
						reportDate={dockReportState.REPORT_DATE}
					/>
				</Col>
				<Col md="3">
					<HullCounts 
						openModal={(content: JSX.Element) => {setModalContentAndWidth(content, 600)}}
						setSubmitAction={(submitAction: SubmitAction) => setSubmitAction(() => submitAction)}
						counts={dockReportState.hullCounts}
					/>
				</Col>
			</Row>
		</div>
	</>
}
