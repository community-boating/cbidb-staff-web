import * as t from "io-ts";
import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber, makeOptional } from "util/OptionalTypeValidators";

export const membershipValidator = t.type({
	assignId: t.number,
	personId: t.number,
	membershipTypeId: t.number,
	purchaseDate: t.string,
	startDate: t.string,
	expirationDate: t.string,
	price: t.number,
	voidCloseId: OptionalNumber,
	$$discountInstance: makeOptional(t.type({
		instanceId: t.number,
		$$discount: t.type({
			discountId: t.number,
			discountName: t.string
		})
	}))
});

export const validator = t.array(membershipValidator);

const path = "/rest/person-membership/get-all-for-person";

export const getWrapper = (id: number) =>
	new APIWrapper({
		path: path + "?personId=" + id,
		type: HttpMethod.GET,
		resultValidator: validator,
	});

// const resultValidator = t.type({
// 	assignId: t.number,
// });

// export const putWrapper = new APIWrapper<
// 	typeof resultValidator,
// 	typeof membershipValidator,
// 	null
// >({
// 	path,
// 	postBodyValidator: membershipValidator,
// 	type: HttpMethod.POST,
// 	resultValidator,
// });
