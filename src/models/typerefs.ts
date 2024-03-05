import * as t from "io-ts";

import { responseSuccessValidator as apClassSessionValidator } from "models/api-generated/staff/rest/ap-class-sessions/today/get"

import { responseSuccessValidator as apClassInstanceValidator } from "models/api-generated/staff/rest/ap-class-instances/this-season/get"

import { responseSuccessValidator as apClassTypesValidator } from "models/api-generated/staff/rest/ap-class-types/get"

export enum SignupType{
    WAITLIST="W",
    ACTIVE="A"
}

export type ApClassSessionWithInstance = t.TypeOf<typeof apClassSessionValidator>[number];
export type ApClassSession = Omit<ApClassSessionWithInstance, '$$apClassInstance'>;
export type ApClassInstanceWithSignups = ApClassSessionWithInstance['$$apClassInstance'];
export type ApClassInstance = t.TypeOf<typeof apClassInstanceValidator>[number];
export type ApClassSignup = ApClassSessionWithInstance['$$apClassInstance']['$$apClassSignups'][number]
export type ApClassType = t.TypeOf<typeof apClassTypesValidator>[number];


import { responseSuccessValidator as scanCardModel } from "models/api-generated/staff/dockhouse/scan-card/get";

export type ScannedPersonType = t.TypeOf<typeof scanCardModel>;
export type ScannedCrewType = ScannedPersonType[];

import { requestValidator as signoutModel } from "models/api-generated/staff/dockhouse/create-signout/post";

export type CreateSignoutType = t.TypeOf<typeof signoutModel>;