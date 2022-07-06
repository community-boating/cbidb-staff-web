import * as React from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Popover, PopoverBody, PopoverHeader, Table} from 'reactstrap';
import * as t from "io-ts";
import { ErrorPopup } from 'components/ErrorPopup';

import { boatsValidator, boatTypesValidator, getBoatTypes, getRatings, getSignoutsToday, programsValidator, putSignout, ratingsValidator, ratingValidator, signoutsValidator, signoutValidator, signoutCrewValidator, getPersonByCardNumber, crewPersonValidator, putSignouts } from 'async/rest/signouts-tables';
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

import reassignedIcon from "assets/img/reassigned.png";
import stopwatchIcon from "assets/img/stopwatch.jpg";

import { FlagStatusIcons } from './FlagStatusIcons';
import { ReactNode } from 'react';
import { sortRatings, RatingsHover, findOrphanedRatings } from './RatingSorter';
import { Row } from 'react-table';
import { MultiHover } from './MultiHover';
import { X, Info } from 'react-feather';
import { makePostJSON } from 'core/APIWrapperUtil';
import { EditCommentsModal } from './input/EditCommentModal';
import { ButtonWrapper } from 'components/ButtonWrapper';
import { DefaultDateTimeFormat } from 'util/OptionalTypeValidators';

const POLL_FREQ_SEC = 10;

export type SignoutsTablesState = t.TypeOf<typeof signoutsValidator>;
export type SignoutTablesState = t.TypeOf<typeof signoutValidator>;
export type BoatTypesValidatorState = t.TypeOf<typeof boatTypesValidator>;
export type RatingsValidatorState = t.TypeOf<typeof ratingsValidator>;

const SignoutTablesNonEditableObject : SignoutTablesNonEditable[] = ["$$crew", "$$skipper", "personId", "programId", "cardNum"];

type SignoutTablesNonEditable = "$$crew" | "$$skipper" | "personId" | "programId" | "cardNum";

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

export const programsHR = [
	{value:MAGIC_NUMBERS.PROGRAM_TYPE_ID.ADULT_PROGRAM,display:"Adult Program"},
	{value:MAGIC_NUMBERS.PROGRAM_TYPE_ID.HIGH_SCHOOL,display:"High School"},
	{value:MAGIC_NUMBERS.PROGRAM_TYPE_ID.JUNIOR_PROGRAM,display:"Junion Program"},
	{value:MAGIC_NUMBERS.PROGRAM_TYPE_ID.UNIVERSAL_ACCESS_PROGRAM,display:"UAP"}
];

const iconWidth = 30;
const iconHeight = 30;

function isMax(n: number, a: number[]){
	for(var v of a){
		if(v > n){
			return false;
		}
	}
	return true;
}

const ReassignedIcon = (props: {row: SignoutTablesState, reassignedHullsMap: {[key:string]: {[key:number]: number[]}}, reassignedSailsMap: {[key:string]: {[key:number]: number[]}}}) => {
	const reassignedHull = option.isSome(props.row.hullNumber) && !isMax(props.row.signoutId, props.reassignedHullsMap[props.row.hullNumber.getOrElse("")][props.row.boatId]);
	const reassignedSail = option.isSome(props.row.sailNumber) && !isMax(props.row.signoutId, props.reassignedSailsMap[props.row.sailNumber.getOrElse("")][props.row.boatId]);
	if(reassignedHull || reassignedSail){
		return <img width={iconWidth} height={iconHeight} src={reassignedIcon}/>
	}
	return <></>;
}

const FlagIcon = (props: {row: SignoutTablesState, ratings: RatingsValidatorState}) => {
	if(props.ratings.length == 0){
		return <p>Loading...</p>;
	}
	const mapped = {};
	props.ratings.forEach((a) => {
		mapped[String(a.ratingId)] = a;
	});
	const skipperRatings = props.row.$$skipper.$$personRatings.map((a) => mapped[a.ratingId]);
	const flags = skipperRatings.map((a) => getHighestFlag(a,props.row.programId,props.row.boatId)).flatten().filter((a) => FlagStatusIcons[a as string] !== undefined).sort((a,b) => FlagStatusIcons[a as string].sortOrder-FlagStatusIcons[b as string].sortOrder);
	return <img width={iconWidth} height={iconHeight} src={(FlagStatusIcons[flags[0] as string] || FlagStatusIcons.B).src}/>;
}

