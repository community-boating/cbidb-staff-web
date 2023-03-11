import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

const validator = t.type({
	users: t.array(t.type({
		username: t.string,
		email: t.string,
		userid: t.string,
		fullname: t.string,
		displayname: t.string
	})),
	userStatus: t.array(t.type({
		userid: t.string,
		dbEmail: t.string,
		matchesOnEmail: t.number,
		banned: t.boolean,
		nonActiveMember: t.boolean
	})),
	messages: t.array(t.string)
})

export type SlackUserSyncApiResult = t.TypeOf<typeof validator>

const path = "/staff/slack-sync-users"

export const post = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: validator,
	postBodyValidator: t.any,
})
