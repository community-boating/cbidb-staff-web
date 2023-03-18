import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import {requestValidator, responseSuccessValidator} from "models/api-generated/staff/dockhouse/create-signout/post"

export type CreateSignoutType = t.TypeOf<typeof requestValidator>

const path = "/staff/dockhouse/create-signout"

export const postWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.POST,
	resultValidator: responseSuccessValidator,
	postBodyValidator: requestValidator
})
