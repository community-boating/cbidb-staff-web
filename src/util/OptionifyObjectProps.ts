import { option } from "fp-ts";
import { none, Option } from "fp-ts/lib/Option";
import * as t from 'io-ts'
import * as _ from 'lodash';

export type OptionifiedProp<T> = T extends Option<any> ? T : Option<T>;

export declare type OptionifiedProps<T extends object> = {
	[Property in keyof T]: OptionifiedProp<T[Property]>;
}

export function optionifyProps<T extends object>(obj: T): OptionifiedProps<T> {
	// This lodash type def is bugged
	return _.mapValues(obj, p => {
		if(p == undefined || p == null || p['_tag'] == "None"){
			return option.none;
		}else if(p["_tag"] == "Some"){
			return p;
		}
		return option.some(p);
	}) as OptionifiedProps<T> 
}

export function deoptionifyProps<T extends object>(form: OptionifiedProps<T>, validator: t.TypeC<any>): T {
	// This lodash type def is bugged
	var ret: any = {};
	for (var prop in form) {
		if (undefined === validator.props[prop as string]) {
			ret[prop as string] = !(form[prop] instanceof Object) ? form[prop] : form[prop]["_tag"] !== undefined ? form[prop].getOrElse(null) : form[prop];
		} else {
			switch (validator.props[prop as string].name) {
			case "boolean":
				ret[prop as string] = form[prop].getOrElse(false as any);
				break;
			default:
				if(validator.props[prop as string].name.startsWith("Optional")){
					ret[prop as string] = form[prop];
					break;
				}
				ret[prop as string] = form[prop].getOrElse(null);
				break;
				
			}
		}
	}
	return ret as { [P in keyof OptionifiedProps<T>]: T[P]; };
}

// Given a type validator, return the object that is t.TypeOf<typeof validator> but with all the props as none
export function optionifyAndMakeDefault<T extends t.Props, U extends t.TypeC<T>>(validator: U): {[K in keyof t.TypeOf<U>]: Option<t.TypeOf<U>[K]>} {
	let ret: any = {}
	Object.keys(validator.props).forEach(key => {
		ret[key] = none
	})
	return <{[K in keyof t.TypeOf<U>]: t.TypeOf<U>[K]}>ret
}