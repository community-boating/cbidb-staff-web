import * as t from 'io-ts'
import { Option, some, none } from 'fp-ts/lib/Option';
import * as moment from "moment";

export const DefaultDateTimeFormat = "YYYY-MM-DDTHH:mm:ss";
export const DefaultDateFormat = "YYYY-MM-DD";

export const OptionalDateTime = new t.Type<Option<moment.Moment>, string, unknown>(
	'OptionalDateTime',
	(u) : u is Option<moment.Moment> => {return u["_tag"] !== undefined || u['isMoment']},
	(u, c) => t.union([t.string, t.null, t.undefined, t.object]).validate(u, c).chain(s => {
		if (s === null || s === undefined) return t.success(<Option<moment.Moment>>none)
		else return t.success(some(moment(s, DefaultDateTimeFormat)))
	}),
	a => a.fold("None", (s) => `some(${s.format(DefaultDateTimeFormat)})`)
)

export const OptionalDate = new t.Type<Option<moment.Moment>, string, unknown>(
	'OptionalDate',
	(u) : u is Option<moment.Moment> => u["_tag"] !== undefined,
	(u, c) => t.union([t.string, t.null, t.undefined]).validate(u, c).chain(s => {
		if (s === null || s === undefined) return t.success(<Option<moment.Moment>>none)
		else return t.success(some(moment(s, DefaultDateFormat)))
	}),
	a => a.fold("None", (s) => `some(${s.format()})`)//a.fold("None", (s) => `some(${s.format()})`)
)

export const OptionalString = new t.Type<Option<string>, string, unknown>(
	'OptionalString',
	(u): u is Option<string> => u instanceof Option, // TODO: this is not the Option you think it is.  Replace with something like (undefined !== u["_tag"])
	(u, c) =>
		t.union([t.string, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<string>>none)
			else return t.success(some(s))
		}),
	a => a.fold("None", (s) => `some(${s})`)
)

export const OptionalStringList = new t.Type<Option<string[]>, string, unknown>(
	'OptionalString',
	(u): u is Option<string[]> => u instanceof Option,
	(u, c) =>
		t.union([t.array(t.string), t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<string[]>>none)
			else return t.success(some(s))
		}),
	a => a.fold("None", (s) => `some(${s})`)
)

export const OptionalNumber = new t.Type<Option<number>, string, unknown>(
	'OptionalNumber',
	(u): u is Option<number> => u instanceof Option,
	(u, c) =>
		t.union([t.number, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<number>>none)
			else return t.success(some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)

export const OptionalBoolean = new t.Type<Option<boolean>, string, unknown>(
	'OptionalBoolean',
	(u): u is Option<boolean> => u instanceof Option,
	(u, c) =>
		t.union([t.boolean, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<boolean>>none)
			else return t.success(some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)

export const makeOptionalProps = <T extends t.TypeC<any>>(someValidator: T) => {
	const newProps = Object.assign({}, someValidator.props);
	Object.keys(someValidator.props).forEach((a) => {
		newProps[a] = makeOptional(someValidator.props[a]);
	})
	return t.type(newProps);
}


export const makeOptional = <T extends t.Any>(someValidator: T) => new t.Type<Option<t.TypeOf<T>>, string, unknown>(
	'Optional',
	(u): u is Option<t.TypeOf<T>> => u instanceof Option,
	(u, c) =>
		t.union([someValidator as t.Any, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<t.TypeOf<T>>>none)
			else if(s["_tag"] !== undefined) return t.success(s)
			else return t.success(some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)