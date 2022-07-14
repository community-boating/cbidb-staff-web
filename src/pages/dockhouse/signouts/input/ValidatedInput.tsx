import * as React from 'react';
import { CustomInput, FormFeedback, FormGroup, FormGroupProps, Input, InputProps, Tooltip } from "reactstrap";
import { isSome, none, Option} from 'fp-ts/lib/Option';
import { either, option, validation } from 'fp-ts';
import { ReactNode } from 'react';
import { OptionalString } from 'util/OptionalTypeValidators';
import { max, some, update } from 'lodash';
import * as moment from "moment";
import { UpdateStateType, validationError } from 'components/ReportWithModalForm';

export type ValidatedInputProps<T> = {
	initValue: T,
	updateValue: (value: T) => void,
	validationResults: validationError[]
}

type StateType<T> = {
	showErrors: boolean
};

type ValidatedInputAdapterProps<T> = {
	convertChange: (e: React.ChangeEvent<HTMLInputElement>) => T,
	makeInputProps : (value: T) => any,
}

export class ValidatedInput<T> extends React.Component<(ValidatedInputProps<T> & ValidatedInputAdapterProps<T> & InputProps), StateType<T>>  {
	constructor(props){
		super(props);
		this.state = { showErrors:false };
	}
	render() {
		var {initValue,updateValue,children,makeInputProps,convertChange,validationResults,...other}=this.props;
		var errorTooltip = <></>;
		if(validationResults.length > 0){
			errorTooltip=<FormFeedback>{validationResults.map((a) => a["display"] || a)}</FormFeedback>;
		}
		return (
			<>
			<Input {...other} {...makeInputProps(this.props.initValue)} 
			onChange={(e) => {updateValue(convertChange(e))}}
			invalid={validationResults.length > 0}
			onBlur={() => {
				this.setState({...this.state,showErrors:false})
				}}
			onFocus={() => {
				this.setState({...this.state,showErrors:true})
			}}
			/>
			{errorTooltip}
			</>
		);
	}
}

export const ValidatedTextInput = (props: ValidatedInputProps<Option<string>> & InputProps) => {
	return <ValidatedInput {...props} 
	makeInputProps={(v) => {
		return {value:v.getOrElse("")} }}
	convertChange={(e) => e.target.value.trim().length === 0 ? option.none : option.some(e.target.value)
	}/>;
}

export type SelectOptionType = string | number;

export type SelectOption = {value: SelectOptionType, display: ReactNode};

export const ValidatedSelectInput = (props: ValidatedInputProps<Option<string>> & InputProps & {selectOptions : SelectOption[], showNone?: ReactNode, selectNone?: boolean}) => {
	const {selectOptions,showNone,selectNone,...other} = props;
	const value : SelectOptionType = "" as SelectOptionType;
	const showNonePadded = showNone === undefined ? "None" : showNone;
	const selectOptionsWithNone = [{value:value,display:showNonePadded}].concat(selectOptions);
	return <ValidatedInput {...other}
	makeInputProps={(v) => {
		var selectOptionsCurrent = (selectNone === true || v.isNone()) ? selectOptionsWithNone : selectOptions;
		return ({value:v.getOrElse(""),children:selectOptionsCurrent.map((a, i) => <option value={a.value} key={i}>{a.display}</option>)}); }}
	convertChange={(e) => e.target.value.trim().length === 0 ? option.none : option.some(e.target.value)}
	type="select"/>;
}

export const ValidatedCheckboxInput = (props: ValidatedInputProps<Option<boolean>> & InputProps) => {
	return <ValidatedInput {...props} 
	makeInputProps={(v) => {return {checked:v.getOrElse(false)} }}
	convertChange={(e) => option.some(e.target.checked)}
	type="checkbox"/>;
}

function momentToString(m: Option<moment.Moment>, timeVar: moment.unitOfTime.All) {
	if(m.isNone()){
		return option.none;
	} else {
		return option.some(String(m.getOrElse(undefined).get(timeVar)));
	}
}

function stringToMoment(s: Option<string>, timeVar: moment.unitOfTime.All, initValue: Option<moment.Moment>) {
	if(s.isNone()){
		return option.none;
	}
	const timeVarValue = Number(s.getOrElse(undefined));
	return option.some(initValue.getOrElse(moment()).set(timeVar, timeVarValue));
}

