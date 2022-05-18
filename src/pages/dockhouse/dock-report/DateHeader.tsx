import optionify from '@util/optionify';
import { padNumber } from '@util/padNumbers';
import * as _ from 'lodash';
import * as moment from 'moment'
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Input, Table } from 'reactstrap';
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
		<CardHeader style={{borderBottom: "none", paddingBottom: 0}}>
			<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
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
	const [initHour, initMinute] = (
		(props.sunset || "").indexOf(":") > 0
		? props.sunset.split(":")
		: ["", ""]
	)

	const [hour, setHour] = React.useState(initHour)
	const [minute, setMinute] = React.useState(initMinute)

	React.useEffect(() => {
		props.setSubmitAction(() => new Promise((resolve, reject) => {
			const regex = /^(?:23|22|21|20|[01][0-9]):[012345][0-9]$/
			const sunsetTime = `${hour}:${minute}`
			if (sunsetTime == ":") resolve({ sunset: null })
			else if (regex.exec(sunsetTime)) resolve({ sunset: sunsetTime });
			else reject("Specify time in military time e.g. (20:05 for 8:05PM).")
		}));
	}, [hour, minute]);

	const hours = _.range(16, 22).map(String)
	const minutes = _.range(0, 59).map(m => padNumber(m, 2))

	return <div className="form-group row">
		<label className='mr-10 col-form-label'>Sunset Time</label>
		<div className="col-sm-6">
			<Input
				type="select"
				className="mb-2"
				style={{display: "unset", width: "unset"}}
				onChange={e => setHour(e.target.value)}
				value={hour}
			>
				<option value="">-</option>
				{hours.map((h, i) => <option value={h} key={`row_${i}`}>{h}</option>)}
			</Input>
			{"  :  "}
			<Input
				type="select"
				className="mb-2"
				style={{display: "unset", width: "unset"}}
				onChange={e => setMinute(e.target.value)}
				value={minute}
			>
				<option value="">-</option>
				{minutes.map((m, i) => <option value={m} key={`row_${i}`}>{m}</option>)}
			</Input>
		</div>
	</div>
}
