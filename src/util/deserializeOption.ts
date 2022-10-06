import { none, some, None, Some } from "fp-ts/lib/Option";

export function replaceWithOption(x: any): any {
	switch (typeof(x)) {
	case "number":
	case "string":
	case "boolean":
	case "undefined":
	case "function":
		return x;
	case "object":
		if (x === null) return x;
		else if (x instanceof Array) {
			return x.map(e => replaceWithOption(e))
		}
		else if (x["_tag"] && x["_tag"] == "None") {
			return none;
		} else if (x["_tag"] && x["_tag"] == "Some" && undefined !== x["value"]) {
			return some(x["value"])
		} else {
			var ret: any = {};
			for (var p in x) {
				ret[p] = replaceWithOption(x[p]);
			}
			return ret;
		}
	}
}

export const removeOptions: (config: {convertEmptyStringToNull: boolean}) => (x: any) => any = config => x => {
	switch (typeof(x)) {
		case "number":
		case "boolean":
		case "undefined":
		case "function":
			return x;
		case "string":
			if (config.convertEmptyStringToNull && typeof x == 'string' && x === '') return null;
			else return x;
		case "object":
			if (x === null) return x;
			else if (x instanceof Array) {
				return x.map(e => removeOptions(config)(e))
			} else if (x instanceof Some || x["_tag"] === 'Some') {
				if (config.convertEmptyStringToNull && typeof x.value == 'string' && x.value === '') return null;
				else return x.value;
			} else if (x instanceof None || x["_tag"] === 'None') {
				return null
			} else {
				var ret: any = {};
				for (var p in x) {
					ret[p] = removeOptions(config)(x[p]);
				}
				return ret;
			}
		}
}