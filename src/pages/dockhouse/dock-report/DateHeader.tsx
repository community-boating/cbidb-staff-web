import detectEnter from '@util/detectEnterPress';
import optionify from '@util/optionify';
import { reject } from 'lodash';
import * as moment from 'moment'
import * as React from 'react';
import { Edit } from 'react-feather';
import { Badge, Card, CardBody, CardHeader, CardTitle, Input, Table } from 'reactstrap';
import { SubmitAction } from '.';

export const DateHeader = (props: {
	date: string,
	sunset: string,
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}) => {
	const dateMoment = moment(props.date, "MM/DD/YYYY");
	const hiper = optionify(props.sunset)
		.map(time => moment(`${props.date} ${time}`, "MM/DD/YYYY HH:mm").subtract(30, "minutes").format("HH:mm"))
		.getOrElse(null);

	return <Card>
		<CardHeader>
			<Edit height="18px" className="float-right" onClick={() => props.openModal(
				<EditDateHeader sunset={props.sunset} setSubmitAction={props.setSubmitAction} />
			)} />
			<CardTitle tag="h2" className="mb-0">Dock Report</CardTitle>
		</CardHeader>
		<CardBody>
			<Table size="sm">
				<tbody>
					<tr>
						<th>Date</th>
						<td>{props.date}</td>
					</tr>
					<tr>
						<th>Day</th>
						<td>{dateMoment.format("dddd")}</td>
					</tr>
					<tr>
						<th>Sunset</th>
						<td>{props.sunset}</td>
					</tr>
					<tr>
						<th>Hiper</th>
						<td>{hiper}</td>
					</tr>
				</tbody>
			</Table>
		</CardBody>
	</Card>;
}

const EditDateHeader = (props: {
	sunset: string
	setSubmitAction: (submit: SubmitAction) => void,
}) => {
	const [sunsetTime, setSunsetTime] = React.useState(props.sunset || "")

	React.useEffect(() => {
		props.setSubmitAction(() => new Promise((resolve, reject) => {
			const regex = /^(?:23|22|21|20|[01][0-9]):[012345][0-9]$/
			if (regex.exec(sunsetTime)) resolve({sunset: sunsetTime});
			else reject("Specify time in military time e.g. (20:05 for 8:05PM).")
		}));
	}, [sunsetTime]);

	return <div className="form-group row">
		<label className='mr-10 col-form-label'>Sunset Time</label>
		<div className="col-sm-4">
			<Input type="text" placeholder='e.g. "19:48"' value={sunsetTime} onChange={e => setSunsetTime(e.target.value)}/>
		</div>
	</div>
}
