import * as React from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from 'reactstrap';
import * as t from "io-ts";
import { ErrorPopup } from 'components/ErrorPopup';

import { boatTypesValidator, getBoatTypes, getRatings, getSignoutsToday, putSignout, ratingsValidator, signoutsValidator, signoutValidator } from 'async/rest/signouts-tables';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import { type } from 'os';
import { highSchoolValidator } from 'async/rest/high-schools';
import ReportWithModalForm, { validationError } from 'components/ReportWithModalForm';
import { SimpleReportColumn } from 'core/SimpleReport';
import { StringifiedProps, stringify, stringifyEditable } from 'util/StringifyObjectProps';
import { ValidatedSelectInput, ValidatedTextInput, ValidatedHourInput, ValidatedMinuteInput, ValidatedAmPmInput, wrapForFormComponents, wrapForFormComponentsMoment, SelectOption } from './input/ValidatedInput';
import { isSome, none, Option} from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import * as moment from "moment";
import { StringType } from 'io-ts';
import { OptionifiedProps } from 'util/OptionifyObjectProps';

import { FlagStatusIcons } from './FlagStatusIcons';

const POLL_FREQ_SEC = 10

export type SignoutsTablesState = t.TypeOf<typeof signoutsValidator>;
export type SignoutTablesState = t.TypeOf<typeof signoutValidator>;
export type BoatTypesValidatorState = t.TypeOf<typeof boatTypesValidator>;
export type RatingsValidatorState = t.TypeOf<typeof ratingsValidator>;

const SignoutTablesNonEditableObject : SignoutTablesNonEditable[] = ["$$crew", "$$skipper"];

type SignoutTablesNonEditable = "$$crew" | "$$skipper";

const signoutTypesHR = [
	{value: "S",display:"Sail"},
	{value: "C",display:"Class"},
	{value: "R",display:"Racing"},
	{value: "T",display:"Test"}
];

const testResultsHR = [
	{value:"Pass",display:"Pass"},
	{value:"Fail",display:"Fail"},
	{value:"Abort",display:"Abort"}
];

const programsHR = [
	{value:MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM,display:"AP"},
	{value:MAGIC_NUMBERS.PROGRAM_TYPE_ID.HIGH_SCHOOL,display:"HS"},
	{value:MAGIC_NUMBERS.PROGRAM_TYPE_ID.JUNIOR_PROGRAM,display:"JP"},
	{value:MAGIC_NUMBERS.PROGRAM_TYPE_ID.UNIVERSAL_ACCESS_PROGRAM,display:"UAP"}
];

function makeFlagIcon(row: SignoutTablesState, ratings: RatingsValidatorState){
	if(ratings.length == 0){
		return <p>Loading...</p>;
	}
	const mapped = {};
	ratings.forEach((a) => {
		mapped[String(a.ratingId)] = a;
	})
	const skipperRatings = row.$$skipper.$$personRatings.map((a) => mapped[a.ratingId])
	const flags = skipperRatings.map((a) => getHighestFlag(a,row.programId,row.boatId)).flatten().sort((a,b) => FlagStatusIcons[a as string].sortOrder-FlagStatusIcons[b as string].sortOrder);
	return <img width={30} height={30} src={FlagStatusIcons[flags[0] as string].src}/>
}

function getHighestFlag(rating, programId, boatId){
	return rating.$$boats.filter((a) => a.programId == programId && a.boatId == boatId).map((a) => a.flag);
}

function formatOptional(v: undefined | null | number| string | moment.Moment | Option<any>){
	if(v == undefined || v == null || (typeof v === "string" && v.length === 0) || v["_tag"] === "None"){
		return "None";
	}else if(typeof v === "string"){
		return v;
	}else if(v["_tag"] === "Some"){
		return String((v as Option<any>).getOrElse(undefined));
	}else{
		return String(v);
	}
}

function formatMoment(m: undefined | null | string | moment.Moment | Option<moment.Moment> | Option<string>, format: string){
	const stringM = formatOptional(m);
	if(stringM === "None"){
		return stringM;
	}else{
		return moment(stringM).format(format);
	}
}

