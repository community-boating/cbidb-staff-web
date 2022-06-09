import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import * as t from "io-ts";
import { ErrorPopup } from 'components/ErrorPopup';

import { makePostJSON } from 'core/APIWrapperUtil';
import { ButtonWrapper } from 'components/ButtonWrapper';
import { ERROR_DELIMITER } from 'core/APIWrapper';
import { getSignoutsToday, putSignout, signoutsValidator, signoutValidator } from 'async/rest/signouts-tables';

const POLL_FREQ_SEC = 10

export type SignoutsTablesState = t.TypeOf<typeof signoutsValidator>;

export type SignoutTablesState = t.TypeOf<typeof signoutValidator>;

export type SubmitAction = () => Promise<Partial<SignoutTablesState>>

export const SignoutsTablesPage = (props: {
	dockReportInitState: SignoutsTablesState
}) => {
	const [dockReportState, setDockReportState] = React.useState(props.dockReportInitState);

	const defaultSubmitAction: SubmitAction = () => Promise.resolve(null);

	const [modalContent, setModalContent] = React.useState(null as JSX.Element);
	const [modalWidth, setModalWidth] = React.useState(1200)
	const [submitAction, setSubmitAction] = React.useState(() => defaultSubmitAction);
	const [modalErrors, setModalErrors] = React.useState(null as string[])
	const [refreshTimeout, setRefreshTimeout] = React.useState(null as NodeJS.Timeout)

	function updateStateForever() {
		return getSignoutsToday.send(null).then(res => {
			if (res.type == "Success") {
				setDockReportState(res.success)
			}
			setRefreshTimeout(setTimeout(updateStateForever, 1000*POLL_FREQ_SEC))
		})
	}

	// clear errors whenever the modal is updated
	React.useEffect(() => {
		setModalErrors(null)
	}, [modalContent])

	// if the edit modal is closed, refresh every 10 sec. On opening the modal, clear the next refresh timeout
	React.useEffect(() => {
		if (modalContent == null) {
			updateStateForever()
		} else {
			refreshTimeout && clearTimeout(refreshTimeout);
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

	/*const incidentsCard = <DockReportTextBox
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
	/>*/


	return <>
		<Modal
			isOpen={modalContent != null}
			// toggle={() => setModalContent(null)}
			style={{maxWidth: `${modalWidth}px`}}
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
				<ButtonWrapper spinnerOnClick color="secondary" onClick={() => {
					setModalErrors(null)
					return submitAction().then(additionalState => {
						const newState = {
							...signoutValidator, ...{
                                //TODO index
								...additionalState[0],
							}
						}
						return putSignout.send(makePostJSON(newState))
					}).then(res => {
						if (res.type == "Failure") {
							return Promise.reject(res.message)
						} else {
							//setDockReportState(res.success)
							setModalContent(null)
							return Promise.resolve();
						}
					}).catch(err => {
						setModalErrors(String(err).split(ERROR_DELIMITER))
					});
				}}>
					Save Changes
				</ButtonWrapper>
			</ModalFooter>
		</Modal>
	</>
}