var lastMoment;

export const ValidatedMomentInput = (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & {format : string, start:moment.Moment,end:moment.Moment, lower?:moment.Moment, upper?:moment.Moment, inc: any, timeVar: moment.unitOfTime.All, sToM? : typeof stringToMoment, mToS?: typeof momentToString}) => {
	const {format,start,end,inc,timeVar,sToM,mToS,updateValue,upper,lower,...others} = props;
	const selectOptions: {value: SelectOptionType, display: ReactNode} [] = [];
	const initValue = props.initValue;
	const valval = lower === undefined ? undefined : lower.toJSON();
	React.useEffect(() => {
		if(upper == undefined || lower == undefined){
			console.log("bad");
			return;
		}
		if(format == "mm"){
			console.log(lastMoment == upper);
			lastMoment = upper;
		}
		if(initValue.isSome()){
			if(initValue.value > upper){
				console.log("bonk");
				updateValue(option.some(upper));
			}
			if(initValue.value < lower){
				console.log("donk");
				updateValue(option.some(lower));
			}
		}
	}, [JSON.stringify(lower), JSON.stringify(upper), JSON.stringify(initValue)]);
	for(let m = start.clone(); m <= end; m.add(inc)){
		if(mToS === undefined){
			selectOptions.push({value: m.get(timeVar), display: m.format(format)});
		}else{
			selectOptions.push({value: mToS(option.some(m),timeVar).getOrElse(""), display: m.format(format)})
		}
	}
	const paddedInitValue = mToS === undefined ? momentToString(initValue, timeVar) : mToS(initValue, timeVar);
	const paddedUpdateValue = (value: Option<string>) => {
		const paddedValue = (sToM === undefined ? stringToMoment(value, timeVar, initValue) : sToM(value, timeVar, initValue));
		if(paddedValue.isNone()){
			updateValue(option.none);
		}else if(paddedValue.value > upper){
			updateValue(option.some(upper));
		}else if(paddedValue.value < lower){
			updateValue(option.some(lower));
		}else{
			updateValue(paddedValue);
		}
	}
	return (<ValidatedSelectInput {...others}
		initValue={paddedInitValue} updateValue={paddedUpdateValue} selectOptions={selectOptions}
	/>);
}

export type MomentInputBoundary = {lower:moment.Moment,upper:moment.Moment};

function makeValidatedInputBounded (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary &
	{format: string, inc: any, boundVar: moment.unitOfTime.StartOf, timeVar: moment.unitOfTime.All}) : JSX.Element {
	const {lower,upper,format,inc,boundVar,timeVar,updateValue,...other} = props;
	const initialValue = props.initValue.getOrElse(moment());
	const updateValueBounded = (v) => {
		if(v.isNone()){
			updateValue(option.none);
		}else if(v.getOrElse(undefined) > upper){
			updateValue(option.some(upper));
		}else if(v.getOrElse(undefined) < lower){
			updateValue(option.some(lower));
		}else{
			updateValue(v);
		}
	};
	return (
		<ValidatedMomentInput {...other}
		updateValue={updateValue}
		upper={upper}
		lower={lower}
		format={format}
		inc={inc}
		start={cloneAndMax(initialValue,lower,boundVar)}
		end={cloneAndMin(initialValue,upper,boundVar)}
		timeVar={timeVar}
		/>
	);
}

export const ValidatedSecondInput = (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const boundVar : moment.unitOfTime.StartOf = "minute";
	const timeVar : moment.unitOfTime.All = "second";
	const moreProps = {...props,format:"ss",inc:{seconds:1},boundVar:boundVar,timeVar:timeVar};
	return makeValidatedInputBounded(moreProps);
}

export const ValidatedMinuteInput = (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const boundVar : moment.unitOfTime.StartOf = "hour";
	const timeVar : moment.unitOfTime.All = "minute";
	const moreProps = {...props,format:"mm",inc:{minutes:1},boundVar:boundVar,timeVar:timeVar};
	return makeValidatedInputBounded(moreProps);
}

function hourStart (initTime: moment.Moment){
	var nextTime = initTime.clone();
	while(nextTime.get("hour") % 12 !== 0){
		nextTime = nextTime.subtract(1, "hour");
	}
	return nextTime;
}

