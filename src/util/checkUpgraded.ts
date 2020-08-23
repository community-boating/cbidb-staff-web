import * as url from 'url';
import * as querystring from 'querystring';
import { History } from 'history';

export const upgradedParamName = "updatedForReq"

function didWeJustReload() {
	const parsedUrl = url.parse(window.location.href);
	const parsedQs = querystring.parse(parsedUrl.query);
	return undefined !== parsedQs[upgradedParamName];
}

export function checkUpgraded(nodeHistory: History<any>, currentClientEFuse: number) {
	const ret = didWeJustReload()
	if (ret) {
		const parsedUrl = url.parse(window.location.href);
		const parsedQs = querystring.parse(parsedUrl.query);
		const requiredEFuse = Number(parsedQs[upgradedParamName]);
		const satisfied = currentClientEFuse >= requiredEFuse;
		if (!satisfied) {
			nodeHistory.replace("/maintenance")
		}
		history.replaceState({}, "", window.location.pathname)
		
	}
	return ret;
}

export function checkUpgradedAsValidationErrorArray(nodeHistory: History<any>, currentClientEFuse: number) {
	const message = "An urgent update was just performed. Your last action was processed if it was possible to do so.  We apologize for the inconvenience!";
	return (checkUpgraded(nodeHistory, currentClientEFuse)) ? [message] : [];
}

// export function doEFuseCheck(nodeHistory: History<any>) {
// 	if (!didWeJustReload()) {
// 		getEFuse.send(null).then(res => {
// 			if (res.type == "Success") {
// 				const requiredEFuse = Number(res.success);
// 				const clientEFuse = Number((process.env as any).eFuse);
// 				if (clientEFuse < requiredEFuse) {
// 					window.location.href = `/?${upgradedParamName}=${requiredEFuse}`
// 				}
// 			}
// 		})
// 	}
// }