function formatSelection(s: undefined | null | string | number | moment.Moment | Option<moment.Moment> | Option<string>, selectOptions: SelectOption[]): string{
	const stringS = formatOptional(s);
	if(stringS === "None"){
		return stringS;
	}else{
		for(var i = 0; i < selectOptions.length; i++){
			if(String(selectOptions[i].value) == stringS){
				return String(selectOptions[i].display);
			}
		}
		return "Invalid D: " + selectOptions.length;
	}
}

export const SignoutsTablesPage = (props: {
	initState: SignoutsTablesState,
}) => {
	
	const [modalErrors, setModalErrors] = React.useState(null as string[])
	const [boatTypes, setBoatTypes] = React.useState([] as BoatTypesValidatorState);
	const [ratings, setRatings] = React.useState([] as RatingsValidatorState);
	if(boatTypes.length == 0){
		getBoatTypes.send(null).then((a) => {
			if(a.type == "Success"){
				setBoatTypes(a.success);
			}
		})
	}
	if(ratings.length == 0){
		getRatings.send(null).then((a) => {
			if(a.type == "Success"){
				setRatings(a.success);
			}
		})
	}

	return <>
		<SignoutsTable {...props} boatTypes={boatTypes} ratings={ratings} isActive={true}/>
		<SignoutsTable {...props} boatTypes={boatTypes} ratings={ratings} isActive={false}/>
	</>;

	
}

const columnsBaseUpper: SimpleReportColumn[] = [
	{
		accessor: "edit",
		Header: "",
		disableSortBy: true,
		width: 50,
	},{
		Header: "Program",
		accessor: "programId",
		width: 90,
	}, {
		Header: "Signout Type",
		accessor: "signoutType",
		width: 90
	}, {
		Header: "Card #",
		accessor: "cardNum",
		width: 90
	}, {
		Header: "Name First",
		accessor: "nameFirst",
		width: 90
	}, {
		Header: "Name Last",
		accessor: "nameLast",
		width: 90
	}, {
		Header: "Sail #",
		accessor: "sailNumber",
		width: 90
	}, {
		Header: "Hull #",
		accessor: "hullNumber",
		width: 90
	}, {
		Header: "Boat",
		accessor: "boatId",
		width: 90
	}, {
		Header: "Signout Time",
		accessor: "signoutDatetime",
		width: 90
	}
];

const columnsBaseLower: SimpleReportColumn[] = [
	{
		Header: "Crew",
		accessor: "crew",
		width: 90
	}, {
		Header: "Links",
		accessor: "links",
		width: 90
	}, {
		Header: "Ratings",
		accessor: "ratings",
		width: 90
	}, {
		Header: "Comments",
		accessor: "comments",
		width: 90
	}
];

const columnsInactive: SimpleReportColumn[] = columnsBaseUpper.concat([
	{
		Header: "Signin Time",
		accessor: "signinDatetime",
		width: 90
	}]).concat(columnsBaseLower);
const columnsActive: SimpleReportColumn[] = columnsBaseUpper.concat(columnsBaseLower).concat([
	{
		Header: <Button style={{whiteSpace: "nowrap"}}>Multi Sign In</Button>,
		accessor: "multisignin",
		disableSortBy: true,
		width: 90
	}, {
		Header: "Icons",
		accessor: "icons",
		disableSortBy: true,
		width: 90,
	}
])

