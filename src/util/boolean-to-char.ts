import { none, Option, some } from "fp-ts/lib/Option"

export const nullableBoolToChar = (ob: Option<boolean>) => {
	if (ob.isNone()) return null;
	const b = ob.getOrElse(null);
	if (b === true) return 'Y'
	else if (b === false) return 'N'
	else return null;
}

export const charToNullableBool = (c: string) => {
	if (c === "Y") return some(true);
	else if (c === "N") return some(false)
	else return none;
}