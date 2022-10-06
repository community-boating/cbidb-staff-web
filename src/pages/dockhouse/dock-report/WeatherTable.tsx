import { TabularForm } from 'components/table/TabularForm';
import { ERROR_DELIMITER } from 'core/APIWrapper';
import { DATE_FORMAT_LOCAL_DATE, DATE_FORMAT_LOCAL_DATETIME, toMomentFromLocalDateTime } from 'util/dateUtil';
import { Editable } from 'util/EditableType';
import optionify from 'util/optionify';
import { optionifyProps } from 'util/OptionifyObjectProps';
import { combineValidations, validateNumber } from 'util/validate';
import * as moment from 'moment'
import * as React from 'react';
import { Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardTitle, Table } from 'reactstrap';
import { SubmitAction, WeatherRecord } from '.';
import { ColumnDef } from '@tanstack/react-table';

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
			WIND_SPEED_KTS_STEADY: r.WIND_SPEED_KTS_STEADY.map(String).getOrElse(""),
			WIND_SPEED_KTS_GUST: r.WIND_SPEED_KTS_GUST.map(String).getOrElse(""),
			RESTRICTIONS: r.RESTRICTIONS.getOrElse("")
		})).getOrElse({
			WEATHER_ID: null,
			DOCK_REPORT_ID: null,
			WEATHER_DATETIME: time,
			TEMP: "",
			WEATHER_SUMMARY: "",
			WIND_DIR: "",
			WIND_SPEED_KTS_STEADY: "",
			WIND_SPEED_KTS_GUST: "",
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

	React.useEffect(() => {
		props.setSubmitAction(() => {
			const errors = combineValidations(
				validateNumber(weatherRecords.map(w => w.WIND_SPEED_KTS_STEADY)),
				validateNumber(weatherRecords.map(w => w.WIND_SPEED_KTS_GUST)),
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
				WIND_SPEED_KTS_STEADY:optionify(w.WIND_SPEED_KTS_STEADY).map(Number),
				WIND_SPEED_KTS_GUST:optionify(w.WIND_SPEED_KTS_GUST).map(Number),
				WEATHER_DATETIME: moment(`${props.reportDate}T${w.WEATHER_DATETIME}`, `${DATE_FORMAT_LOCAL_DATE}Thh:mmA`).format(DATE_FORMAT_LOCAL_DATETIME)
			}))})
		});
	}, [weatherRecords]);

	const columns: ColumnDef<WeatherRecord>[] = [{
		header: "Time",
		accessorKey: "WEATHER_DATETIME",
		size: 75,
		meta: {
			readonly: true
		}
	}, {
		header: "Temp (F)",
		accessorKey: "TEMP",
		size: 75
	}, {
		header: "Weather",
		accessorKey: "WEATHER_SUMMARY"
	}, {
		header: "Wind Dir",
		accessorKey: "WIND_DIR",
		size: 70
	}, {
		header: "Wind Stdy (kts)",
		accessorKey: "WIND_SPEED_KTS_STEADY",
		size: 90
	}, {
		header: "Wind Gust (kts)",
		accessorKey: "WIND_SPEED_KTS_GUST",
		size: 90
	}, {
		header: "Restrictions",
		accessorKey: "RESTRICTIONS",
		size: 420,
		meta: {
			textAreaHeight: 4
		}
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
					<td>{row.WIND_SPEED_KTS_STEADY} - {row.WIND_SPEED_KTS_GUST}</td>
					<td>{row.RESTRICTIONS}</td>
				</tr>)}
			</tbody>
		</Table>
	</CardBody>
</Card>