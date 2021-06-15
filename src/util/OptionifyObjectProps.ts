import { none, Option, some } from "fp-ts/lib/Option";
import * as _ from 'lodash';

export declare type OptionifiedProps<T extends object> = {
	[Property in keyof T]: Option<T[Property]>;
}

export function optionifyProps<T extends object>(obj: T): OptionifiedProps<T> {
	// This lodash type def is bugged
	return _.mapValues(obj, p => some(p)) as { [P in keyof T]: Option<T[P]>; }
}

export function deoptionifyProps<T extends object>(form: OptionifiedProps<T>): T {
	// This lodash type def is bugged
	return _.mapValues(form, p => p.getOrElse(null)) as { [P in keyof OptionifiedProps<T>]: T[P]; };
}