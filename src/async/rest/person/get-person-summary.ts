import * as t from "io-ts";
import APIWrapper from "core/APIWrapper";
import { HttpMethod } from "core/HttpMethod";
import { membershipValidator } from "./get-person-memberships";
import { guestPrivValidator } from "./get-guest-priv";
import { damageWaiverValidator } from "./get-damage-waiver";
import { personSummaryValidator } from "./get-person";

export const validator = t.type({
	personSummary: personSummaryValidator,
	memberships: t.array(membershipValidator),
	guestPrivs: t.array(guestPrivValidator),
	damageWaivers: t.array(damageWaiverValidator),
});

const path = "/rest/person/summary";

export const getWrapper = (id: number) =>
	new APIWrapper({
		path: path + "?personId=" + id,
		type: HttpMethod.GET,
		resultValidator: validator,
	});
