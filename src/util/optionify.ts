import { Option, some, none } from "fp-ts/lib/Option";

export default function<T>(x: T): Option<T> {
	if (x === null || x === undefined || (x as unknown as string) === "") return none;
	else return some(x);
}