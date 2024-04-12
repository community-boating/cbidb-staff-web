import { PostString, PostJSON } from './APIWrapperTypes';
import { Either } from 'fp-ts/lib/Either';
import { none, Option, some } from 'fp-ts/lib/Option';
import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

//import asc from "app/AppStateContainer";
import { removeOptions } from 'util/deserializeOption';
import { HttpMethod } from "./HttpMethod";
import { PostType, Config, ApiResult, ServerParams } from './APIWrapperTypes';
import * as moment from 'moment';
import { AppStateCombined } from 'app/state/AppState';
import { DefaultDateTimeFormat } from 'util/OptionalTypeValidators';

export const ERROR_DELIMITER = "\\n"

interface PostValues {content: string, isJson: boolean, headers: {}}

const searchJSCONMetaData: (metaData: any[]) => (toFind: string) => number = metaData => toFind => {
	for (var i=0; i<metaData.length; i++) {
		const name = metaData[i]["name"];
		if (name == toFind) return i;
	}
	return null;
}

var apiAxios: AxiosInstance;

function getOrCreateAxios(serverParams: ServerParams) {
	if (apiAxios == null) {
		console.log('instantiating axios');
		const portString = (function() {
			if (
				(serverParams.https && serverParams.port != 443) || 
				(!serverParams.https && serverParams.port != 80)
			) return `:${serverParams.port}`
			else return "";
		}());

		apiAxios = axios.create({
			baseURL: `${serverParams.https ? "https://" : "http://"}${serverParams.host}${portString}`,
			maxRedirects: 0,
			responseType: "json",
			transformRequest: axios.defaults.transformRequest,
			transformResponse: axios.defaults.transformResponse
			// xsrfCookieName: "XSRF-TOKEN",
			// xsrfHeaderName: "X-XSRF-TOKEN",
		})
	}
	return apiAxios;
}

const PostURLEncoded: <T extends {[K: string]: string}>(o: T) => string = o => {
	var arr = [];
	for (var p in o) {
		arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(o[p]));
	}
	return arr.join('&')
}

export const makePostString: <T_PostJSON extends {[K: string]: string}>(forString: T_PostJSON) => PostString<T_PostJSON> = forString => ({
	type: "urlEncoded",
	urlEncodedData: PostURLEncoded(forString)
})
export const makePostJSON: <T_PostJSON extends object>(jsonData: T_PostJSON) => PostJSON<T_PostJSON> = jsonData => ({type: "json", jsonData})

export const API_CODE_NOT_LOGGED_IN = "API.NOT.LOGGED.IN"

export const API_CODE_INSUFFICIENT_PERMISSION = "API.INSUFFICIENT.PERMISSION"

var testAuth: {uuidCookie: string, idCookie: string} = undefined

