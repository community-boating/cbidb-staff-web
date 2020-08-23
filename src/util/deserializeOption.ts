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

export function removeOptions(x: any): any {
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
				return x.map(e => removeOptions(e))
			} else if (x instanceof Some) {
				return x.value
			} else if (x instanceof None) {
				return null
			} else {
				var ret: any = {};
				for (var p in x) {
					ret[p] = removeOptions(x[p]);
				}
				return ret;
			}
		}
}