import { TabularForm } from '@components/TabularForm';
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { SubmitAction, WeatherRecord } from '.';

const WEATHER_TIMES = [
	"09:00AM",
	"11:00AM",
	"01:00PM",
	"03:00PM",
	"05:00PM",
	"07:00PM",
]

const getDisplayRows: (weatherRecords: WeatherRecord[]) => WeatherRecord[] = weatherRecords => {
	return WEATHER_TIMES.map(time => {
		const matchingRecord = weatherRecords.find(r => r.time == time);
		return {
			time,
			temp: (matchingRecord && matchingRecord.temp) || "",
			weather: (matchingRecord && matchingRecord.weather) || "",
			windDir: (matchingRecord && matchingRecord.windDir) || "",
			windSpeedKts: (matchingRecord && matchingRecord.windSpeedKts) || "",
			restrictions: (matchingRecord && matchingRecord.restrictions) || "",
		}
	})
}

const EditWeather = (props: {
	weatherRecords: WeatherRecord[],
	setSubmitAction: (submit: SubmitAction) => void,
}) => {
	const [weatherRecords, setWeatherRecords] = React.useState(getDisplayRows(props.weatherRecords));

	React.useEffect(() => {
		// console.log("setting submit action ", counts)
		props.setSubmitAction(() => Promise.resolve({weather: []}));
	}, [weatherRecords]);

	const columns = [{
		Header: "Time",
		accessor: "time",
		cellWidth: 75,
		readonly: true
	}, {
		Header: "Temp (F)",
		accessor: "temp",
		cellWidth: 75
	}, {
		Header: "Weather",
		accessor: "weather"
	}, {
		Header: "Wind Dir",
		accessor: "windDir",
		cellWidth: 70
	}, {
		Header: "Wind (kts)",
		accessor: "windSpeedKts",
		cellWidth: 90
	}, {
		Header: "Restrictions",
		accessor: "restrictions",
		cellWidth: 220,
		textAreaHeight: 4
	}];

	return <div className="form-group row">
		<TabularForm columns={columns} data={weatherRecords} setData={setWeatherRecords}/>
	</div>
}

export default (props: {
	weatherRecords: WeatherRecord[],
	openModal: (content: JSX.Element) => void,
	setSubmitAction: (submit: SubmitAction) => void
}) => <Card>
	<CardHeader style={{borderBottom: "none", paddingBottom: 0}}>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
			<EditWeather weatherRecords={props.weatherRecords} setSubmitAction={props.setSubmitAction} />
		)} />
		<CardTitle><h4>Weather</h4></CardTitle>
	</CardHeader>
	<CardBody>
		<Table size="sm">
			<tbody>
				<tr>
					<th style={{width: "75px"}}>Time</th>
					<th style={{width: "75px"}}>Temp (F)</th>
					<th>Weather</th>
					<th style={{width: "70px"}}>Wind Dir</th>
					<th style={{width: "90px"}}>Wind (kts)</th>
					<th style={{maxWidth: "180px"}}>Restrictions</th>
				</tr>
				{getDisplayRows(props.weatherRecords).map((row, i) => <tr key={`row_${i}`}>
					<td><b>{row.time}</b></td>
					<td>{row.temp}</td>
					<td>{row.weather}</td>
					<td>{row.windDir}</td>
					<td>{row.windSpeedKts}</td>
					<td>{row.restrictions}</td>
				</tr>)}
			</tbody>
		</Table>
	</CardBody>
</Card>