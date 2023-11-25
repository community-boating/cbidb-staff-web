import { ApiResult, Success } from "core/APIWrapperTypes";

export function combineApis(apis: ApiResult<any>[]): ApiResult<any> {
	const fails = apis.filter(a => a.type == "Failure")
	if (fails.length > 0) {
		return fails[0];
	} else {
		return {
			type: "Success",
			success: apis.map(a => (a as Success<any>).success)
		}
	}
}