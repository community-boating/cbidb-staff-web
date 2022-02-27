import { toMomentFromLocalDate, toMomentFromLocalDateTime } from "@util/dateUtil";
import { OptionalNumber, OptionalString } from "@util/OptionalTypeValidators";
import * as t from "io-ts";
import APIWrapper from "../../core/APIWrapper";
import { HttpMethod } from "../../core/HttpMethod";

export const memSaleValidator = t.type({
	assignId: t.number,
	membershipTypeId: t.number,
	programId: t.number,
	discountInstanceId: OptionalNumber,
	closeId: t.number,
	voidCloseId: OptionalNumber,
	purchaseDate: OptionalString,
	startDate: OptionalString,
	expirationDate: OptionalString,
	price: t.number,
	saleClosedDatetime: OptionalString,
	voidClosedDatetime: OptionalString,
});

export const validator = t.array(memSaleValidator);

export const mapSalesRecord = (r: t.TypeOf<typeof memSaleValidator>) => ({
	...r,
	purchaseDate: r.purchaseDate.map(toMomentFromLocalDateTime),
	startDate: r.startDate.map(toMomentFromLocalDate),
	expirationDate: r.expirationDate.map(toMomentFromLocalDate),
	saleClosedDatetime: r.saleClosedDatetime.map(toMomentFromLocalDateTime),
	voidClosedDatetime: r.voidClosedDatetime.map(toMomentFromLocalDateTime),
});

export type SalesRecord = ReturnType<typeof mapSalesRecord>;

const path = "/rest/membership-sale";

export const getWrapper = (calendarYear: number) => new APIWrapper({
	path: path + "?calendarYear=" + calendarYear,
	type: HttpMethod.GET,
	resultValidator: validator,
});
