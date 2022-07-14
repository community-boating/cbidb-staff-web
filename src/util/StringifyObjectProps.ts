import { none, some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';

export declare type StringifiedProps<T extends object> = {
	[Property in keyof T]: string;
}

export declare type DisplayableProps<T extends object> = {
	[Property in keyof T]: string | number | JSX.Element;
}

// Given a type validator, return the object that is StringifiedProps<t.TypeOf<typeof validator>> with all the props as the emptystring
export function stringifyAndMakeBlank<T extends t.Props, U extends t.TypeC<T>>(validator: U): {[K in keyof t.TypeOf<U>]: string} {
	let ret: any = {}
	Object.keys(validator.props).forEach(key => {
		ret[key] = ""
	})
	return <{[K in keyof t.TypeOf<U>]: string}>ret
}

export function nullifyEmptyStrings<T>(obj: T): T {
	let ret: any = {}
	Object.keys(obj).forEach(key => {
		ret[key] = (obj[key] === "") ? null : obj[key];
	})
	return <T>ret
}

function stringifyValue(v: any): string {
	if (v === null) {
		return null;	
	} else if (v === undefined) {
		return undefined;
	} else if (v["_tag"]) {
		// it's an option; recurse
		return stringifyValue(v.getOrElse(""));
	} else {
		switch (typeof(v)) {
		case "boolean":
			return v ? "Y" : "N";
		default:
			return String(v);
		}
	}
}

function destringifyPrimitive(v: string, typeName: string): any {
	switch (typeName) {
	case "number":
		return Number(v);
	case "boolean":
		return v == "Y";
	case "string":
	default:
		return v;
	}
}

function destringifyValue(v: string, typeName: string, useOption: boolean): any {
	const isNone = v == null || v == "";
	if (useOption) {
		switch (typeName) {
		case "OptionalNumber":
			return isNone ? none : some(destringifyPrimitive(v, "number"))
		case "OptionalBoolean":
			return isNone ? none : some(destringifyPrimitive(v, "boolean"))
		case "OptionalString":
			return isNone ? none : some(destringifyPrimitive(v, "string"))
		default:
			return destringifyPrimitive(v, typeName);
		}
	} else {
		switch (typeName) {
		case "OptionalNumber":
			return isNone ? null : destringifyPrimitive(v, "number")
		case "OptionalBoolean":
			return isNone ? null : destringifyPrimitive(v, "boolean")
		case "OptionalString":
			return isNone ? null : destringifyPrimitive(v, "string")
		default:
			return destringifyPrimitive(v, typeName);
		}
	}

}

export function stringify<T extends object>(obj: T): StringifiedProps<T> {
	console.log(obj)
	let ret: any = {}
	Object.keys(obj).forEach(key => {
		ret[key] = stringifyValue(obj[key]);
	})
	return <{[K in keyof T]: string}>ret;
}

export function destringify<T extends t.Props, U extends t.TypeC<T>>
(validator: U, stringy: StringifiedProps<t.TypeOf<U>>, useOption: boolean, primaryKey?: string): {[K in keyof t.TypeOf<U>]: t.TypeOf<U>[K]} {
	let ret: any = {}
	Object.keys(stringy).forEach(key => {
		if (primaryKey && key == primaryKey && stringy[key] === null) {
		//	ret[key] = stringy[key];
		// omit a null PK value
		} else {
			ret[key] = destringifyValue(stringy[key], validator.props[key].name, useOption);
		}
		
	})
	return <{[K in keyof t.TypeOf<U>]: t.TypeOf<U>[K]}>ret;
}
