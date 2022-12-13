import optionify from 'util/optionify';
import { Option } from 'fp-ts/lib/Option';
import * as React from 'react';
import { Edit } from 'react-feather';
import { DockReportState, SubmitAction } from '.';
import { Card } from 'components/dockhouse/Card';
import EditCard from './EditCard';

export default function DockReportTextBox(props: {
	message: Option<string>,
	title: string,
	statekey: keyof DockReportState,
	openModal: (content: React.ReactNode) => void,
	setSubmitAction: (submit: SubmitAction) => void
}) {
	return (<EditCard title={props.title} openModal={props.openModal} editModal={<EditDockReportTextBox message={props.message.getOrElse("")} title={props.title} setSubmitAction={props.setSubmitAction} statekey={props.statekey} />}>
		<textarea className="bg-gray-100 w-full" rows={7} value={props.message.getOrElse("")} readOnly />
	</EditCard>);
}

const EditDockReportTextBox = (props: {
	message: string,
	title: string,
	statekey: keyof DockReportState,
	setSubmitAction: (submit: SubmitAction) => void
}) => {
	const [message, setMessage] = React.useState(props.message);

	React.useEffect(() => {
		props.setSubmitAction(() => Promise.resolve({ [props.statekey]: optionify(message) }));
	}, [message]);

	return <div className="form-group row">
		<textarea cols={116} rows={10} value={message} onChange={e => setMessage(e.target.value)}/>
	</div>
}