// TODO: do we still need do() vs send() vs sendWithHeaders(), can probably tidy this all up into one function that does the thing
export default class APIWrapper<T_ResponseValidator extends t.Any, T_PostBodyValidator extends t.Any, T_FixedParams = any, T_Params = any> {
	config: Config<T_ResponseValidator, T_PostBodyValidator, T_FixedParams>
	constructor(config: Config<T_ResponseValidator, T_PostBodyValidator, T_FixedParams>) {
		this.config = config;
	}
	sendRaw(params, data, options?): Promise<any> {
		return getOrCreateAxios(params).post(this.config.path, data, options)
	}
	send: (asc: AppStateCombined) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = (asc) => this.sendWithParams(asc, none)(undefined)
	sendJson: (asc: AppStateCombined, data: t.TypeOf<T_PostBodyValidator>, params?: T_Params) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = (asc, data, params) => this.sendWithParams(asc, none, params)(makePostJSON(data))
	sendFormUrlEncoded: (asc: AppStateCombined, data: t.TypeOf<T_PostBodyValidator>, params?: T_Params) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = (asc, data, params) => this.sendWithParams(asc, none, params)(makePostString(data))
	// send: (data: PostType<t.TypeOf<T_PostBodyValidator>>) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = data => this.sendWithParams(none)(data)
	sendWithParams: (asc: AppStateCombined, serverParamsOption: Option<ServerParams>, params?: T_Params) => (data: PostType<t.TypeOf<T_PostBodyValidator>>) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = (asc, serverParamsOption, params) => data => {
		if(this.config.permissions){
			var perm = true;
			if(!asc.state.login.authenticatedUserName.isSome()){
				return Promise.resolve({
					type: "Failure",
					code: API_CODE_NOT_LOGGED_IN
				});
			}
			this.config.permissions.forEach((a) => {perm = perm && asc.state.login.permissions[a]})
			if(!perm)
				return Promise.resolve({
					type: "Failure",
					code: API_CODE_INSUFFICIENT_PERMISSION
				});
		}
		moment.fn.toJSON = function() { return this.format(DefaultDateTimeFormat); }
		const serverParams = serverParamsOption.getOrElse((process.env as any).serverToUseForAPI);
		const self = this;
		type Return = Promise<ApiResult<t.TypeOf<T_ResponseValidator>>>;
		const postValues: Option<PostValues> = (function() {
			if (self.config.type === HttpMethod.POST || self.config.type === HttpMethod.DELETE) {
				if (data == undefined) return none;
				else if (data.type == "urlEncoded") {
					const content = data.urlEncodedData
					return some({
						content,
						isJson: false,
						headers: {}
					})
				} else {
					const content = !(data.jsonData as any instanceof Array ) ? removeOptions({convertEmptyStringToNull: true})({
						...data.jsonData,
						...(self.config.fixedParams || {})
					}) : removeOptions({convertEmptyStringToNull: true})(
							Object.assign(data.jsonData, self.config.fixedParams)
					);
					if (content == undefined) return none;
					else return some({
						content,
						isJson: true,
						headers: {}
					})
				}
			} else return none;
		}());
		const postBodyValidationError = postValues.chain(({isJson, content}) => {
			if (!isJson || self.config.type != "POST") return none;
			const validationResult = self.config.postBodyValidator.decode(content);
			if (validationResult.isLeft()) return some(PathReporter.report(validationResult).join(", "))
			else return none;
		});

		if (postBodyValidationError.isSome()) {
			console.log("postBodyError");
			console.log(postBodyValidationError);
			return Promise.resolve({
				type: "Failure", code: "post_body_parse_fail", message: "Invalid submit. Are you missing required fields?", extra: postBodyValidationError.getOrElse(null)
			})
		} else {
			const testAuthHeader = ((process.env.NODE_ENV == "test" && testAuth != undefined) ? {Cookie: testAuth.idCookie + ";" + testAuth.uuidCookie} : {})
			const headers = {
				...testAuthHeader,
				...serverParams.staticHeaders,
				...(self.config.extraHeaders || {}),
				...postValues.map(pv => pv.headers).getOrElse(null)
			}

			return (params != undefined ? getOrCreateAxios(serverParams)({
				method: self.config.type,
				url: (serverParams.pathPrefix || "") + self.config.path,
				params: params,
				data: postValues.map(pv => pv.content).getOrElse(null),
				headers
			}) : getOrCreateAxios(serverParams)({
				method: self.config.type,
				url: (serverParams.pathPrefix || "") + self.config.path,
				data: postValues.map(pv => pv.content).getOrElse(null),
				headers
			})).then((res: AxiosResponse) => {
				if(process.env.NODE_ENV == "test" && res.headers['set-cookie'] != undefined && res.headers['set-cookie'].length > 0){
					const sessionUUIDCookieHeader = res.headers['set-cookie'].find((a) => a.startsWith("sessionUUID="))
					const sessionIDCookieHeader = res.headers['set-cookie'].find((a) => a.startsWith("sessionID="))
					if(sessionUUIDCookieHeader != undefined && sessionIDCookieHeader != undefined){
						const sessionUUIDCookie = sessionUUIDCookieHeader.substring(0, sessionUUIDCookieHeader.indexOf("; "))
						const sessionIDCookie = sessionIDCookieHeader.substring(0, sessionIDCookieHeader.indexOf("; "))
						testAuth = {
							uuidCookie: sessionUUIDCookie,
							idCookie: sessionIDCookie
						}
					}
				}
				return this.parseResponse(asc, res.data);
			}, err => {
				console.log("Send Error: ", err);
				const ret: Return = Promise.resolve({type: "Failure", code: "fail_during_send", message: "An internal error has occurred.", extra: {err}});
				console.log(ret);
				return ret;
			})
			.catch(err => {
				const ret: Return = Promise.resolve({type: "Failure", code: "fail_during_parse", message: "An internal error has occurred.", extra: {err}});
				console.log("Parse Error: ", err);
				return ret;
			})
		}
	}
	private parseResponse: (asc: AppStateCombined, response: any) => ApiResult<t.TypeOf<T_ResponseValidator>> = (asc, response) => {
		type Result = t.TypeOf<T_ResponseValidator>;
		type Return = ApiResult<t.TypeOf<T_ResponseValidator>>;
		const self = this;

		let parsed;
		try {
			parsed = response // JSON.parse(response)
		} catch (e) {
			const catchRet: Return = {type: "Failure", code: "client_not_json", message: "An internal error has occurred.", extra: {rawResponse: response}};
			// console.log(catchRet)
			return catchRet;
		}
		
		if (parsed["error"]) {
			// Did the session time out? 
			if (parsed.error.code == "unauthorized") {
				asc.stateAction.login.logout();
				// TODO: call the is-logged-in endpoint and verify we are indeed not logged in
				// TODO: differentiate between unauthorized from cbi api vs some other random host (is that a supported use case?)
			}
			const ret2: Return = {type: "Failure", code: parsed.error.code, message: parsed.error.message, extra: parsed.error}
			// console.log(ret2)
			return ret2
		}

		// If this is a JSCON endoint, loop through the data array and map each obj array to an actual object,
		// using the JSCON metadata and the defined mapping from our prop name to metadata column name
		const candidate = (function() {
			if (!self.config.jsconMap) return parsed;
			else {
				try {
					const rows = parsed["data"]["rows"];
					const metaData = parsed["data"]["metaData"];

					const mapFunction = searchJSCONMetaData(metaData)

					// mapping from prop name we care about to position in the JSCON array
					const columnMap = (function() {
						let map: any = {};
						for (var prop in self.config.jsconMap) {
							const jsconColumnName = self.config.jsconMap[prop]
							map[prop] = mapFunction(jsconColumnName)
						}
						return map;
					}());

					let retArray: any = [];
					rows.forEach((row: any) => {
						let rowObject: any = {};
						for (var prop in self.config.jsconMap) {
							rowObject[prop] = row[columnMap[prop]];
						}
						retArray.push(rowObject)
					})
					return retArray;
				} catch (e) {
					return parsed;
				}
			}
		}());
		const decoded: Either<t.Errors, Result> = this.config.resultValidator.decode(candidate)
		return (function() {
			let ret: Return
			if (decoded.isRight()) {
				ret = {type: "Success", success: decoded.getOrElse(null)};
			} else {
				ret = {type: "Success", success: candidate};
				//ret = {type: "Failure", code: "parse_failure", message: "An internal error has occurred.", extra: {parseError: PathReporter.report(decoded).join(", ")}};
			} 
			return ret;
		}());
	}
}
