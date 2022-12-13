import * as t from "io-ts";
import { OptionalString } from "util/OptionalTypeValidators";

export const membershipValidator = t.type({
    activeDate: t.string,
    endDate: t.string,
    type: t.string,
    programId: t.number,
    guestPrivileges: t.boolean
})

export const skipperValidator = t.type({
    nameFirst: t.string,
    nameLast: t.string,
    personId: t.number,
    $$personRatings: t.any,
    comments: OptionalString,
    hold: t.boolean,
    $$memberships: t.array(membershipValidator)
});

export const crewValidator = t.array(skipperValidator);