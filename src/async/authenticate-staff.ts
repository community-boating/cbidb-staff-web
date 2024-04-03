import * as t from 'io-ts';
import APIWrapper from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";

const path = "/authenticate-staff"

export const apiw = () => new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.boolean,
	postBodyValidator: t.type({
		username: t.string,
		password: t.string
	}),
	extraHeaders: {
		"dont-redirect": "true"
	}
})

// export const login = (serverParams: ServerParams) => (dispatch: (action: any) => void, userName: string, password: string) => {
// 	const payload = PostString("username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password))
// 	return apiw.send(serverParams)(payload)
// 	.then(data => {
// 		if (String(data) != "true") {
// 			dispatch({type: "LOGIN_FAILURE"})
// 		} else {
// 			return memberWelcome(serverParams)
// 			.then(response => new Promise((resolve, reject) => {
// 				try {
// 					resolve(JSON.parse(response))
// 				} catch (e) {
// 					reject(e)
// 				}
// 			}))
// 			.then(data => {
// 				dispatch({
// 					type: "SET_FORM", 
// 					formName: homePageFormName,
// 					data: some(data)
// 				})
// 				dispatch({type: "LOGIN_SUCCESS", userName})
// 			})	
// 		}
// 	})
// 	.catch((e) => {
// 		dispatch({type: "LOGIN_FAILURE"})
// 	})
// }