export const ValidatedHourInput = (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const {lower,upper,...other} = props;
	const initialValue = props.initValue.getOrElse(moment());
	const valueStart = hourStart(initialValue);
	return (
		<ValidatedMomentInput {...other}
		format="hh"
		inc={{hour:1}}
		start={moment.max(valueStart,lower.clone().startOf("hour"))}
		end={moment.min(valueStart.clone().add(11, "hours"),upper.clone().endOf("hour"))}
		timeVar="hours"
		mToS={(o, t) => {
			return o.isNone() ? option.none : option.some(String(o.value.get("hour") % 12));
		}}
		sToM={
			(s,t,i) => {
				if(s.isNone()){
					return option.none;
				}
				var newHour = Number(s.getOrElse(undefined))
				if(i.getOrElse(moment()).format("a") === "pm"){
					newHour += 12;
				}
				return option.some(i.getOrElse(moment()).clone().set(t,newHour));
			}
		}
		/>);
}

const PM = "PM";
const AM = "AM";

export const ValidatedAmPmInput = (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const {lower,upper,...other} = props;
	const initialValue = props.initValue.getOrElse(moment());
	return (
		<ValidatedMomentInput {...other}
		format="A"
		inc={{hour:12}}
		start={moment.max(initialValue.clone().startOf("day"),lower)}
		end={moment.min(initialValue.clone().endOf("day"),upper)}
		timeVar="hours"
		mToS={(m, t) => {
			if(m.isNone()){
				return option.none;
			}
			if(m.getOrElse(undefined).get(t) >= 12){
				return option.some(PM);
			}
			return option.some(AM);
		}}
		sToM={
			(s,t,i) => {
				if(s.isNone()){
					return option.none;
				}
				var newHour = i.getOrElse(moment()).get(t);
				if(s.getOrElse("") === AM && newHour >= 12){
					newHour -= 12;
				}else if(s.getOrElse("") === PM && newHour < 12){
					newHour += 12;
				}
				return option.some(i.getOrElse(moment()).clone().set(t,newHour));
			}
		}
		/>);
}

export const ValidatedDateInput = (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const boundVar : moment.unitOfTime.StartOf = "month";
	const timeVar : moment.unitOfTime.All = "date";
	const moreProps = {...props,format:"DD",inc:{days:1},boundVar:boundVar,timeVar:timeVar};
	return makeValidatedInputBounded(moreProps);
}

export const ValidatedMonthInput = (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const boundVar : moment.unitOfTime.StartOf = "year";
	const timeVar : moment.unitOfTime.All = "month";
	const moreProps = {...props,format:"MMMM",inc:{months:1},boundVar:boundVar,timeVar:timeVar};
	return makeValidatedInputBounded(moreProps);
}

export const ValidatedYearInput = (props: ValidatedInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const {lower,upper,...other} = props;
	return (
		<ValidatedMomentInput {...other}
		format="yyyy"
		inc={{years:1}}
		start={lower}
		end={upper}
		timeVar="years"
		/>);
}

export function wrapForFormComponentsMoment(rowForEdit: any, updateState: UpdateStateType, rowId: string, validationResults: validationError[]){
	const initMoment = moment(rowForEdit[rowId]);
	return {
		initValue:initMoment.isValid() ? option.some(initMoment) : option.none,
		updateValue:(v) => {
			updateState(rowId, v.getOrElse(moment()).format())
		},
		validationResults: validationResults.filter((a) => a["key"] == rowId),
		id: rowId
	};
}

export function wrapForFormComponents (rowForEdit: any, updateState: UpdateStateType, rowId: string, validationResults: validationError[]){
	return {
		initValue:option.some(rowForEdit[rowId]),
		updateValue:(v) => {
			updateState(rowId, v.getOrElse(""));
		},
		validationResults: validationResults.filter((a) => a["key"] == rowId),
		id: rowId
	};
}

function cloneAndMax(m:moment.Moment,lower:moment.Moment,startOfType:moment.unitOfTime.StartOf) : moment.Moment {
	return moment.max(m.clone().startOf(startOfType),lower.clone()).clone();
}

function cloneAndMin(m:moment.Moment,upper:moment.Moment,startOfType:moment.unitOfTime.StartOf) : moment.Moment {
	return moment.min(m.clone().endOf(startOfType),upper.clone()).clone();
}