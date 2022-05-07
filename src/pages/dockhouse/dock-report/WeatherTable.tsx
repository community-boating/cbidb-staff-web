import * as React from 'react';
import { Card, CardHeader, CardTitle, Table } from 'reactstrap';

const weatherTimes = [
	"09:00AM",
	"11:00AM",
	"01:00PM",
	"03:00PM",
	"05:00PM",
	"07:00PM",
]

const weatherElements = [{
	time: "09:00AM",
	temp: "53",
	weather: "Cloudy",
	windDir: "NNE",
	windSpeedKts: "8",
	restrictions: "Wetsuits"
}, {
	time: "11:00AM",
	temp: "56",
	weather: "Ptly Cloudy",
	windDir: "N",
	windSpeedKts: "9",
	restrictions: "Wetsuits on hiper.  halfriver for fireworks barge. other random shit that i just thought of."
}]

export default () => <Card>
	<CardHeader>
		<CardTitle><h4>Weather</h4></CardTitle>
		<Table size="sm">
			<tbody>
				<tr>
					<th style={{width: "75px"}}>Time</th>
					<th style={{width: "95px"}}>Temp (F)</th>
					<th>Weather</th>
					<th style={{width: "90px"}}>Wind Dir</th>
					<th style={{width: "90px"}}>Wind (kts)</th>
					<th style={{maxWidth: "180px"}}>Restrictions</th>
				</tr>
				{weatherTimes.map(time => {
					const row = weatherElements.find(e => e.time == time);
					return <tr>
					<td><b>{time}</b></td>
					<td>{row && row.temp}</td>
					<td>{row && row.weather}</td>
					<td>{row && row.windDir}</td>
					<td>{row && row.windSpeedKts}</td>
					<td>{row && row.restrictions}</td>
				</tr>
				})}
			</tbody>
		</Table>
	</CardHeader>
</Card>