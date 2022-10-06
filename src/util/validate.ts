import { validMilitaryTime } from "./dateUtil"

export function combineValidations(...results: string[][]): string[] {
	return results.reduce((combined, e) => combined.concat(e), [])
}

export const notBlank = x => x != null && String(x).length > 0

export const validateNotBlank: <T>(colName: string, values: T[]) => string[] = (colName, values) => values
	.filter(x => !notBlank(x))
	.slice(0, 1)
	.map(() => "Column must not be blank: " + colName)

export const validateNumber: <T>(values: T[]) => string[] = values => values
	.filter(notBlank)
	.filter(x => isNaN(Number(x)))
	.map(x => `Not a number: ${x}`)

export const validateMilitaryTime: <T>(values: T[]) => string[] = values => values
	.filter(notBlank)
	.filter(x => !validMilitaryTime(String(x)))
	.map(x => `Invalid time: ${x} (use military time e.g. "13:00")`)
