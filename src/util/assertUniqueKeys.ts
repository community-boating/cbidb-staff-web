import * as Sentry from "@sentry/browser"

// TODO: Figure out how to get this to actually send a stacktrace to sentry
export const assertUniqueKeys: <T extends {key: string}>(es: T[]) => T[] = es => {
	var keys: {[k: string]: true} = {};
	es.forEach(e => {
		const key = e.key || "";
		if (undefined !== keys[key]) {
			try {
				const e = new Error ("Non unique react key " + key);
				Sentry.captureException(e);
				throw e;
			} catch (e) {
				// quietly eat it after throwing to sentry
			}
		}
		keys[key] = true;
	});	
	return es;
}