const MakeLinks = (props: {row: SignoutTablesState, isActive: boolean, state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void}) => {
	if(props.isActive){
		return <a onClick={() => handleSingleSignIn(props.row.signoutId, false, props.state, props.setState)}>Sign In</a>
	}else{
		return <a onClick={() => handleSingleSignIn(props.row.signoutId, true, props.state, props.setState)}>Undo Sign In</a>;
	}
}

function momentNowDefaultDateTime(){
	const momentNow = moment();
	momentNow["_f"] = DefaultDateTimeFormat;
	return momentNow;
}

const StopwatchIcon = (props: {row: SignoutTablesState}) => {
	//2 hours
	if(moment().diff(props.row.signoutDatetime.getOrElse(moment())) > 2*60*60*1000){
		return <img width={iconWidth} height={iconHeight} src={stopwatchIcon} />;
	}
	return <></>;
}

function getHighestFlag(rating, programId, boatId){
	return rating !== undefined ? rating.$$boats.filter((a) => a.programId == programId && a.boatId == boatId).map((a) => a.flag) : undefined;
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

function filterRows(rows: Row<any>[], columnIds: string[], filterValue: SignoutsTableFilterState){
	return rows.filter((a) => {
		return (filterValue.sail.trim().length === 0 || (a.values['sailNumber'] || "") == (filterValue.sail.trim())) &&
		(filterValue.nameOrCard.trim().length === 0 || (a.values['nameFirst'] || "").concat(a.values['nameLast'] || "").concat(a.values['cardNum'] || "").toLowerCase().includes(filterValue.nameOrCard.toLowerCase())) &&
		(filterValue.boatType.length === 0 || (a.values['boatId'] == filterValue.boatType)) &&
		(filterValue.programId.length === 0 || (a.values['programId'] == filterValue.programId)) &&
		(filterValue.signoutType.length === 0 || (a.values['signoutType'] == filterValue.signoutType))
		}
	);
}

function makeInitFilter(){
	return {boatType:"",nameOrCard:"",sail:"",signoutType:"",programId:""};
}

export const SignoutsTablesPage = (props: {
	initState: SignoutsTablesState,
}) => {
	
	const [boatTypes, setBoatTypes] = React.useState([] as BoatTypesValidatorState);
	const [ratings, setRatings] = React.useState([] as RatingsValidatorState);
	const [filterValue, setFilterValue] = React.useState(makeInitFilter());
	const boatTypesHR = React.useMemo(() => makeBoatTypesHR(boatTypes), [boatTypes]);
	const [state, setState] = React.useState(props.initState);
	const timeoutID = React.useMemo(() => {console.log("called create"); return setInterval(() => {
			getSignoutsToday.send(null).then((a) => {
				//console.log("fetching...");
				if(a.type === "Success"){
					setState(a.success);
				}else{
					alert("error refreshing signouts");
					clearInterval(timeoutID);
				}
			})
		}, 10000)}, []);
	React.useEffect(() => {
		setState(props.initState);
	}, [props.initState]);
	//var initStateCloned = [];
	//for(var i = 0; i < 1000; i++){
	//	initStateCloned[i] = Object.assign({}, props.initState[0]);
	//	initStateCloned[i].signoutId = i*10;
	//}
	if(boatTypes.length == 0){
		getBoatTypes.send(null).then((a) => {
			if(a.type == "Success"){
				setBoatTypes(a.success);
			}
		});
	}
	if(ratings.length == 0){
		getRatings.send(null).then((a) => {
			if(a.type == "Success"){
				setRatings(a.success);
			}
		});
	}

	const updateState = (id: string, value: string | boolean) => {
		const newFilterState = Object.assign({}, filterValue);
		newFilterState[id] = value;
		setFilterValue(newFilterState);
	};
	const optionsMap = (a) => ({ value: a.display, display: a.display });
	const tdStyle: React.CSSProperties = { verticalAlign: "middle", textAlign: "right" };
	const labelStyle: React.CSSProperties = { margin: 0 };
	const signoutsTableFilter = React.useMemo(() => <><Table>
		<tbody>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Name/Card
					</Label>
				</td>
				<td>
					<ValidatedTextInput {...wrapForFormComponents(filterValue, updateState, "nameOrCard", [])} />
				</td>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Boat Type
					</Label>
				</td>
				<td>
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "boatType", [])} selectOptions={boatTypesHR.map(optionsMap)} showNone="None" selectNone={true} />
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Sail
					</Label>
				</td>
				<td style={tdStyle}>
					<ValidatedTextInput {...wrapForFormComponents(filterValue, updateState, "sail", [])} />
				</td>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Signout Type
					</Label>
				</td>
				<td style={tdStyle}>
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "signoutType", [])} selectOptions={signoutTypesHR.map(optionsMap)} showNone="None" selectNone={true} />
				</td>
			</tr>
			<tr>
				<td style={tdStyle}>
					<Label style={labelStyle}>
						Program
					</Label>
				</td>
				<td style={tdStyle}>
					<ValidatedSelectInput {...wrapForFormComponents(filterValue, updateState, "programId", [])} selectOptions={programsHR.map(optionsMap)} showNone="None" selectNone={true} />
				</td>
				<td style={tdStyle}>
				</td>
				<td style={tdStyle}>
					<Button onClick={() => setFilterValue(makeInitFilter())}>Clear Filters</Button>
				</td>
			</tr>
		</tbody>
	</Table></>, [filterValue, boatTypesHR]);

	return <>
		{signoutsTableFilter}
		<SignoutsTable {...props} state={state} setState={setState} boatTypes={boatTypes} ratings={ratings} isActive={true} filterValue={filterValue} globalFilter={filterRows}/>
		<SignoutsTable {...props} state={state} setState={setState} boatTypes={boatTypes} ratings={ratings} isActive={false} filterValue={filterValue} globalFilter={filterRows}/>
	</>;

	
}

