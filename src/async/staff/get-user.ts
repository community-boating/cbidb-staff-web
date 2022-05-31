import { OptionifiedProps, optionifyAndMakeDefault } from 'util/OptionifyObjectProps';
import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const validator = t.type({
	ACTIVE: t.boolean,
	USER_NAME: t.string,
	USER_ID: t.number,
	NAME_LAST: OptionalString,
	NAME_FIRST: OptionalString,
	EMAIL: t.string,
	USER_TYPE: OptionalString,
	PW_CHANGE_REQD: t.boolean,
	LOCKED: t.boolean,
	HIDE_FROM_CLOSE: t.boolean,
});

export type User = t.TypeOf<typeof validator>;

export type UserForm = OptionifiedProps<User>;

export const formDefault: UserForm = optionifyAndMakeDefault(validator);

const path = "/staff/get-user"

export const apiw = (userId: number) => new APIWrapper({
	path: path + "?userId=" + userId,
	type: HttpMethod.GET,
	resultValidator: validator,
})
