import * as t from 'io-ts'
import * as option from 'fp-ts/lib/Option';
import * as moment from "moment";

export const DefaultDateTimeFormat = "YYYY-MM-DDTHH:mm:ss";
export const DefaultDateFormat = "YYYY-MM-DD";


export function formatMomentDefaultDateTime(moment: moment.Moment) {
	moment["_f"] = DefaultDateTimeFormat;
	return moment;
}

export function momentNowDefaultDateTime(){
	return formatMomentDefaultDateTime(moment());
}

function isOption(u: unknown): u is option.Option<any> {
	return u && u['_tag'] != undefined;
}

const OptionType = new t.Type<option.Option<any>, string, unknown>(
	'Option',
	(u): u is option.Option<any> => isOption(u),
	(u, c) => {
		if(isOption(u)){
			return t.success(u);
		}else if(u === null || u === undefined){
			return t.success(<option.Option<any>>option.none);
		}else{
			return t.success(<option.Option<any>>option.some(u));
		}
	},
	a => a.fold("None", (s) => `some(${s})`)
)

function OptionalTypeWithExtraValidator<T>(name: string, type: t.Type<T, any, unknown>){
	return (new t.Type<option.Option<T>, string, unknown>(
		name,
		OptionType.is,
		(u, c) => OptionType.validate(u, c).chain((s) => {
			if(s.isNone())
				return t.success(s);
			return type.validate(s.getOrElse(undefined),c).chain((u => t.success(option.some(u))))
		}),
		OptionType.encode
	));
}

function DateWithFormat(name: string, format: string){
	return new t.Type<moment.Moment,string,unknown>(
		name,
		(u): u is moment.Moment => moment.isMoment(u),
		(u, c) => {
			const m = moment(u, format);
			return ((m.isValid()) ? t.success(m) : t.failure(u, c))
		},
		a => a.format(format)
	)
}

export function OptionalEnumType<T>(name: string, e: T){
	return OptionalTypeWithExtraValidator(name, EnumType(name, e));
}


export function EnumType<T extends {[key: string]: any}>(name: string, e: T){
	const revEnum: {[key: string]: any} = {};
	Object.entries(e).forEach((a) => {
		revEnum[a[1]] = e[a[0]];
	});
	return new t.Type<T[keyof T],string,unknown>(
		name,
		(u): u is T[keyof T] => true,
		(u, c) => {
			if(typeof u == 'string' && revEnum[u]){
				return t.success(revEnum[u]);
			}
			return t.failure(u, c);
		},
		a => ("")
	)
}

export const Date = DateWithFormat('Date', DefaultDateFormat);

export const DateTime = DateWithFormat('DateTime', DefaultDateTimeFormat);

export const OptionalDate = OptionalTypeWithExtraValidator("OptionalDate", Date);

export const OptionalDateTime = OptionalTypeWithExtraValidator("OptionalDateTime", DateTime);

export const OptionalString = OptionalTypeWithExtraValidator("OptionalString", t.string);

export const OptionalStringList = OptionalTypeWithExtraValidator("OptionalStringList", t.array(t.string));

export const OptionalNumber = OptionalTypeWithExtraValidator("OptionalNumber", t.number);

export const OptionalBoolean = OptionalTypeWithExtraValidator("OptionalBoolean", t.boolean);

export const makeOptionalPK = <T extends t.TypeC<any>>(someValidator: T, PK: keyof t.TypeOf<T>) => {
	const newProps = Object.assign({}, someValidator.props);
	newProps[PK] = makeOptional(newProps[PK]);
	return t.type(newProps);
}

type OptionalWithKey<A extends {[key: string]: any}, PK extends keyof A> = {
	[PropertyKey in keyof Omit<A, PK>]: t.Type<option.Option<t.TypeOf<Omit<A, PK>[PropertyKey]>>>
} & Pick<A, PK>

export const makeOptionalProps = <A extends {[key: string]: any}, PKT extends keyof A>(someValidator: t.TypeC<A>, PK?: PKT) => {
	const newProps: OptionalWithKey<A, PKT> = {} as any;
	Object.keys(someValidator.props).forEach((a) => {
		if(a != PK)
			(newProps as any)[a] = makeOptional(someValidator.props[a]);
	})
	return t.type(newProps);
}

type derp = OptionalWithKey<{derp: string, yolo: string}, 'derp'>;


export const allowNullUndefinedProps = <T extends t.TypeC<any>>(someValidator: T) => {
	const newProps = Object.assign({}, someValidator.props);
	Object.keys(someValidator.props).forEach((a) => {
		newProps[a] = allowNullUndefined(someValidator.props[a]);
	})
	return t.type(newProps);
}

export const allowNullUndefined = <T extends t.Any>(someValidator: T) => new t.Type<option.Option<t.TypeOf<T>>, string, unknown>(
	someValidator.name,
	(u): u is option.Option<t.TypeOf<T>> => u == undefined || u == null || someValidator.is(u),
	(u, c) =>
		t.union([someValidator as t.Any, t.null, t.undefined]).validate(u, c).chain(s => {
			return t.success(s);
		}),
		a => a.fold("None", (s) => `some(${s})`)
)


export const makeOptional = <T extends t.Any>(someValidator: T) => new t.Type<option.Option<t.TypeOf<T>>, string, unknown>(
	'Optional',
	(u): u is option.Option<t.TypeOf<T>> => isOption(u),
	(u, c) =>
		t.union([someValidator as t.Any, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<option.Option<t.TypeOf<T>>>option.none)
			else if(s["_tag"] !== undefined) return t.success(s)
			else return t.success(option.some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)