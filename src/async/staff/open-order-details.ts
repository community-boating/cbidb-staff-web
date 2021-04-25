import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const paymentValidator = t.type({
	amountCents: t.number,
	expectedDate: t.string,
	orderId: t.number,
	paid: t.boolean,
	staggerId: t.number,
	failedCron: t.boolean,
});

export const validator = t.array(paymentValidator);

const path = "/staff/open-order-details"

export const apiw = (personId: number) => new APIWrapper({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator,
})
