import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import {responseSuccessValidator} from "models/api-generated/staff/dockhouse/scan-card/get"

export type ScannedPersonType = t.TypeOf<typeof responseSuccessValidator>;

export type ScannedCrewType = ScannedPersonType[];

const path = "/staff/dockhouse/scan-card"

export const getWrapper = (cardNumber: string) => new APIWrapper({
	path: path + "?cardNumber=" + cardNumber,
	type: HttpMethod.GET,
	resultValidator: responseSuccessValidator
})
