import optionify from '@util/optionify';
import { Option } from 'fp-ts/lib/Option';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap';
import { DockReportState, SubmitAction } from '.';

export default function DockReportTextBox(props: {
	message: Option<string>,
	title: string,
	statekey: keyof DockReportState,
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}) {
	return <Card>
		<CardHeader style={{ paddingBottom: 0 }}>
			<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
				<EditDockReportTextBox message={props.message.getOrElse("")} title={props.title} setSubmitAction={props.setSubmitAction} statekey={props.statekey} />
			)} />
			<CardTitle><h4>{props.title}</h4></CardTitle>
		</CardHeader>
		<CardBody>
			<textarea style={{border: "none", width: "100%"}} rows={7} value={props.message.getOrElse("")} readOnly />
		</CardBody>
	</Card>
}

const EditDockReportTextBox = (props: {
	message: string,
	title: string,
	statekey: keyof DockReportState,
	setSubmitAction: (submit: SubmitAction) => void
}) => {
	const [message, setMessage] = React.useState(props.message);

	React.useEffect(() => {
		// console.log("setting submit action ", staff)
		props.setSubmitAction(() => Promise.resolve({ [props.statekey]: optionify(message) }));
	}, [message]);

	return <div className="form-group row">
		<textarea cols={116} rows={10} value={message} onChange={e => setMessage(e.target.value)}/>
	</div>
}
