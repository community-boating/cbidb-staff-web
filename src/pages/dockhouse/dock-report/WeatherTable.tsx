import { TabularForm } from '@components/table/TabularForm';
import { ERROR_DELIMITER } from '@core/APIWrapper';
import { DATE_FORMAT_LOCAL_DATE, DATE_FORMAT_LOCAL_DATETIME, toMomentFromLocalDateTime } from '@util/dateUtil';
import { Editable } from '@util/EditableType';
import optionify from '@util/optionify';
import { optionifyProps } from '@util/OptionifyObjectProps';
import { combineValidations, validateNumber } from '@util/validate';
import * as moment from 'moment'
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

type WeatherReportNonEditable = "WEATHER_ID" | "DOCK_REPORT_ID"

type WeatherRecordEditable = Editable<WeatherRecord, WeatherReportNonEditable>

const getDisplayRows: (weatherRecords: WeatherRecord[], reportDate: string) => WeatherRecordEditable[] = (weatherRecords, reportDate) => {
	return WEATHER_TIMES.map(time => {
		const timeToFind = moment(`${reportDate}T${time}`, `${DATE_FORMAT_LOCAL_DATE}Thh:mmA`).format("X")
		const matchingRecord = optionify(weatherRecords.find(r => toMomentFromLocalDateTime(r.WEATHER_DATETIME).format("X") == timeToFind));
		return matchingRecord.map(r => ({
			WEATHER_ID: r.WEATHER_ID,
			DOCK_REPORT_ID: null,
			WEATHER_DATETIME: time,
			TEMP: r.TEMP.map(String).getOrElse(""),
			WEATHER_SUMMARY: r.WEATHER_SUMMARY.getOrElse(""),
			WIND_DIR: r.WIND_DIR.getOrElse(""),
			WIND_SPEED_KTS: r.WIND_SPEED_KTS.map(String).getOrElse(""),
			RESTRICTIONS: r.RESTRICTIONS.getOrElse("")
		})).getOrElse({
			WEATHER_ID: null,
			DOCK_REPORT_ID: null,
			WEATHER_DATETIME: time,
			TEMP: "",
			WEATHER_SUMMARY: "",
			WIND_DIR: "",
			WIND_SPEED_KTS: "",
			RESTRICTIONS: "",
		});
	})
}

const EditWeather = (props: {
	weatherRecords: WeatherRecord[],
	setSubmitAction: (submit: SubmitAction) => void,
	reportDate: string
}) => {
	const [weatherRecords, setWeatherRecords] = React.useState(getDisplayRows(props.weatherRecords, props.reportDate));

	console.log(weatherRecords)

	React.useEffect(() => {
		// console.log("setting submit action ", counts)
		props.setSubmitAction(() => {
			const errors = combineValidations(
				validateNumber(weatherRecords.map(w => w.WIND_SPEED_KTS)),
				validateNumber(weatherRecords.map(w => w.TEMP)),
				weatherRecords
				.map(w => w.WIND_DIR)
				.filter(d => !(new RegExp("(?:^$)|^(?:N|S|E|W|NE|NW|SE|SW|NNW|WNW|NNE|ENE|ESE|SSE|WSW|SSW)$")).exec(d.toUpperCase()))
				.map(d => `Invalid wind dir "${d}".  Use e.g. N, S, NE, SSW, etc`)
			)
			if (errors.length) return Promise.reject(errors.join(ERROR_DELIMITER))
			else return Promise.resolve({weather: weatherRecords.map(w => ({
				...optionifyProps(w),
				TEMP: optionify(w.TEMP).map(Number),
				WEATHER_ID: w.WEATHER_ID,
				DOCK_REPORT_ID: null,
				WIND_SPEED_KTS:optionify(w.WIND_SPEED_KTS).map(Number),
				WEATHER_DATETIME: moment(`${props.reportDate}T${w.WEATHER_DATETIME}`, `${DATE_FORMAT_LOCAL_DATE}Thh:mmA`).format(DATE_FORMAT_LOCAL_DATETIME)
			}))})
		});
	}, [weatherRecords]);

	const columns = [{
		Header: "Time",
		accessor: "WEATHER_DATETIME",
		cellWidth: 75,
		readonly: true
	}, {
		Header: "Temp (F)",
		accessor: "TEMP",
		cellWidth: 75
	}, {
		Header: "Weather",
		accessor: "WEATHER_SUMMARY"
	}, {
		Header: "Wind Dir",
		accessor: "WIND_DIR",
		cellWidth: 70
	}, {
		Header: "Wind (kts)",
		accessor: "WIND_SPEED_KTS",
		cellWidth: 90
	}, {
		Header: "Restrictions",
		accessor: "RESTRICTIONS",
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
	reportDate: string
}) => <Card>
	<CardHeader style={{borderBottom: "none", paddingBottom: 0}}>
		<Edit height="18px" className="float-right" style={{ cursor: "pointer" }} onClick={() => props.openModal(
			<EditWeather weatherRecords={props.weatherRecords} setSubmitAction={props.setSubmitAction} reportDate={props.reportDate} />
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
				{getDisplayRows(props.weatherRecords, props.reportDate).map((row, i) => <tr key={`row_${i}`}>
					<td><b>{row.WEATHER_DATETIME}</b></td>
					<td>{row.TEMP}</td>
					<td>{row.WEATHER_SUMMARY}</td>
					<td>{row.WIND_DIR}</td>
					<td>{row.WIND_SPEED_KTS}</td>
					<td>{row.RESTRICTIONS}</td>
				</tr>)}
			</tbody>
		</Table>
	</CardBody>
</Card>