const SignoutsTable = (props: {
	initState: SignoutsTablesState,
	boatTypes: BoatTypesValidatorState,
	ratings: RatingsValidatorState,
	isActive: boolean
}) => {
	// Define table columns
	const boatTypesHR = props.boatTypes.sort((a,b) => a.displayOrder-b.displayOrder).map((v) => ({value:v.boatId,display:v.boatName}));
	const ratingsHR = props.ratings.sort((a,b) => a.ratingName.localeCompare(b.ratingName)).map((v) => ({value:v.ratingId,display:v.ratingName}));
	// Define edit/add form
	const formComponents = (
		rowForEdit: StringifiedProps<SignoutTablesState>,
		updateState: (id: string, value: string | boolean) => void,
		currentRow: SignoutTablesState,
		validationResults: validationError[]
	) => {
			const lower = moment("2000","yyyy");
			const upper = moment("2032","yyyy").add(6,"months").add(1,"days");
		return <>
		<React.Fragment>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Boat Type
				</Label>
				<Col sm={9}>
					<ValidatedSelectInput {...wrapForFormComponents(rowForEdit,updateState,"boatId", validationResults)} selectOptions={boatTypesHR} showNone="None"/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Card #
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{rowForEdit.cardNum || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Program
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{formatSelection(currentRow.programId, programsHR) || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					First Name
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{formatOptional((currentRow.$$skipper || {}).nameFirst) || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Last Name
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{formatOptional((currentRow.$$skipper || {}).nameLast) || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Signout Date/Time
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{formatOptional((currentRow || {}).signoutDatetime) || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Signin Date/Time
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{formatOptional((currentRow || {}).signinDatetime) || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Signout Type
				</Label>
				<Col sm={9}>
					<ValidatedSelectInput {...wrapForFormComponents(rowForEdit,updateState,"signoutType", validationResults)} selectOptions={signoutTypesHR} showNone="None"/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Test Rating
				</Label>
				<Col sm={9}>
					<ValidatedTextInput {...wrapForFormComponents(rowForEdit, updateState, "sailNumber", validationResults)}/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Test Rating
				</Label>
				<Col sm={9}>
					<ValidatedSelectInput {...wrapForFormComponents(rowForEdit,updateState,"testRatingId", validationResults)} selectOptions={ratingsHR} showNone="None"/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Test Result
				</Label>
				<Col sm={9}>
					<ValidatedSelectInput {...wrapForFormComponents(rowForEdit,updateState,"testResult", validationResults)} selectOptions={testResultsHR} showNone="None" selectNone={true}/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">	
					Signout Time
				</Label>
				<Col sm={3}>
					<ValidatedHourInput {...wrapForFormComponentsMoment(rowForEdit, updateState, "signoutDatetime", validationResults)} lower={lower} upper={upper}/>
				</Col>
				<Col sm={3}>
					<ValidatedMinuteInput {...wrapForFormComponentsMoment(rowForEdit, updateState, "signoutDatetime", validationResults)} lower={lower} upper={upper}/>
				</Col>
				<Col sm={3}>
					<ValidatedAmPmInput {...wrapForFormComponentsMoment(rowForEdit, updateState, "signoutDatetime" , validationResults)} lower={lower} upper={upper}/>
				</Col>
			</FormGroup>
		</React.Fragment>
		</>
	};
	const cardTitle=props.isActive ? "Active Signouts" : "Completed Signouts";
	const f = props.isActive ? (a : SignoutTablesState) => option.isNone(a.signinDatetime) : (a : SignoutTablesState) => option.isSome(a.signinDatetime);
	const columns = props.isActive ? columnsActive : columnsInactive;
	
	return <>
		<ReportWithModalForm
			rowValidator={signoutValidator}
			rows={props.initState.filter(f)}
			formatRowForDisplay={(row) => ({
				...stringify(row),
				nameFirst: formatOptional(row.$$skipper.nameFirst),
				nameLast: formatOptional(row.$$skipper.nameLast),
				programId: formatSelection(row.programId, programsHR),
				signoutType: formatSelection(row.signoutType, signoutTypesHR),
				sailNumber: formatOptional(row.sailNumber),
				hullNumber: formatOptional(row.hullNumber),
				boatId: formatSelection(row.boatId, boatTypesHR),
				signoutDatetime: formatMoment(row.signoutDatetime, "hh:mm A"),
				signinDatetime: formatMoment(row.signinDatetime, "hh:mm A"),
				icons: makeFlagIcon(row, props.ratings),
				crew:"Crew",
				edit:row['edit'],
			})}
				//ACTIVE: hs.ACTIVE ? <CheckIcon color="#777" size="1.4em" /> : null,
			primaryKey="signoutId"
			columns={columns}
			formComponents={formComponents}
			submitRow={putSignout}
			cardTitle={cardTitle}
			columnsNonEditable={SignoutTablesNonEditableObject}
		/>
	</>;
}