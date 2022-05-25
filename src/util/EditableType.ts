// Given an object type T and a list of noneditable field F
// return T with fields in F having their original types,
// and all otherfields retyped to string
//
// Use to retype an object for a form
export declare type Editable<T extends object, F extends keyof T> = {
	[K in keyof Omit<T, F>]: string
} & {
	[K in keyof Pick<T, F>]: T[K]
}