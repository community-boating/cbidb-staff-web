import * as React from 'react';

import { Option} from 'fp-ts/lib/Option';
import { option} from 'fp-ts';
import { ReactNode } from 'react';
import * as moment from "moment";
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'react-feather';
import { DropDownProps, getPositionClassInner, getPositionClassOuter } from './Menu';

export type InputProps = {
    label?: React.ReactNode,
    end?: React.ReactNode,
    isEnd?: boolean,
    groupClassName?: string,
    onEnter?: () => void,
    ref?: any
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const inputClassName = "rounded-md border border-gray-700 p-1 h-input"

const ValidationContext = React.createContext<ValidationType>({validationsById: {}, globalValidations: []});

export type ValidationType = {
	validationsById: {
		[key: string]: React.ReactNode[]
	}
	globalValidations: React.ReactNode[]
};

export type ValidationGroupProps = {
	children?: React.ReactNode;
	validations: ValidationType;
};

export function ValidationGroup(props: ValidationGroupProps){
	return <ValidationContext.Provider value={props.validations}>
		{props.children}
	</ValidationContext.Provider>;
}

export type SelectInputProps = {
    options: React.ReactNode[];
}

export type CustomInputProps<T> = {
	label?: React.ReactNode
	end?: React.ReactNode
	onEnter?: () => void
	controlledValue: T
	updateValue: (value: T) => void
	validationResults?: string[]
	customStyle?: boolean
} & InputProps

type StateType<T> = {
	showErrors: boolean
};

type InputAdapterProps<T> = {
	convertChange: (e: React.ChangeEvent<HTMLInputElement>) => T,
	makeInputProps : (value: T) => any,
}

export function SimpleInput(props: CustomInputProps<string>){
	return <Input {...props} convertChange={(e) => e.target.value} makeInputProps={(v) => ({value: v})}></Input>
}

export function OptionalNumberInput(props: CustomInputProps<option.Option<number>>){
	return <OptionalInput<number> {...props} convert={(v) => parseInt(v)}></OptionalInput>
}

export function OptionalStringInput(props: CustomInputProps<option.Option<string>>){
	return <OptionalInput<string> {...props} convert={(v) => v}></OptionalInput>
}

export function OptionalInput<T>(props: CustomInputProps<option.Option<T>> & {convert: (v: string) => T}){
	const {convert, ...other} = props;
	return <Input {...other} convertChange={(e) => ((e.target.value == "") ? option.none : option.some(convert(e.target.value)))} makeInputProps={(value) => ({value: (value.isSome() ? value.value : "")})}></Input>
}

function Label(props: {children?: React.ReactNode}){
	return <span className="whitespace-nowrap">
		{props.children}
	</span>
}

class Input<T> extends React.PureComponent<(CustomInputProps<T> & InputAdapterProps<T> & InputProps), StateType<T>, any>  {
	constructor(props){
		super(props);
		this.state = { showErrors:false };
	}
	render() {
		var {controlledValue: initValue,className,updateValue,children,makeInputProps,convertChange,onEnter,validationResults,label,end,customStyle,...other}=this.props;
		var errorTooltip = <></>;
		if(validationResults && validationResults.length > 0){
			errorTooltip=<div>{validationResults.map((a) => a["display"] || a)}</div>;
		}
		return (
			<div className="flex flex-row">
				<Label>
					{this.props.label}
				</Label>
			<input {...other} className={(className || "") + " " + (customStyle ? "" : inputClassName)} {...makeInputProps(this.props.controlledValue)} 
			onChange={(e) => {updateValue(convertChange(e))}}
			onBlur={() => {
				this.setState({...this.state,showErrors:false})
				}}
			onFocus={() => {
				this.setState({...this.state,showErrors:true})
			}}
			onKeyDown={(e) => {
				if(onEnter && (e.key == "Enter" || e.keyCode == 13)){
					onEnter();
				}
			}}
			/>
			{errorTooltip}
			{this.props.end}
			</div>
		);
	}
}

export const ValidatedTextInput = (props: (CustomInputProps<any> & InputProps)) => {
	return (<Input {...props} 
	makeInputProps={(v) => {
		return {value:v.getOrElse("")} }}
	convertChange={(e) => e.target.value.trim().length === 0 ? option.none : option.some(e.target.value)
	}/>);
}

export type SelectOption<T_SelectOption> = {value: T_SelectOption, isFunction?: boolean} & ({isFunction?: false, display: ReactNode} | {isFunction: true, display: (active: boolean, selected: boolean) => ReactNode});

export function SelectInput<T_Value extends string | number> (props: CustomInputProps<option.Option<T_Value>> & InputProps & DropDownProps & {selectOptions : SelectOption<T_Value>[], showNone?: SelectOption<T_Value>, selectNone?: boolean, isNumber?: boolean, autoWidth?: boolean, notWhiteBG?: boolean, nowrap?: boolean, fullWidth?: boolean, customStyle?: boolean, makeButton?: (current: SelectOption<option.Option<T_Value>>) => React.ReactNode, openClassName?: string, closedClassName?: string}) {
	const {selectOptions,showNone,selectNone,customStyle,isNumber,autoWidth,notWhiteBG,controlledValue,x,y,updateValue,groupClassName} = props;
	const selectOptionsOptionified: SelectOption<option.Option<T_Value>>[] = React.useMemo(() => selectOptions.map((a) => ({...a, value: option.some(a.value)})), [selectOptions]);
	const showNonePadded: SelectOption<option.Option<T_Value>> = ((showNone === undefined ) ? {value: option.none, display: "None", isFunction: false} : {...showNone, value: option.none})
	const selectOptionsWithNone = React.useMemo(() => [showNonePadded].concat(selectOptionsOptionified), [showNone, selectOptionsOptionified]);
	const useOptions = (selectNone || props.controlledValue.isNone() ? selectOptionsWithNone : selectOptionsOptionified);
	const current = (controlledValue.isSome() ? (selectOptionsOptionified.filter((a) => a.value.isSome() && a.value.value == controlledValue.value)[0]) : showNonePadded);
	const toDisplay = (props.makeButton ? props.makeButton(current) : (current && current.display) ? (current.isFunction ? current.display(false, true) : current.display) : "");
    const options = React.useMemo(() => (useOptions.map((a, i) => (<Listbox.Option key={i} value={a.value} as={React.Fragment}>
		{({active, selected}) => (<div className={(active ? "bg-background" : "") + " w-full flex"}><button className="w-full text-left">{a.isFunction ? a.display(active, selected) : a.display}</button></div>)}
		</Listbox.Option>))), [useOptions]);
	return (<div className={(props.nowrap ? "whitespace-nowrap" : "break-words") + (props.fullWidth ? " w-full" : " w-fit")}>
			<div className="flex flex-row w-full">
				<Label>
					{props.label}
				</Label>
				<Listbox value={controlledValue} onChange={(v) => {updateValue(v);}}>
					{({open}) => 
						<div className="relative w-full">
						<Listbox.Button className={"flex flex-col w-full items-end overflow-hidden " + (customStyle ? "" : inputClassName + " ") + (notWhiteBG ? "" : " bg-white ") + " " + (props.className ? props.className : " ") + " " + (props.openClassName ? (open ? props.openClassName : (props.closedClassName ? props.closedClassName : "")) : "")}>
							<div className="flex flex-row w-full">
								<div className={"text-left grow"}>
									{toDisplay}
								</div>
								{customStyle ? <></> : <ChevronDown className="flex-none"/>}
							</div>
						</Listbox.Button>
						<Listbox.Options className={"absolute z-[100] " + getPositionClassOuter(props)}>
							<div className={"bg-background max-h-[50vh] z-[100] " + getPositionClassInner(props) + " " + (groupClassName?groupClassName:"") + (props.horizontal ? "" : " overflow-y-scroll")}>
								<div className="border-l-2 border-black ml-4 min-h-full w-[2px]"></div>
								{options}
							</div>
						</Listbox.Options>
						</div>
					}
					
				</Listbox>
				{props.end}
			</div>
			{autoWidth ? <div className="relative h-[0px] overflow-hidden">
				{selectOptions.map((a, i) => <div key={i} className={"overflow-hidden whitespace-nowrap flex flex-row gap-4"}>
					<Label>
						{props.label}
					</Label>
						{a.display}
						{customStyle ? <></> : <ChevronDown className="flex-none"/>}
					</div>)}
			</div> : <></>}
		</div>
    );
}

export const CheckboxInput = (props: CustomInputProps<Option<boolean>> & InputProps) => {
	return <Input {...props} 
	makeInputProps={(v) => {return {checked:v.getOrElse(false) == true} }}
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

export const MomentInput = (props: CustomInputProps<Option<moment.Moment>> & InputProps & {format : string, start:moment.Moment,end:moment.Moment, lower?:moment.Moment, upper?:moment.Moment, inc: any, timeVar: moment.unitOfTime.All, sToM? : typeof stringToMoment, mToS?: typeof momentToString}) => {
	const {format,start,end,inc,timeVar,sToM,mToS,updateValue,upper,lower,...others} = props;
	const selectOptions: {value: string | number, display: ReactNode} [] = [];
	const initValue = props.controlledValue;
	const valval = lower === undefined ? undefined : lower.toJSON();
	React.useEffect(() => {
		if(upper == undefined || lower == undefined){
			return;
		}
		if(format == "mm"){
			lastMoment = upper;
		}
		if(initValue.isSome()){
			if(initValue.value > upper){
				updateValue(option.some(upper));
			}
			if(initValue.value < lower){
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
	return (<SelectInput {...others}
		controlledValue={paddedInitValue} updateValue={paddedUpdateValue} selectOptions={selectOptions}
	/>);
}

export type MomentInputBoundary = {lower:moment.Moment,upper:moment.Moment};

function makeInputBounded (props: CustomInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary &
	{format: string, inc: any, boundVar: moment.unitOfTime.StartOf, timeVar: moment.unitOfTime.All}) : JSX.Element {
	const {lower,upper,format,inc,boundVar,timeVar,updateValue,...other} = props;
	const initialValue = props.controlledValue.getOrElse(moment());
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
		<MomentInput {...other}
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

export const SecondInput = (props: CustomInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const boundVar : moment.unitOfTime.StartOf = "minute";
	const timeVar : moment.unitOfTime.All = "second";
	const moreProps = {...props,format:"ss",inc:{seconds:1},boundVar:boundVar,timeVar:timeVar};
	return makeInputBounded(moreProps);
}

export const MinuteInput = (props: CustomInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const boundVar : moment.unitOfTime.StartOf = "hour";
	const timeVar : moment.unitOfTime.All = "minute";
	const moreProps = {...props,format:"mm",inc:{minutes:1},boundVar:boundVar,timeVar:timeVar};
	return makeInputBounded(moreProps);
}

function hourStart (initTime: moment.Moment){
	var nextTime = initTime.clone();
	while(nextTime.get("hour") % 12 !== 0){
		nextTime = nextTime.subtract(1, "hour");
	}
	return nextTime;
}

export const HourInput = (props: CustomInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const {lower,upper,...other} = props;
	const initialValue = props.controlledValue.getOrElse(moment());
	const valueStart = hourStart(initialValue);
	return (
		<MomentInput {...other}
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

export const AmPmInput = (props: CustomInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const {lower,upper,...other} = props;
	const initialValue = props.controlledValue.getOrElse(moment());
	return (
		<MomentInput {...other}
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

export const DateInput = (props: CustomInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const boundVar : moment.unitOfTime.StartOf = "month";
	const timeVar : moment.unitOfTime.All = "date";
	const moreProps = {...props,format:"DD",inc:{days:1},boundVar:boundVar,timeVar:timeVar};
	return makeInputBounded(moreProps);
}

export const MonthInput = (props: CustomInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const boundVar : moment.unitOfTime.StartOf = "year";
	const timeVar : moment.unitOfTime.All = "month";
	const moreProps = {...props,format:"MMMM",inc:{months:1},boundVar:boundVar,timeVar:timeVar};
	return makeInputBounded(moreProps);
}

export const YearInput = (props: CustomInputProps<Option<moment.Moment>> & InputProps & MomentInputBoundary) => {
	const {lower,upper,...other} = props;
	return (
		<MomentInput {...other}
		format="yyyy"
		inc={{years:1}}
		start={lower}
		end={upper}
		timeVar="years"
		/>);
}

function cloneAndMax(m:moment.Moment,lower:moment.Moment,startOfType:moment.unitOfTime.StartOf) : moment.Moment {
	return moment.max(m.clone().startOf(startOfType),lower.clone()).clone();
}

function cloneAndMin(m:moment.Moment,upper:moment.Moment,startOfType:moment.unitOfTime.StartOf) : moment.Moment {
	return moment.min(m.clone().endOf(startOfType),upper.clone()).clone();
}