type SignoutsTableFilterState = {
	boatType: string,
	signoutType: string,
	programId: string,
	nameOrCard: string,
	sail: string
}

const columnsBaseUpper: SimpleReportColumn[] = [
	{
		accessor: "edit",
		Header: "Edit",
		disableSortBy: true,
		width: 50,
		toggleHidden: true
	},{
		Header: "Program",
		accessor: "programId",
		width: 90,
		toggleHidden: true
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
		width: 120
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
		Header: "Multi Sign In",
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

function mapOptional(n: Option<string>, boatId: number, signoutId: number, b : {[key:string]: {[key:number]: number[]}}){
	if(option.isSome(n)){
		var val = (b[n.getOrElse("")] || {})
		val[boatId] = (val[boatId] || []).concat(signoutId);
		b[n.getOrElse("")] = val;
	}
}

const orphanedRatingsShownByDefault = {
	4: true,
	28: true,
	61: true,
	62: true,
	68: true,
	131: true,
	132: true,
	133: true,
	134: true
}

function makeBoatTypesHR(boatTypes: BoatTypesValidatorState) {
	return boatTypes.sort((a, b) => a.displayOrder - b.displayOrder).map((v) => ({ value: v.boatId, display: v.boatName }));
}

const CrewRow = (props: {crew: t.TypeOf<typeof signoutCrewValidator>, removeCrew?: (crewId: number) => void}) => {
	return <tr key={props.crew.crewId.getOrElse(-1)}>
		{props.removeCrew !== undefined ? <td><a onClick={() => props.removeCrew(props.crew.crewId.getOrElse(-1))}><X color="#777" size="1.4em" /></a></td> : <></>}
		<td>{props.crew.cardNum.getOrElse("None")}</td>
		<td>{props.crew.$$person.nameFirst}</td>
		<td>{props.crew.$$person.nameLast}</td>
	</tr>
}

const CrewHover = (props: {row: SignoutTablesState, removeCrew?: (crewId: number) => void}) => {
	if (props.row.$$crew.length === 0) {
		return <p>-</p>;
	}
	return <MultiHover id={"crew_" + props.row.signoutId} makeChildren={() => <CrewTable row={props.row} removeCrew={props.removeCrew} />} closeOthers={[]} openDisplay={"Crew"} />
}

const AddCrew = (props: { row: SignoutTablesState, updateCurrentRow: (row: SignoutTablesState) => void}) => {
	const [cardNum, setCardNum] = React.useState(option.none as Option<string>);
	const [person, setPerson] = React.useState(undefined as t.TypeOf<typeof crewPersonValidator>);
	const throttler: ThrottledUpdater = React.useMemo(() => new ThrottledUpdater(200, () => {}), []);
	React.useEffect(() => {
		throttler.handleUpdate = () => {
			getPersonByCardNumber.sendWithParams(none, { cardNumber: Number(cardNum.getOrElse("")) })(null).then((a) => {
				if(a.type === "Success"){
					setPerson(a.success);
				}else{
					setPerson(undefined);
				}
			});
		};
		throttler.startUpdate();
	}, [cardNum]);
	if (props.row.signoutId === undefined) {
		return <></>;
	}
	return <>
		<ValidatedTextInput type={"text"} initValue={cardNum} updateValue={(val) => setCardNum(val)} validationResults={[]} />
		{person !== undefined ? <CrewRow crew={{$$person:person,cardNum:cardNum, crewId:option.some(-1), personId:option.some(person.personId),signoutId: undefined, startActive: undefined, endActive:undefined}} /> : "Not found"}
		{person !== undefined ? <button onClick={(e) => {
			e.preventDefault();
			const newCrew = [...props.row.$$crew];
			newCrew.push({crewId: option.none, personId: option.some(person.personId), cardNum: cardNum, signoutId: option.some(props.row.signoutId), startActive: option.none, endActive: option.none, $$person:person, apAttendanceId: null, jpAttendanceId: null} as any);
			props.updateCurrentRow({...props.row, $$crew: newCrew});
		}}>Add</button> : ""}
	</>
}

const CommentsHover = (props: {row: SignoutTablesState, setUpdateCommentsModal: (singoutId: number) => void}) => {
	const display = <><p>Comments{props.row.comments["_tag"] === "Some" ? <Info color="#777" size="1.4em" /> : <></>}</p></>;
	return <MultiHover id={"comments_" + props.row.signoutId} makeChildren={() => props.row.comments["_tag"] === "Some" ? <p>{props.row.comments.getOrElse("")}</p> : undefined} handleClick={() => props.setUpdateCommentsModal(props.row.signoutId)} closeOthers={[]} openDisplay={display} noMemoChildren={true}/>;
}

const MultiSigninCheckbox = (props : {row: SignoutTablesState, multiSignInSelected: number[], setMultiSignInSelected: (multiSignInSelected: number[]) => void}) => {
	return <FormGroup check><Input type="checkbox" checked={props.multiSignInSelected.contains(props.row.signoutId)} onChange={(e) => {if(e.target.checked){props.setMultiSignInSelected(props.multiSignInSelected.concat(props.row.signoutId))}else{props.setMultiSignInSelected(props.multiSignInSelected.filter((a) => a != props.row.signoutId))}}}/></FormGroup>;
}

class ThrottledUpdater {
	timerID: NodeJS.Timeout;
	timeout: number;
	handleUpdate: () => void;
	constructor(timeout: number, handleUpdate: () => void){
		this.timerID = undefined;
		this.timeout = timeout;
		this.handleUpdate = handleUpdate;
		this.startUpdate = this.startUpdate.bind(this);
		this.cancel = this.cancel.bind(this);
	}
	startUpdate(){
		this.cancel();
		this.timerID = setTimeout(function() {
			this.handleUpdate();
			this.timerID = undefined;
		}.bind(this), this.timeout);
	}
	cancel(){
		if(this.timerID != undefined){
			clearTimeout(this.timerID);
		}
	}

}

const CrewTable = (props: { row: SignoutTablesState, removeCrew?: (crewId: number) => void }) => <Table size="sm">
	<thead>
		<tr>
			{props.removeCrew != undefined ? <td>Remove</td> : <></>}
			<td>Card #</td>
			<td>First</td>
			<td>Last</td>
		</tr>
	</thead>
	<tbody>
		{(props.row.$$crew || []).map((a) => <CrewRow crew={a} removeCrew={props.removeCrew} />)}
	</tbody>
</Table>

function handleMultiSignIn(multiSignInSelected: number[], state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void) : Promise<any> {
	const signinDatetime = option.some(momentNowDefaultDateTime());
	if(multiSignInSelected.length === 0){
		return Promise.resolve();
	}
	return putSignouts.send({type: "json", jsonData: multiSignInSelected.map((a) => ({signoutId: a, signinDatetime: signinDatetime}))}).then((a) => {
		if(a.type === "Success"){
			const newState = Object.assign([], state);
			for(var i = 0; i < newState.length; i++){
				if(multiSignInSelected.contains(state[i].signoutId)){
					newState[i] = Object.assign({}, state[i]);
					newState[i].signinDatetime = signinDatetime;
				}
			}
			setState(newState);
		}else{
			alert("internal server error");
		}
	});
}

function handleSingleSignIn(signoutId: number, isUndo: boolean, state: SignoutsTablesState, setState: (state: SignoutsTablesState) => void){
	const signinDatetime = isUndo ? option.none : option.some(momentNowDefaultDateTime());
	return putSignout.send(makePostJSON({signoutId: signoutId, signinDatetime: signinDatetime})).then((a) => {
		if(a.type === "Success"){
			const newState = Object.assign([], state);
			for(var i = 0; i < newState.length; i++){
				if(state[i].signoutId == signoutId){
					newState[i] = Object.assign({}, state[i]);
					newState[i].signinDatetime = signinDatetime;
					break;
				}
			}
			setState(newState);
		}
	})
}

const SignoutsTable = (props: {
	state: SignoutsTablesState,
	setState: (state: SignoutsTablesState) => void,
	boatTypes: BoatTypesValidatorState,
	ratings: RatingsValidatorState,
	isActive: boolean,
	filterValue: SignoutsTableFilterState,
	globalFilter: (rows: Row<any>[], columnIds: string[], filterValue: SignoutsTableFilterState) => Row<any>[]
})=> {
	//Anti pattern used for showing/hiding other modals, allows the parent not to update which is expensive
	//In the future some of the computational expense of updating the signoutstable can be removed by caching elements.
	const [closeOthers, setCloseOthers] = React.useState([]);
	const [updateCommentsModal, setUpdateCommentsModal] = React.useState(undefined as number);
	const [multiSignInSelected, setMultiSignInSelected] = React.useState([] as number[]);
	// Define table columns
	const boatTypesHR = makeBoatTypesHR(props.boatTypes);
	const ratingsHR = props.ratings.sort((a,b) => a.ratingName.localeCompare(b.ratingName)).map((v) => ({value:v.ratingId,display:v.ratingName}));
	// Define edit/add form
	const formComponents = (
		rowForEdit: StringifiedProps<SignoutTablesState>,
		updateState: (id: string, value: string | boolean) => void,
		currentRow: SignoutTablesState,
		validationResults: validationError[],
		updateCurrentRow: (row) => void
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
					<ValidatedTextInput type="text" {...wrapForFormComponents(rowForEdit, updateState, "sailNumber", validationResults)}/>
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
			<FormGroup row>
				<Col>
				<h1>Crew</h1>
				<CrewTable row={currentRow} removeCrew={(crewId: number) => {
					const newCrew = currentRow.$$crew.filter((a) => a.crewId.getOrElse(-1) != crewId);
					updateCurrentRow({...currentRow, $$crew:newCrew})
				}} />
				</Col>
			</FormGroup>
			<FormGroup row>
				<Col>
				<h1>Add Crew</h1>
					<AddCrew row={currentRow} updateCurrentRow={updateCurrentRow} />
				</Col>
			</FormGroup>
		</React.Fragment>
		</>
	};
	const cardTitle=props.isActive ? "Active Signouts" : "Completed Signouts";
	const f = props.isActive ? (a : SignoutTablesState) => option.isNone(a.signinDatetime) : (a : SignoutTablesState) => option.isSome(a.signinDatetime);
	var columns = props.isActive ? columnsActive : columnsInactive;
	if(props.isActive){
		columns = Object.assign([], columns);
		for(var i = 0; i < columns.length; i++){
			if(columns[i].accessor === "multisignin"){
				columns[i] = Object.assign({}, columns[i]);
				columns[i].Header = <ButtonWrapper spinnerOnClick onClick={() => handleMultiSignIn(multiSignInSelected, props.state, props.setState)}>Multi Sign In</ButtonWrapper>
			}
		}
		//columnsActive.find((a) => a.accessor === "multisignin").Header = <p>do it</p>;
	}
	const reassignedHullsMap = {};
	const reassignedSailsMap = {};
	const filteredSignouts = props.state.filter(f);
	if(props.isActive){
		filteredSignouts.forEach((a) => {mapOptional(a.hullNumber,a.boatId,a.signoutId,reassignedHullsMap)});
		filteredSignouts.forEach((a) => {mapOptional(a.sailNumber,a.boatId,a.signoutId,reassignedSailsMap)});
	}
	
	const sortedRatings = sortRatings(props.ratings);
	const updateCommentsSubmit = (comments: Option<string>, signoutId: number) => putSignout.send(makePostJSON({signoutId: signoutId, comments:comments})).then((a) => {
		if(a.type === "Success"){
			setUpdateCommentsModal(undefined);
			const newRows = Object.assign([], props.state);
			for(var row of newRows){
				if(row.signoutId == signoutId){
					row.comments = comments;
				}
			}
			props.setState(newRows);
		}else{
			alert("Server error");
		}
	});
	return <>
		<ReportWithModalForm
			globalFilterValueControlled={props.filterValue}
			globalFilter={props.globalFilter}
			rowValidator={signoutValidator}
			rows={filteredSignouts}
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
				icons: props.isActive ? <>{<FlagIcon row={row} ratings={props.ratings}/>}{<StopwatchIcon row={row}/>}{<ReassignedIcon row={row} reassignedHullsMap={reassignedHullsMap} reassignedSailsMap={reassignedSailsMap}/>}</> : <></>,
				ratings: <RatingsHover row={row} sortedRatings={sortedRatings} orphanedRatingsShownByDefault={orphanedRatingsShownByDefault} closeOthers={closeOthers}/>,
				crew: <CrewHover row={row}/>,
				comments: <CommentsHover row={row} setUpdateCommentsModal={setUpdateCommentsModal} />,
				multisignin: <MultiSigninCheckbox row={row} multiSignInSelected={multiSignInSelected} setMultiSignInSelected={setMultiSignInSelected} />,
				links: <MakeLinks row={row} isActive={props.isActive} state={props.state} setState={props.setState}/>,
				edit:row['edit'],
			})}
				//ACTIVE: hs.ACTIVE ? <CheckIcon color="#777" size="1.4em" /> : null,
			primaryKey="signoutId"
			columns={columns}
			formComponents={formComponents}
			submitRow={putSignout}
			cardTitle={cardTitle}
			columnsNonEditable={SignoutTablesNonEditableObject}
			columnsRaw={["$$crew"]}
			setRowData={props.setState}
			hidableColumns={true}
			makeExtraModal={(rowData: SignoutsTablesState) => <EditCommentsModal modalIsOpen={updateCommentsModal !== undefined} setModalIsOpen={() => {setUpdateCommentsModal(undefined)}} currentRow={rowData.find((a) => a.signoutId == updateCommentsModal)} updateComments={updateCommentsSubmit}></EditCommentsModal>}
		/>
	</>;
}
